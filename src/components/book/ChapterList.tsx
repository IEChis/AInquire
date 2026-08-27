import type { Book } from '../../types'
import { ChevronRight } from 'lucide-react'

/**
 * 章节目录（左栏内容）。点击章节 → 阅读器滚动到该章开头（不触发引用高亮）。
 */
export default function ChapterList({
  book,
  selectedChapterId,
  onSelect,
}: {
  book: Book
  selectedChapterId: string | null
  onSelect: (chapterId: string) => void
}) {
  return (
    <nav className="px-2 py-2">
      <div className="px-3 pt-1 pb-2 text-[11px] font-semibold tracking-wide text-faint uppercase">
        目录
      </div>
      <ul className="space-y-0.5">
        {book.chapters.map((ch) => {
          const active = ch.id === selectedChapterId
          return (
            <li key={ch.id}>
              <button
                onClick={() => onSelect(ch.id)}
                className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  active
                    ? 'bg-accent-soft text-accent font-medium'
                    : 'text-ink/80 hover:bg-accent-soft/60'
                }`}
              >
                <span className="font-display text-xs opacity-70 shrink-0 w-5 text-right">
                  {ch.number}
                </span>
                <span className="flex-1 truncate">{ch.title}</span>
                <ChevronRight size={14} className={`shrink-0 ${active ? 'opacity-70' : 'opacity-30'}`} />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
