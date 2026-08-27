import { useCallback, useEffect, useRef, useState } from 'react'
import type { AIAnswer, Book, Note, QATurn, RetrievalStep, SelectedContext } from '../types'
import { askBookQuestionAsync, getChunk } from '../services/mockRag'
import type { AnswerSource, AskIntent } from '../services/answerEngine'
import { useNoteStore } from '../lib/store'

export interface UseBookQAReturn {
  book: Book
  messages: QATurn[]
  isLoading: boolean
  /** 加载过程中已逐条浮现的检索步骤（驱动 Moment 1 动画） */
  retrievalSteps: RetrievalStep[]
  /** 加载中正在处理的用户问题（用于展示用户气泡） */
  currentQuestion: string
  /** 当前需要被定位 + 高亮的 chunkId（Reader 消费） */
  activeCitation: string | null
  /** 当前/最近一次答案的来源（用于状态条） */
  answerSource: AnswerSource | null
  /** 当前/最近一次答案所用的模型（如有） */
  currentModel: string | undefined
  /** 最近一次 LLM 调用的错误（成功后会清空） */
  llmError: Error | null
  selectedChapterId: string | null
  setSelectedChapterId: (id: string | null) => void
  clearActiveCitation: () => void
  submit: (raw: string, selection?: SelectedContext, intent?: AskIntent) => void
  jumpToCitation: (chunkId: string) => void
  saveNote: (turn: QATurn) => Note
}

/**
 * 书籍问答状态机。
 *
 * 同步抽出"提问 → 加载态 → 落答案"的状态外壳；
 * 真实答案生产由 askBookQuestionAsync 提供（LLM 优先，Grounded 校验，失败降级 Mock）。
 *
 * 总耗时下限 = min(load time) ≈ 700ms（让"检索正在发生"有体感）；
 * 总耗时上限 = max(load time) ≈ 4200ms（如果 LLM 慢但仍在 4s 内返回，等结果）。
 */
const MIN_LOAD_MS = 750
const MAX_LOAD_MS = 4200

export function useBookQA(book: Book): UseBookQAReturn {
  const [messages, setMessages] = useState<QATurn[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [retrievalSteps, setRetrievalSteps] = useState<RetrievalStep[]>([])
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [activeCitation, setActiveCitation] = useState<string | null>(null)
  const [answerSource, setAnswerSource] = useState<AnswerSource | null>(null)
  const [currentModel, setCurrentModel] = useState<string | undefined>(undefined)
  const [llmError, setLlmError] = useState<Error | null>(null)
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null)

  const timers = useRef<number[]>([])
  const addNote = useNoteStore((s) => s.addNote)

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t))
    timers.current = []
  }, [])

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  const submit = useCallback(
    (raw: string, selection?: SelectedContext, intent?: AskIntent) => {
      const question = raw.trim()
      if (!question || isLoading) return
      clearTimers()

      const startedAt = Date.now()
      const isContextual = !!selection

      let settled = false

      // 进入加载态：清掉旧的定位高亮 + 旧的 source/错误
      setIsLoading(true)
      setRetrievalSteps([])
      setActiveCitation(null)
      setCurrentQuestion(question)
      setLlmError(null)

      const settle = (
        retrieval: RetrievalStep[],
        answer: AIAnswer,
        source: AnswerSource,
        model?: string,
      ) => {
        settled = true
        const elapsed = Date.now() - startedAt
        const wait = Math.max(0, MIN_LOAD_MS - elapsed)
        const t = window.setTimeout(() => {
          const turn: QATurn = {
            question: {
              id: `q_${startedAt}_${Math.random().toString(36).slice(2, 6)}`,
              text: question,
              createdAt: startedAt,
              bookId: book.id,
              source: isContextual ? 'selection' : 'global',
              ...(selection ? { selectedContext: selection } : {}),
            },
            answer,
            source,
            model,
          }
          setMessages((m) => [...m, turn])
          setRetrievalSteps([])
          setIsLoading(false)
          setCurrentQuestion('')
          setAnswerSource(source)
          setCurrentModel(model)
          // 答案成功落库即视为"成功"，清除之前可能被 safety 定时器标记的失败态
          setLlmError(null)
        }, wait)
        timers.current.push(t)
        // 检索步骤立刻到位（即使是 0 条也覆盖占位）；检索列表为空时
        // RetrievalTicker 只显示"正在查找…"标题 + 呼吸点，仍传达"检索中"。
        setRetrievalSteps(retrieval)
      }

      askBookQuestionAsync(question, book.id, {
        onLLMError: (err) => setLlmError(err),
        selectedContext: selection,
        intent,
      })
        .then((result) => settle(result.retrieval, result.answer, result.answerSource, result.model))
        .catch((err) => {
          // 理论上 answerEngine 内部已经 try-catch 并降级到 mock，这里只是终极兜底
          // eslint-disable-next-line no-console
          console.error('[useBookQA] unexpected error', err)
          setLlmError(err instanceof Error ? err : new Error(String(err)))
          setIsLoading(false)
          setCurrentQuestion('')
          setRetrievalSteps([])
        })

      // 顶到 MAX_LOAD_MS 仍未 settle → 强制标记错误，但要避开"答案已落地"
      // 后再误触把 llmError 从 null 覆写成新 Error（曾经让顶部 chip 错
      // 显示"已切到本地兜底"，与绿色 LLM 徽章自相矛盾）。
      const safety = window.setTimeout(() => {
        if (!settled) {
          setLlmError(new Error('答案生成超过 4.2s，已切到本地兜底'))
        }
      }, MAX_LOAD_MS)
      timers.current.push(safety)
    },
    [book.id, isLoading, clearTimers],
  )

  const jumpToCitation = useCallback((chunkId: string) => {
    const chunk = getChunk(chunkId)
    if (!chunk) return
    setActiveCitation(chunkId)
    setSelectedChapterId(chunk.chapterId)
  }, [])

  const clearActiveCitation = useCallback(() => setActiveCitation(null), [])

  const saveNote = useCallback(
    (turn: QATurn): Note => {
      const { answer } = turn
      return addNote({
        bookId: book.id,
        bookTitle: book.title,
        question: answer.question,
        answerSnippet: answer.conclusion,
        insights: answer.insights.map((i) => i.text),
        citation: answer.citations[0],
        content: '',
      })
    },
    [addNote, book.id, book.title],
  )

  return {
    book,
    messages,
    isLoading,
    retrievalSteps,
    currentQuestion,
    activeCitation,
    answerSource,
    currentModel,
    llmError,
    selectedChapterId,
    setSelectedChapterId,
    clearActiveCitation,
    submit,
    jumpToCitation,
    saveNote,
  }
}
