import type { RetrievalStep } from '../../types'
import { Search } from 'lucide-react'

/**
 * Moment 1 —— 检索正在发生。
 * 逐条浮现"匹配到 第N章《title》· Pxx"，让用户"看见" Retrieval。
 */
export default function RetrievalTicker({ steps }: { steps: RetrievalStep[] }) {
  return (
    <div className="bg-accent-soft/60 border border-accent/10 rounded-card p-4 animate-fade-up">
      <div className="flex items-center gap-2 text-accent font-medium text-sm">
        <Search size={15} />
        <span>正在查找书中相关内容……</span>
        <span className="ml-1 flex items-center gap-1">
          <span className="retrieving-dot" />
          <span className="retrieving-dot" style={{ animationDelay: '0.2s' }} />
          <span className="retrieving-dot" style={{ animationDelay: '0.4s' }} />
        </span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {steps.map((s, i) => (
          <li
            key={s.chunkId}
            className="flex items-center gap-2 text-sm text-muted animate-fade-up"
            style={{ animationDelay: `${i * 0.18 + 0.2}s` }}
          >
            <span className="text-accent">✓</span>
            <span>
              匹配到 第{s.chapterNumber}章《{s.chapterTitle}》· P{s.page}
            </span>
            <span className="text-faint truncate">— {s.snippet}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
