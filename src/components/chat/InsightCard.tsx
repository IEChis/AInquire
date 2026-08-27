import type { Insight } from '../../types'
import { Lightbulb } from 'lucide-react'

/** 核心观点卡片（Key Insights）：AI Answer 的结构化要点之一。 */
export default function InsightCard({ insight, index }: { insight: Insight; index: number }) {
  return (
    <li className="flex gap-2.5 items-start">
      <span className="mt-0.5 grid place-items-center h-5 w-5 shrink-0 rounded-full bg-amber-soft text-amber">
        <Lightbulb size={12} />
      </span>
      <span className="text-[13px] leading-relaxed text-ink/85">
        <span className="text-faint mr-1.5 font-medium">{index}.</span>
        {insight.text}
      </span>
    </li>
  )
}
