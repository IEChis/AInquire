import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { BookOpen, Library, Bookmark } from 'lucide-react'

export default function Layout({ children }: { children: ReactNode }) {
  const loc = useLocation()
  const isNotes = loc.pathname.startsWith('/notes')
  const isHome = loc.pathname === '/'

  return (
    // h-screen + overflow-hidden：让整体始终等于视口高度，避免内容把页面撑出滚动条
    <div className="h-screen overflow-hidden flex flex-col bg-paper">
      <header className="shrink-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto max-w-shell px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="grid place-items-center h-8 w-8 rounded-lg bg-accent text-paper font-serif text-lg font-semibold">
              问
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">AI问书</span>
            <span className="hidden sm:inline text-faint text-xs ml-1">基于书的阅读助手</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isHome ? 'text-ink bg-accent-soft' : 'text-muted hover:text-ink hover:bg-accent-soft'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Library size={15} /> 书架
              </span>
            </Link>
            <Link
              to="/notes"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isNotes ? 'text-ink bg-accent-soft' : 'text-muted hover:text-ink hover:bg-accent-soft'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Bookmark size={15} /> 笔记
              </span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-hidden">{children}</main>

      {isHome || isNotes ? (
        <footer className="shrink-0 border-t border-line">
          <div className="mx-auto max-w-shell px-6 py-8 text-xs text-faint flex flex-col gap-1">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen size={13} /> AI问书 · Demo（Mock RAG，答案均基于示例书内容生成，可追溯到章节与页码）
            </span>
            <span>Ask → Understand → Verify → Continue Reading</span>
          </div>
        </footer>
      ) : null}
    </div>
  )
}
