import type { Note } from '../../types'
import CitationCard from '../citation/CitationCard'
import { Link } from 'react-router-dom'
import { Trash2, ArrowUpRight, Bookmark } from 'lucide-react'

/** 笔记卡片：汇总一条保存的观点（问题 / 结论 / 核心观点 / 来源）。 */
export default function NoteCard({
  note,
  onDelete,
}: {
  note: Note
  onDelete: (id: string) => void
}) {
  return (
    <div className="bg-surface border border-line rounded-card p-5 shadow-card flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-faint inline-flex items-center gap-1">
          <Bookmark size={12} /> {note.bookTitle}
        </div>
        <span className="text-[11px] text-faint">
          {new Date(note.createdAt).toLocaleDateString('zh-CN')}
        </span>
      </div>

      <div className="font-display font-semibold mt-2 leading-snug">{note.question}</div>
      <p className="text-sm text-muted mt-2 leading-relaxed">{note.answerSnippet}</p>

      {note.insights.length > 0 && (
        <ul className="mt-3 space-y-1">
          {note.insights.map((ins, i) => (
            <li key={i} className="text-[13px] text-ink/80 leading-relaxed flex gap-2">
              <span className="text-faint mt-0.5">·</span>
              <span>{ins}</span>
            </li>
          ))}
        </ul>
      )}

      {note.citation && (
        <div className="mt-3">
          <CitationCard citation={note.citation} />
        </div>
      )}

      <div className="mt-auto pt-4 flex items-center justify-between">
        <Link
          to={`/book/${note.bookId}`}
          className="text-sm text-accent hover:underline inline-flex items-center gap-1"
        >
          去书中查看 <ArrowUpRight size={13} />
        </Link>
        <button
          onClick={() => onDelete(note.id)}
          className="text-sm text-faint hover:text-red-600 transition-colors inline-flex items-center gap-1"
        >
          <Trash2 size={13} /> 删除
        </button>
      </div>
    </div>
  )
}
