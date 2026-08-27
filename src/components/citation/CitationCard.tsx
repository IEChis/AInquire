import type { Citation } from '../../types'
import { Quote, ArrowUpRight } from 'lucide-react'

/**
 * Citation 证据卡（Principle 2 Traceable 的核心视觉身份）。
 * 左侧 accent 竖条 + 章节标题 + 原文引用 + 页码 + "查看原文"。
 * 区别于普通脚注：它明确传达"这是结论的证据来源"。
 * onJump 不传时为静态展示（用于笔记页）。
 */
export default function CitationCard({
  citation,
  index,
  onJump,
}: {
  citation: Citation
  index?: number
  onJump?: (chunkId: string) => void
}) {
  const interactive = !!onJump
  return (
    <div
      className={`group rounded-card border border-line bg-transparent overflow-hidden ${
        interactive ? 'hover:border-accent/50 transition-colors' : ''
      }`}
    >
      {/* 证据标识行 */}
      <div className="flex items-center gap-2 px-3 py-2 bg-accent-soft/50 border-b border-line/70">
        <span className="grid place-items-center h-5 w-5 rounded bg-accent text-paper">
          <Quote size={11} />
        </span>
        <span className="text-[11px] font-semibold tracking-wide text-accent uppercase">
          证据来源
        </span>
        {index !== undefined && (
          <span className="text-[11px] text-faint">No.{index}</span>
        )}
        <span className="ml-auto text-[11px] text-muted">
          第{citation.chapterNumber}章 · {citation.chapterTitle}
        </span>
      </div>

      {/* 原文引用 */}
      <blockquote className="px-3 py-2.5 text-sm text-ink/90 leading-relaxed">
        {citation.quote}
      </blockquote>

      {/* 底部：页码 + 跳转 */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-line/70">
        <span className="text-[11px] text-faint">P.{citation.page}</span>
        {interactive ? (
          <button
            onClick={() => onJump(citation.chunkId)}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          >
            查看原文 <ArrowUpRight size={13} />
          </button>
        ) : null}
      </div>
    </div>
  )
}
