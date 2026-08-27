import { useEffect, useRef } from 'react'
import type { Book, QATurn, RetrievalStep } from '../../types'
import AnswerCard from './AnswerCard'
import RetrievalTicker from './RetrievalTicker'
import ModelBadge from './ModelBadge'
import ErrorBoundary from '../ErrorBoundary'
import { Sparkles, MessageSquareText } from 'lucide-react'

/**
 * 中栏：问答流。
 * - 首屏：欢迎语 + 建议问题（点击即发送）
 * - 之后：用户问题气泡（右）+ 结构化答案卡片
 * - 加载中：用户气泡（右）+ 检索正在发生（Moment 1）
 */
export default function ChatPanel({
  book,
  messages,
  isLoading,
  retrievalSteps,
  currentQuestion,
  llmError,
  onJump,
  onFollowUp,
  onSaveNote,
  onSubmit,
}: {
  book: Book
  messages: QATurn[]
  isLoading: boolean
  retrievalSteps: RetrievalStep[]
  currentQuestion: string
  /** 最近一次 LLM 调用的错误：用于顶部 ModelBadge 把"已就绪"切到"已降级"，避免徽章自相矛盾 */
  llmError?: Error | null
  onJump: (chunkId: string) => void
  onFollowUp: (q: string) => void
  onSaveNote: (turn: QATurn) => void
  onSubmit: (text: string) => void
}) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // 自动滚到底：用 scrollIntoView + inline: 'nearest' 防止页面级滚动
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
  }, [messages, isLoading, retrievalSteps])

  const empty = messages.length === 0 && !isLoading

  return (
    <section className="h-full min-h-0 flex flex-col bg-paper">
      {/* 中栏头部 */}
      <div className="shrink-0 px-6 py-3 border-b border-line flex items-center gap-2 text-faint text-[11px] uppercase tracking-wide">
        <MessageSquareText size={14} /> AI 问书 · 向《{book.title}》提问
        <span className="ml-auto"><ModelBadge error={llmError} /></span>
      </div>

      {/* 滚动区域：min-h-0 让 flex 子项能正确触发 overflow */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-6" data-chat-scroll>
        <div className="mx-auto max-w-2xl space-y-6">
          {empty && (
            <div className="text-center py-8">
              <div className="mx-auto grid place-items-center h-12 w-12 rounded-2xl bg-accent-soft text-accent mb-4">
                <Sparkles size={22} />
              </div>
              <h2 className="font-display text-xl font-semibold">向这本书提问</h2>
              <p className="text-sm text-muted mt-2 max-w-sm mx-auto leading-relaxed">
                AI 的回答基于书中内容生成，并追溯到章节、页码与原文片段。试试下面的问题：
              </p>
              <div className="mt-5 flex flex-wrap gap-2 justify-center">
                {book.suggestedQuestions.map((q) => (
                  <button
                    key={q.q}
                    onClick={() => onSubmit(q.q)}
                    className="text-sm text-ink bg-surface border border-line hover:border-accent hover:text-accent px-3 py-2 rounded-lg transition-colors text-left"
                  >
                    {q.q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((turn) => (
            <ErrorBoundary key={turn.question.id}>
              <div className="space-y-3">
                <UserBubble text={turn.question.text} />
                <AnswerCard
                  turn={turn}
                  source={turn.source}
                  model={turn.model}
                  onJump={onJump}
                  onFollowUp={onFollowUp}
                  onSaveNote={onSaveNote}
                />
              </div>
            </ErrorBoundary>
          ))}

          {isLoading && (
            <div className="space-y-3">
              <UserBubble text={currentQuestion} />
              <RetrievalTicker steps={retrievalSteps} />
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </section>
  )
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] bg-surface border border-line text-ink/90 px-4 py-2.5 rounded-2xl rounded-br-sm text-[15px] leading-relaxed">
        <span className="block text-[10px] uppercase tracking-wide text-faint mb-0.5">你的问题</span>
        {text}
      </div>
    </div>
  )
}
