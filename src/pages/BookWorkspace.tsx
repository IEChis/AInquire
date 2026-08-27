import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getBook } from '../data/books'
import { useBookQA } from '../hooks/useBookQA'
import BookSidebar from '../components/book/BookSidebar'
import ChatPanel from '../components/chat/ChatPanel'
import ReaderPanel from '../components/reader/ReaderPanel'
import QuestionInput from '../components/chat/QuestionInput'
import { ChevronLeft, BookOpen } from 'lucide-react'

export default function BookWorkspace() {
  const { bookId = '' } = useParams()
  const book = getBook(bookId)

  const qa = useBookQA(book ?? getBook('thinking-fast-slow')!)
  const [readerOpen, setReaderOpen] = useState(true)

  if (!book) return <Navigate to="/" replace />

  // 目录点击：切换到该章，并清除引用高亮
  function handleSelectChapter(id: string) {
    qa.setSelectedChapterId(id)
    qa.clearActiveCitation()
  }

  // Citation 点击：定位 + 高亮，小屏自动展开阅读器
  function handleJump(chunkId: string) {
    qa.jumpToCitation(chunkId)
    setReaderOpen(true)
  }

  return (
    <div className="h-full flex flex-col">
      {/* 工作台顶栏 */}
      <div className="shrink-0 flex items-center gap-3 px-4 sm:px-6 h-14 border-b border-line bg-surface">
        <Link to="/" className="text-sm text-muted hover:text-ink inline-flex items-center gap-1 shrink-0">
          <ChevronLeft size={16} /> 书架
        </Link>
        <div className="font-display font-semibold truncate">{book.title}</div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-faint hidden sm:inline">Ask → Trust → Explore</span>
          <button
            onClick={() => setReaderOpen((o) => !o)}
            className="lg:hidden text-sm text-accent border border-line hover:border-accent px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
          >
            <BookOpen size={14} /> 原文
          </button>
        </div>
      </div>

      {/* 三栏：左 章节 / 中 问答 / 右 原文 */}
      <div className="flex-1 min-h-0 flex">
        {/* 左栏：章节目录（≥1024 常驻） */}
        <div className="hidden lg:flex w-[260px] shrink-0">
          <BookSidebar
            book={book}
            selectedChapterId={qa.selectedChapterId}
            onSelectChapter={handleSelectChapter}
          />
        </div>

        {/* 中栏：问答流 */}
        <div className="flex-1 min-w-0">
          <ChatPanel
            book={book}
            messages={qa.messages}
            isLoading={qa.isLoading}
            retrievalSteps={qa.retrievalSteps}
            currentQuestion={qa.currentQuestion}
            llmError={qa.llmError}
            onJump={handleJump}
            onFollowUp={qa.submit}
            onSaveNote={qa.saveNote}
            onSubmit={qa.submit}
          />
        </div>

        {/* 右栏：原文阅读器（≥1024 常驻；小屏由"原文"按钮切换） */}
        <div
          className={`${readerOpen ? 'flex' : 'hidden'} lg:flex w-[420px] xl:w-[460px] shrink-0`}
        >
          <ReaderPanel
            book={book}
            activeCitation={qa.activeCitation}
            selectedChapterId={qa.selectedChapterId}
            onClose={() => setReaderOpen(false)}
            onContextualAsk={qa.submit}
          />
        </div>
      </div>

      {/* 底部常驻提问条（跨三栏） */}
      <QuestionInput onSubmit={qa.submit} disabled={qa.isLoading} bookTitle={book.title} />
    </div>
  )
}
