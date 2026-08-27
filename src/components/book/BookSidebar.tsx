import type { Book } from '../../types'
import ChapterList from './ChapterList'
import { BookMarked } from 'lucide-react'

/**
 * 左栏：书籍信息 + 章节目录。
 * 让用户始终意识到"我正在向这一本书提问"。
 */
export default function BookSidebar({
  book,
  selectedChapterId,
  onSelectChapter,
}: {
  book: Book
  selectedChapterId: string | null
  onSelectChapter: (chapterId: string) => void
}) {
  return (
    <aside className="h-full flex flex-col bg-surface border-r border-line">
      {/* 书籍标识 */}
      <div className="p-4 border-b border-line">
        <div className="flex items-center gap-2 text-faint text-[11px] uppercase tracking-wide mb-2">
          <BookMarked size={13} /> 正在阅读
        </div>
        <div className="flex items-start gap-3">
          <div
            className="h-12 w-9 rounded-md flex items-end p-1.5 text-[10px] shrink-0"
            style={{ backgroundColor: book.cover.bg, color: book.cover.fg }}
          >
            封
          </div>
          <div className="min-w-0">
            <div className="font-display font-semibold leading-snug truncate">{book.title}</div>
            <div className="text-xs text-muted mt-0.5">{book.author}</div>
          </div>
        </div>
      </div>

      {/* 章节目录（可滚动） */}
      <div className="flex-1 overflow-y-auto">
        <ChapterList
          book={book}
          selectedChapterId={selectedChapterId}
          onSelect={onSelectChapter}
        />
      </div>
    </aside>
  )
}
