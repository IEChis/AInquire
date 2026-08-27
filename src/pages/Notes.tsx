import { Link } from 'react-router-dom'
import { useNoteStore } from '../lib/store'
import NoteCard from '../components/notes/NoteCard'
import { Bookmark } from 'lucide-react'

export default function Notes() {
  const notes = useNoteStore((s) => s.notes)
  const removeNote = useNoteStore((s) => s.removeNote)

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-shell px-6 py-12">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="font-display text-3xl font-bold inline-flex items-center gap-2">
            <Bookmark size={24} className="text-accent" /> 我的笔记
          </h1>
          <span className="text-sm text-faint">{notes.length} 条</span>
        </div>

        {notes.length === 0 ? (
          <div className="border border-dashed border-line rounded-card p-16 text-center">
            <p className="font-display text-xl text-muted">还没有笔记</p>
            <p className="text-sm text-faint mt-2">在"AI问书"里保存观点，会在这里汇总。</p>
            <Link
              to="/"
              className="inline-block mt-6 text-sm font-medium text-accent border border-line hover:border-accent px-4 py-2 rounded-lg transition-colors"
            >
              去书架选一本书 →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map((n) => (
              <NoteCard key={n.id} note={n} onDelete={removeNote} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
