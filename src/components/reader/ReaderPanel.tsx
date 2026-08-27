import { useEffect, useRef, useState } from 'react'
import type { Book, SelectedContext } from '../../types'
import { CHUNK_MAP } from '../../services/mockRag'
import type { AskIntent } from '../../services/answerEngine'
import BookContent from './BookContent'
import SelectionToolbar, { SelectionAction, SelectionRect } from './SelectionToolbar'
import { X, BookOpen } from 'lucide-react'

/**
 * 右栏：简化电子书阅读器（Moment 3 的落点）。
 * - activeCitation（chunkId）：自动 scrollIntoView（block:center）+ 临时高亮
 * - selectedChapterId：滚动到该章开头（目录点击，不触发高亮）
 * - 选中原文 → 浮动工具栏 → 上下文提问（Contextual QA）
 *
 * 关键交互约束（来自 QA）：
 *  1) 提交新问题时 activeCitation 会变为 null —— 必须清除上一次的高亮，不能残留。
 *  2) 提交新问题时 selectedChapterId 不变 —— 绝不能误滚到章节开头（UI 跳动）。
 *  3) 点击另一个 Citation 时，旧高亮必须消失、新片段居中。
 *  用一个统一 effect + prevChapter ref 处理，避免两个 effect 互相打架。
 *
 * 高亮克制：flash 短暂加强后保留柔和常亮，不刺眼。
 */
export default function ReaderPanel({
  book,
  activeCitation,
  selectedChapterId,
  onClose,
  onContextualAsk,
}: {
  book: Book
  activeCitation: string | null
  selectedChapterId: string | null
  onClose?: () => void
  /** 选区发起的上下文提问（Contextual QA）：附带完整 SelectedContext 与意图 */
  onContextualAsk?: (question: string, selection: SelectedContext, intent: AskIntent) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prevChapter = useRef<string | null>(null)
  const [sel, setSel] = useState<{ text: string; chunkId?: string; rect: SelectionRect } | null>(
    null,
  )

  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    // 先清除上一次的高亮（无论本次是定位片段还是清空）
    root.querySelectorAll('.cite-highlight').forEach((el) => {
      el.classList.remove('cite-highlight', 'is-flashing')
    })

    // Moment 3：Citation 定位 + 高亮
    if (activeCitation) {
      const el = root.querySelector(`#chunk-${activeCitation}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const node = el as HTMLElement
        node.classList.add('cite-highlight', 'is-flashing')
        window.setTimeout(() => node.classList.remove('is-flashing'), 1600)
      }
      // 片段定位阶段：把 prevChapter 同步为当前章节。
      // 否则当 highlight 在"提交新答案"时被清除（activeCitation → null），
      // 章节守卫会误判成"章节变化"，把阅读器滚回章节开头（UI 跳动）。
      // 同步后，activeCitation 清空时 selectedChapterId === prevChapter，
      // 守卫条件不成立，阅读器保持原地（Moment 3 的"返回"语义才正确）。
      prevChapter.current = selectedChapterId
      return
    }

    // 目录手动点击：仅当章节真正变化时才滚动（避免提交新问题时误跳章）
    if (selectedChapterId && selectedChapterId !== prevChapter.current) {
      const el = root.querySelector(`#chapter-${selectedChapterId}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    prevChapter.current = selectedChapterId
  }, [activeCitation, selectedChapterId])

  // 选区检测：在阅读器正文内选中文字时出现浮动工具栏
  useEffect(() => {
    function onSelectionChange() {
      const selObj = window.getSelection()
      if (!selObj || selObj.isCollapsed || selObj.rangeCount === 0) {
        setSel(null)
        return
      }
      const text = selObj.toString().trim()
      if (text.length < 2) {
        setSel(null)
        return
      }
      const range = selObj.getRangeAt(0)
      // 必须在阅读器正文容器内（避免选中其它栏也弹工具栏）
      if (!containerRef.current || !containerRef.current.contains(range.commonAncestorContainer)) {
        setSel(null)
        return
      }
      // 找到选区所属的 chunk：沿 startContainer 向上找 [id^="chunk-"]
      let node: Node | null = range.startContainer
      let chunkId: string | undefined
      while (node && node !== containerRef.current) {
        if (node.nodeType === 1 && (node as HTMLElement).id?.startsWith('chunk-')) {
          chunkId = (node as HTMLElement).id.replace('chunk-', '')
          break
        }
        node = node.parentNode
      }
      // 工具栏紧贴「整个 chunk 元素」的边界之外，而非选中的子段。
      // 这样无论选区内跨几行，工具栏都落在 chunk 的上下留白处，绝不压住正文或边框。
      let r = range.getBoundingClientRect()
      if (chunkId) {
        const chunkEl = containerRef.current.querySelector<HTMLElement>(`#chunk-${chunkId}`)
        if (chunkEl) r = chunkEl.getBoundingClientRect()
      }
      setSel({
        text,
        chunkId,
        rect: { top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom },
      })
    }
    document.addEventListener('selectionchange', onSelectionChange)
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange)
    }
  }, [])

  function handleAction(action: SelectionAction) {
    if (!sel || !onContextualAsk) return
    const question = buildContextualQuestion(action, sel.text)
    // 由 chunkId 补全章节 / 页码等上下文，构造完整 SelectedContext
    const chunk = sel.chunkId ? CHUNK_MAP.get(sel.chunkId) : undefined
    const selectedContext: SelectedContext = {
      id: `sel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      bookId: book.id,
      chapterId: chunk?.chapterId ?? '',
      chunkId: sel.chunkId ?? '',
      page: chunk?.page ?? 0,
      text: sel.text,
      chapterNumber: chunk?.chapterNumber,
      chapterTitle: chunk?.chapterTitle,
    }
    // SelectionAction 与 AskIntent 一一对应（explain / why / explore）
    onContextualAsk(question, selectedContext, action)
    window.getSelection()?.removeAllRanges()
    setSel(null)
  }

  return (
    <aside className="h-full flex flex-col bg-paper">
      {/* 阅读器头部 */}
      <div className="shrink-0 h-12 px-5 flex items-center justify-between border-b border-line bg-surface">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen size={15} className="text-accent shrink-0" />
          <span className="text-sm font-medium truncate">原文阅读器</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-sm text-muted hover:text-ink px-2 py-1 rounded-lg hover:bg-accent-soft transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* 可滚动正文 */}
      <div
        ref={containerRef}
        onScroll={() => setSel(null)}
        className="flex-1 overflow-y-auto px-6 sm:px-8 py-8"
      >
        <BookContent book={book} />
      </div>

      {sel && (
        <SelectionToolbar
          rect={sel.rect}
          onAction={handleAction}
        />
      )}
    </aside>
  )
}

/** 把选区动作转成一句带语境的问题，交给答案引擎（LLM / Mock 都会结合选中原文） */
function buildContextualQuestion(action: SelectionAction, text: string): string {
  const clip = text.length > 80 ? `${text.slice(0, 80)}…` : text
  switch (action) {
    case 'explain':
      return `请帮我解释这一段：「${clip}」\n\n结合全书，这段话到底在讲什么？`
    case 'why':
      return `关于「${clip}」，为什么作者会这么说？结合全书解释原因。`
    case 'explore':
      return `围绕「${clip}」这个话题，还有哪些相关的延伸观点值得继续探索？`
  }
}
