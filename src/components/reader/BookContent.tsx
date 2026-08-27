import type { Book, BookChunk } from '../../types'
import { getChunksByBook } from '../../data/chunks'
import BookChunkItem from './BookChunk'

/** 原文正文：按章节分组渲染，章节标题带 id=chapter-${id} 供目录定位。 */
export default function BookContent({ book }: { book: Book }) {
  const allChunks = getChunksByBook(book.id)

  return (
    <div className="mx-auto max-w-reading">
      <p className="text-sm text-muted leading-relaxed mb-10">{book.intro}</p>
      {book.chapters.map((chapter) => {
        const chunks: BookChunk[] = allChunks.filter((c) => c.chapterId === chapter.id)
        return (
          <section key={chapter.id} className="mb-12">
            <div id={`chapter-${chapter.id}`} className="scroll-mt-4 flex items-baseline gap-3 mb-4">
              <span className="font-display text-2xl font-semibold">第{chapter.number}章</span>
              <span className="font-display text-2xl font-semibold text-ink/80">{chapter.title}</span>
              <span className="text-xs text-faint ml-auto">
                P{chapter.startPage}–{chapter.endPage}
              </span>
            </div>
            {/* space-y-7 (28px) 给 floating SelectionToolbar 留呼吸位，避免压住 chunk 边缘 */}
            <div className="space-y-7">
              {chunks.map((c) => (
                <BookChunkItem key={c.id} chunk={c} />
              ))}
            </div>
          </section>
        )
      })}
      <p className="text-center text-xs text-faint mt-6 py-8">— 示例书内容 · 完 —</p>
    </div>
  )
}
