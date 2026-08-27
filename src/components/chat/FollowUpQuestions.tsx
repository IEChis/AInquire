import type { FollowUpQuestion } from '../../types'
import { ArrowRight } from 'lucide-react'

/**
 * 继续追问（Follow-up）：点击后自动发送问题（不是修改输入框文本）。
 * 让用户感觉"AI 正在帮我继续探索这本书"。
 */
export default function FollowUpQuestions({
  questions,
  onAsk,
}: {
  questions: FollowUpQuestion[]
  onAsk: (text: string) => void
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold tracking-wide text-faint uppercase mb-2">
        你可能还想知道
      </div>
      <div className="space-y-1.5">
        {questions.map((q) => (
          <button
            key={q.id}
            onClick={() => onAsk(q.text)}
            className="w-full flex items-center gap-2 text-left text-sm text-ink bg-surface border border-line hover:border-accent hover:text-accent rounded-lg px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          >
            <ArrowRight size={14} className="shrink-0 text-accent/70" />
            <span className="flex-1">{q.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
