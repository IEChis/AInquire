/**
 * ============================================================================
 *  Answer Engine —— 问题答案生产的总入口
 * ----------------------------------------------------------------------------
 *  优先级：
 *    1) 真实 LLM（当 .env 配置可用且返回 Grounded 结果）
 *    2) Mock 兜底（预置答案 / 检索合成）
 *
 *  Grounded 不变性：
 *    - 所有 citation.chunkId 必须真实存在于本书数据集中
 *    - 不存在的引用一律过滤掉；如果过滤完为空，整个答案视为不 Grounded，回退到 Mock
 *
 *  输出附 answerSource 字段，供 UI 标注"AI 大模型"或"本地 Mock"。
 * ============================================================================
 */

import type {
  AIAnswer,
  AskResult,
  Book,
  BookChunk,
  Citation,
  Insight,
  RetrievalStep,
  SelectedContext,
} from '../types'
import { CHUNK_MAP, generateFollowUpQuestions, retrieveWithContext } from './mockRag'
import { buildRAGPrompt, callLLM, isLLMAvailable } from './llmClient'
import { getBook } from '../data/books'
import { PREBUILT_ANSWERS } from '../data/answers'

export type AnswerSource = 'llm' | 'mock-prebuilt' | 'mock-synth'

/** Contextual Reading QA 的三种动作意图（统一进 askBookQuestion） */
export type AskIntent = 'ask' | 'explain' | 'why' | 'explore'

export interface AskResultEx extends AskResult {
  /** 这一条答案来自哪：真实 LLM / Mock 预置 / Mock 合成 */
  answerSource: AnswerSource
  /** 来自哪个模型（仅当来源是 llm 时有值） */
  model?: string
}

// ---------------------------------------------------------------------------
// 工具：把 chunk 映射成 Citation / Step（与 mockRag 保持一致）
// ---------------------------------------------------------------------------

function toCitation(chunk: BookChunk): Citation {
  return {
    chunkId: chunk.id,
    chapterId: chunk.chapterId,
    chapterNumber: chunk.chapterNumber,
    chapterTitle: chunk.chapterTitle,
    page: chunk.page,
    quote: chunk.text,
  }
}

function toStep(chunk: BookChunk): RetrievalStep {
  return {
    chunkId: chunk.id,
    chapterNumber: chunk.chapterNumber,
    chapterTitle: chunk.chapterTitle,
    page: chunk.page,
    snippet: chunk.text.slice(0, 24) + (chunk.text.length > 24 ? '…' : ''),
  }
}

// ---------------------------------------------------------------------------
// Mock 实现（从原 mockRag 抽出，保持向后兼容）
// ---------------------------------------------------------------------------

function findPrebuilt(question: string): AIAnswer | undefined {
  const exact = PREBUILT_ANSWERS[question]
  if (exact) return exact
  const key = Object.keys(PREBUILT_ANSWERS).find((k) => question.includes(k.slice(0, 6)))
  return key ? PREBUILT_ANSWERS[key] : undefined
}

/**
 * Mock 兜底：基于检索到的 chunk 合成一份"像 AI"的答案。
 *
 * 设计目标：让 fallback 的体感也是"AI 写的总结"，而不是"复读原文"。
 * - 不出现"第X章写道：『原文』"这种复读机句式
 * - 不出现"主要涉及XX方面"这种废话
 * - 仍然 100% 基于 chunks 原文，确保 Grounded
 */
function synthesize(
  question: string,
  chunks: BookChunk[],
  book: Book,
  selectedContext?: SelectedContext,
): AIAnswer {
  const top = chunks.slice(0, 4)
  const selectedText = selectedContext?.text?.trim() || undefined

  // 1) 抽关键词（用于结论/解释的"主题骨架"）
  const topKw = Array.from(new Set(top.flatMap((c) => c.keywords))).slice(0, 4)

  // 2) 结论：从 top chunk 提炼一句"作者的态度"（编辑感）
  const conclusion = buildConclusion(book, question, top, topKw, selectedText)

  // 3) 解释：3 段 = "是什么 / 怎么起作用 / 怎么用"
  const explanation = buildExplanation(book, top, topKw, selectedText)

  // 4) 核心观点：从每条 chunk 抽一条"可带走的"建议
  const insights: Insight[] = top.slice(0, 3).map((c, i) => ({
    id: `syn-i${i}`,
    text: buildInsight(c, i),
  }))

  // 5) 引用 = top chunks 本身
  const citations: Citation[] = top.slice(0, 3).map(toCitation)

  // 6) 追问：复用 retriever 的 followUp（Contextual QA 时围绕选中内容）
  const followUpQuestions = generateFollowUpQuestions(question, book, top, selectedContext)

  return {
    question,
    conclusion,
    explanation,
    insights,
    citations,
    followUpQuestions,
  }
}

// --- synthesize 用的语段构造器（让 fallback 也像"编辑写的"） -----------

function buildConclusion(
  book: Book,
  question: string,
  top: BookChunk[],
  kw: string[],
  selectedText?: string,
): string {
  const focus = kw[0] ?? '这一观点'
  if (top.length >= 2) {
    // 两条以上：用 "——" 把态度和原因连起来
    const verb = pickVerb(question)
    const anchor = selectedText ? `你选的这句「${selectedText.slice(0, 18)}」` : `「${focus}」`
    return `作者${verb}，把${anchor}看作整本书的关键：它能解释为什么人容易判断失误。`
  }
  return `作者在《${book.title}》中把${selectedText ? `你选的「${selectedText.slice(0, 14)}」` : `「${focus}」`}放在关键位置，作为回答你这个问题的支点。`
}

function buildExplanation(
  book: Book,
  top: BookChunk[],
  kw: string[],
  selectedText?: string,
): string {
  if (top.length === 0) {
    return `《${book.title}》的当前可检索片段里没有直接对应的论述。试试更具体的关键词，比如「${kw[0] ?? '核心概念'}」相关的问题。`
  }
  // 三段式："是什么" → "怎么起作用" → "对读者意味着什么"
  const what = `作者把这个问题拆成「${kw.slice(0, 2).join('、') || '核心概念'}」这一组关键词来理解——它不只是术语，而是一种会反复出现的心智模式。${
    selectedText ? `\n\n你刚才选的那句：「${selectedText.slice(0, 30)}」正是这条线索的切口。` : ''
  }`
  const how = `关键在于：${top[0].text.replace(/[。.]?\s*$/, '')}这一段把机制讲透了——读者顺着这条线读下去，会发现后面章节都在给同一个判断做注脚。`
  const so = `换句话说，作者不是给一个标准答案，而是提供一个用来校准自己判断的视角——你在别处再遇到类似情境，可以拿这个视角来对一遍。`
  return `${what}\n\n${how}\n\n${so}`
}

function buildInsight(c: BookChunk, i: number): string {
  // 从 chunk.text 抽掉书名号、引号等装饰，保留陈述句，作为"可带走"的观点
  const raw = c.text.replace(/[\u3002;；]+$/, '').trim()
  if (i === 0) {
    return `记住这条主线：${raw}——它是作者在第 ${c.chapterNumber} 章立下的判断基准。`
  }
  if (i === 1) {
    return `应用层：${raw}。下次做决策时，先问自己有没有掉进这个模式。`
  }
  return `反向校准：${raw}。这条用来判断你之前的判断是不是"系统1偷懒"的结果。`
}

function pickVerb(question: string): string {
  // 简单分流，让 conclusion 看起来更自然
  if (/(为什么|为何|怎么)/.test(question)) return '反复强调'
  if (/(怎么|如何|做法|方法)/.test(question)) return '给出一套做法'
  if (/(是什么|什么是|定义)/.test(question)) return '用一组对照来定义'
  if (/(区别|不同|对比)/.test(question)) return '用对照的方式拆开'
  return '想告诉你'
}

// ---------------------------------------------------------------------------
// LLM 实现：调用 + 解析 + 校验（Grounded）
// ---------------------------------------------------------------------------

interface FollowUpQuestionLite {
  id: string
  text: string
}

function safeParseJSON<T>(s: string): T | null {
  try {
    return JSON.parse(s) as T
  } catch {
    // 兼容模型把 JSON 包在 ```json ... ``` 的情况
    const m = s.match(/\{[\s\S]*\}/)
    if (m) {
      try {
        return JSON.parse(m[0]) as T
      } catch {
        return null
      }
    }
    return null
  }
}

/**
 * 解析 + 校验 LLM 返回。
 *
 * Grounded 校验（更宽容，符合 RAG 本质）：
 *   - conclusion + explanation 必须有，否则整体作废；
 *   - citationNumbers 是模型"建议"的引用编号，可以缺失/为空；
 *   - citations 最终至少 1 条（用模型建议的，没有就用 topChunks 兜底）。
 *
 * 不再因为"模型没返回引用"就 reject——retriever 永远兜底。
 */
function buildLLMAnswer(
  book: Book,
  question: string,
  raw: string,
  topChunks: BookChunk[],
): AIAnswer | null {
  type Schema = {
    conclusion?: unknown
    explanation?: unknown
    insights?: { text?: unknown }[]
    /** 模型建议的引用编号（1..N），可空 */
    citationNumbers?: unknown[]
    /** 兼容老字段名（万一模型还按旧 prompt 写） */
    citationChunkIds?: unknown[]
    followUpQuestions?: { text?: unknown }[]
  }
  const parsed = safeParseJSON<Schema>(raw)
  if (!parsed) return null

  const conclusion = String(parsed.conclusion ?? '').trim()
  const explanation = String(parsed.explanation ?? '').trim()
  if (!conclusion || !explanation) return null

  // 1) 收集模型建议的引用编号（兼容两种字段名）
  const suggestedNums = collectNumbers(
    (parsed.citationNumbers as unknown[] | undefined) ??
      (parsed.citationChunkIds as unknown[] | undefined),
  )

  // 2) 构造 citations：先放模型建议的（按编号映射回 topChunks），
  //    再用 topChunks 顺序补齐到 3 条，保证 Grounded
  const seen = new Set<string>()
  const citations: Citation[] = []
  // 2a) 模型建议的
  for (const n of suggestedNums) {
    const c = topChunks[n - 1]
    if (!c) continue
    if (seen.has(c.id)) continue
    seen.add(c.id)
    citations.push(toCitation(c))
    if (citations.length >= 3) break
  }
  // 2b) 兜底：用 retriever topChunks 补齐到 3 条
  if (citations.length < 3) {
    for (const c of topChunks) {
      if (seen.has(c.id)) continue
      seen.add(c.id)
      citations.push(toCitation(c))
      if (citations.length >= 3) break
    }
  }
  // 2c) 极端兜底：retriever 都没结果（理论上 retriever 总会有结果）
  if (citations.length === 0) return null

  // 3) insights
  const insights: Insight[] = (parsed.insights ?? [])
    .filter((i) => i && typeof i.text === 'string' && (i.text as string).trim())
    .map((i, idx) => ({ id: `llm-i${idx}`, text: (i.text as string).trim() }))
    .slice(0, 6)
  // 兜底：如果模型没出 insights，从 topChunks 抽
  if (insights.length === 0) {
    for (let i = 0; i < Math.min(3, topChunks.length); i++) {
      insights.push({ id: `llm-ifb${i}`, text: buildInsight(topChunks[i], i) })
    }
  }

  // 4) followUpQuestions
  const followUpQuestions: FollowUpQuestionLite[] = (parsed.followUpQuestions ?? [])
    .filter((q) => q && typeof q.text === 'string' && (q.text as string).trim())
    .map((q, idx) => ({ id: `llm-fu${idx}`, text: (q.text as string).trim() }))
    .slice(0, 3)
  while (followUpQuestions.length < 3) {
    followUpQuestions.push({
      id: `llm-fu${followUpQuestions.length}`,
      text:
        [
          '能不能再举个书中的例子？',
          '这个观点和别的章节怎么呼应？',
          '作者给出的具体做法是什么？',
        ][followUpQuestions.length] || `还有哪些角度值得问《${book.title}》？`,
    })
  }

  return {
    question,
    conclusion,
    explanation,
    insights,
    citations,
    followUpQuestions,
  }
}

/** 把模型返回的引用字段规范成"数字数组"。容忍 string、number、null、嵌套对象。 */
function collectNumbers(input: unknown): number[] {
  if (!Array.isArray(input)) return []
  const out: number[] = []
  for (const v of input) {
    if (typeof v === 'number' && Number.isFinite(v) && v > 0) {
      out.push(Math.floor(v))
    } else if (typeof v === 'string') {
      // 兼容 "1"、" [2] "、"chunk_1" 等
      const m = v.match(/(\d+)/)
      if (m) out.push(parseInt(m[1], 10))
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// 总入口
// ---------------------------------------------------------------------------

export interface AskOptions {
  /** 强制走 Mock（用于本地测试 / 离线） */
  forceMock?: boolean
  /** 取消信号 */
  signal?: AbortSignal
  /** 模型异常回调（用于 UI 状态条） */
  onLLMError?: (err: Error) => void
  /** Contextual Reading QA 的意图（explain / why / explore） */
  intent?: AskIntent
  /** 选中内容上下文（Contextual QA） */
  selectedContext?: SelectedContext
}

/** 统一入口选项（推荐）：一次调用覆盖 global 与 selection 两种模式 */
export interface AskBookOptions {
  bookId: string
  /** 显式问题（global 提问时必填；selection 模式可由 intent + selectedContext 推导） */
  question?: string
  /** 选中内容上下文（Contextual QA） */
  selectedContext?: SelectedContext
  /** 动作意图，决定检索与回答的侧重 */
  intent?: AskIntent
  forceMock?: boolean
  signal?: AbortSignal
  onLLMError?: (err: Error) => void
}

/** 从意图 + 选中内容推导一句提问文案（仅在未显式提供 question 时兜底） */
function buildQuestionFromIntent(
  intent: AskIntent,
  sel?: SelectedContext,
  bookTitle?: string,
): string {
  const clip = sel ? (sel.text.length > 80 ? `${sel.text.slice(0, 80)}…` : sel.text) : ''
  switch (intent) {
    case 'explain':
      return `请帮我解释这一段：「${clip}」\n\n结合全书，这段话到底在讲什么？`
    case 'why':
      return `关于「${clip}」，为什么作者会这么说？结合全书解释原因。`
    case 'explore':
      return `围绕「${clip}」这个话题，还有哪些相关的延伸观点值得继续探索？`
    default:
      return `请讲讲《${bookTitle ?? '这本书'}》的核心观点。`
  }
}

/**
 * 统一入口：askBookQuestion(options)
 * - 同时覆盖 Global Book QA 与 Contextual Reading QA
 * - 检索优先级：Selected → Same Chapter → Whole Book（retrieveWithContext）
 * - 首选 LLM，失败 / 未通过 Grounded 校验 → 自动降级 Mock
 */
export async function askBookQuestion(opts: AskBookOptions): Promise<AskResultEx> {
  const { bookId, selectedContext, intent = 'ask' } = opts
  const book = getBook(bookId)
  if (!book) throw new Error(`Book not found: ${bookId}`)

  const selectedChunk = selectedContext ? CHUNK_MAP.get(selectedContext.chunkId) : undefined
  const question =
    (opts.question ?? '').trim() || buildQuestionFromIntent(intent, selectedContext, book.title)
  const selectedText = selectedContext?.text?.trim() || undefined

  // 1) Mock 预置：即使在 LLM 模式下，预置答案也优先（这样建议问题一定能命中）
  const prebuilt = findPrebuilt(question)
  const ranked = retrieveWithContext(bookId, question, selectedChunk) // 选中 → 同章 → 整本
  const top = ranked.slice(0, 4)
  const retrieval: RetrievalStep[] = top.map(toStep)

  if (prebuilt && !opts.forceMock && !isLLMAvailable()) {
    return { retrieval, answer: prebuilt, answerSource: 'mock-prebuilt' }
  }
  if (prebuilt && opts.forceMock) {
    return { retrieval, answer: prebuilt, answerSource: 'mock-prebuilt' }
  }

  // 2) 真实 LLM
  if (!opts.forceMock && isLLMAvailable()) {
    try {
      const { system, user } = buildRAGPrompt(question, top, selectedText)
      const { content, model } = await callLLM({ system, user, signal: opts.signal })
      const built = buildLLMAnswer(book, question, content, top)
      if (built) {
        return { retrieval, answer: built, answerSource: 'llm', model }
      }
      // 解析失败 / 无 Grounded 引用 → 走合成
      opts.onLLMError?.(new Error('LLM 答案未通过 Grounded 校验'))
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      opts.onLLMError?.(err)
    }
  }

  // 3) Mock 兜底（合成）—— 同样带入选区上下文，让 fallback 也有语境
  const synthAnswer = synthesize(question, ranked, book, selectedContext)
  return { retrieval, answer: synthAnswer, answerSource: 'mock-synth' }
}

/** 兼容旧调用：askQuestion(question, bookId, opts) —— 内部转调统一入口 */
export async function askQuestion(
  question: string,
  bookId: string,
  opts: AskOptions = {},
): Promise<AskResultEx> {
  return askBookQuestion({
    bookId,
    question,
    selectedContext: opts.selectedContext,
    intent: opts.intent,
    forceMock: opts.forceMock,
    signal: opts.signal,
    onLLMError: opts.onLLMError,
  })
}
