import { Link } from 'react-router-dom'
import type { Book } from '../../types'
import { BookOpen } from 'lucide-react'

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link
      to={`/book/${book.id}`}
      className="group block bg-surface rounded-card border border-line shadow-card overflow-hidden hover:-translate-y-0.5 transition-transform duration-200"
    >
      {/* 封面（纯色 + 书名，避免图片依赖） */}
      <div
        className="relative h-44 px-5 py-5 flex flex-col justify-between"
        style={{ backgroundColor: book.cover.bg, color: book.cover.fg }}
      >
        <span className="text-[11px] uppercase tracking-[0.2em] opacity-70">AI 问书 · 示例书</span>
        <div>
          <h3 className="font-display text-xl font-semibold leading-snug">{book.title}</h3>
          <p className="text-sm opacity-80 mt-1">{book.author}</p>
        </div>
        <span className="absolute right-4 bottom-4 text-6xl font-serif opacity-10 leading-none">
          读
        </span>
      </div>
      <div className="p-5">
        <p className="text-sm text-muted leading-relaxed line-clamp-3">{book.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-faint">{book.chapters.length} 章 · {book.suggestedQuestions.length} 个示例问题</span>
          <span className="text-sm text-accent font-medium group-hover:underline inline-flex items-center gap-1">
            进入问书 <BookOpen size={14} />
          </span>
        </div>
      </div>
    </Link>
  )
}
