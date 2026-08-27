import { useState } from 'react'
import { Send, CornerDownLeft } from 'lucide-react'

/**
 * 底部常驻提问条（Ask this book）。
 * 跨三栏底部，保证"Ask → Trust → Explore"链路不被打断。
 */
export default function QuestionInput({
  onSubmit,
  disabled,
  bookTitle,
}: {
  onSubmit: (text: string) => void
  disabled: boolean
  bookTitle: string
}) {
  const [value, setValue] = useState('')

  function send() {
    const t = value.trim()
    if (!t || disabled) return
    onSubmit(t)
    setValue('')
  }

  return (
    <div className="shrink-0 border-t border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto max-w-shell px-4 sm:px-6 py-3">
        <form
          className="flex gap-3 items-end"
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <div className="flex-1 relative">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder={`就《${bookTitle}》问点什么……（Enter 发送）`}
              className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-ink placeholder:text-faint focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={!value.trim() || disabled}
            className="shrink-0 bg-accent text-paper px-5 py-3 rounded-xl font-medium inline-flex items-center gap-2 disabled:opacity-40 hover:bg-accent-hover transition-colors"
          >
            {disabled ? (
              '检索中…'
            ) : (
              <>
                提问 <Send size={15} />
              </>
            )}
          </button>
        </form>
        <div className="mt-1.5 px-1 text-[11px] text-faint inline-flex items-center gap-1">
          <CornerDownLeft size={11} /> Enter 发送 · 回答均基于《{bookTitle}》原文
        </div>
      </div>
    </div>
  )
}
