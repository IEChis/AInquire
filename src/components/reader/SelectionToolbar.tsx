import { useLayoutEffect, useRef, useState } from 'react'
import { Sparkles, HelpCircle, ArrowUpRight } from 'lucide-react'

/** 选区浮层动作类型 */
export type SelectionAction = 'explain' | 'why' | 'explore'

export interface SelectionRect {
  top: number
  left: number
  width: number
  height: number
  bottom: number
}

/**
 * 选中文字后出现的轻量浮层工具栏。
 *
 * 定位策略：
 *  - 默认紧贴选区上方居中；上方空间不足时落到下方；
 *  - 横向始终夹在 viewport 内，避免超出屏幕；
 *  - 不遮挡选中内容（上方留 8px 间隙，下方同理）。
 *
 * 交互：鼠标「按下」即阻止默认，避免点击按钮时选区被清空、拿不到文字。
 */
export default function SelectionToolbar({
  rect,
  onAction,
}: {
  rect: SelectionRect
  onAction: (action: SelectionAction) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number; placement: 'top' | 'bottom' } | null>(
    null,
  )

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const w = el.offsetWidth
    const h = el.offsetHeight
    // 工具栏与选区的安全间距；足够大避免压住 chunk 的边缘线
    const GAP = 12
    const vw = window.innerWidth

    // 优先上方：工具栏底边停在选区顶之上 GAP
    let placement: 'top' | 'bottom' = 'top'
    let top = rect.top - h - GAP
    if (top < 8) {
      // 上方不够 → 放到下方：工具栏顶边停在选区底之下 GAP
      top = rect.bottom + GAP
      placement = 'bottom'
    }

    // 横向居中于选区，并夹在视口内
    let left = rect.left + rect.width / 2 - w / 2
    left = Math.max(8, Math.min(left, vw - w - 8))

    setPos({ top, left, placement })
  }, [rect])

  // 动作按钮：mousedown 阻止默认，避免选区被清除
  const handle = (action: SelectionAction) => (e: React.MouseEvent) => {
    e.preventDefault()
    onAction(action)
  }

  const hidden = !pos
  const caret =
    pos?.placement === 'top' ? (
      <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45 bg-surface border-r border-b border-line" />
    ) : (
      <span className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rotate-45 bg-surface border-l border-t border-line" />
    )

  return (
    <div
      ref={ref}
      role="toolbar"
      aria-label="选中文字的 AI 操作"
      onMouseDown={(e) => e.preventDefault()}
      style={{
        position: 'fixed',
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        visibility: hidden ? 'hidden' : 'visible',
        zIndex: 50,
      }}
      className="bg-surface border border-line rounded-xl shadow-card px-1.5 py-1 flex items-center gap-0.5 origin-center animate-fade-up"
    >
      <button
        onClick={handle('explain')}
        className="text-[13px] font-medium text-paper bg-accent hover:bg-accent-hover px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
        title="用 AI 解释你选中的内容"
      >
        <Sparkles size={13} /> AI解释
      </button>
      <span className="w-px h-4 bg-line mx-0.5" />
      <button
        onClick={handle('why')}
        className="text-[13px] text-ink/85 hover:text-accent px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 hover:bg-accent-soft transition-colors"
        title="为什么作者会这样说"
      >
        <HelpCircle size={13} /> 为什么
      </button>
      <button
        onClick={handle('explore')}
        className="text-[13px] text-ink/85 hover:text-accent px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 hover:bg-accent-soft transition-colors"
        title="围绕这段继续探索"
      >
        <ArrowUpRight size={13} /> 继续探索
      </button>
      {caret}
    </div>
  )
}
