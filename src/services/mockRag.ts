import type {
  AIAnswer,
  AskResult,
  Book,
  BookChunk,
  Citation,
  FollowUpQuestion,
  Insight,
  RetrievalStep,
  SelectedContext,
} from '../types'
import { getBook } from '../data/books'
import { CHUNKS, getChunksByBook } from '../data/chunks'
import { PREBUILT_ANSWERS } from '../data/answers'

/**
 * ============================================================================
 *  Mock RAG 引擎  ——  第一版（纯前端，无后端 / 无真实 LLM / 无 embedding）
 * ----------------------------------------------------------------------------
 *  对外接口：
 *    retrieveChunks(bookId, question)  → BookChunk[]   （关键词检索 + 打分）
 *    askBookQuestion(question, bookId)  → AskResult     （检索 → 答案 → 引用 → 追问）
 *    generateFollowUpQuestions(...)     → FollowUpQuestion[]（3 条）
 *
 *  未来替换路径（结构已预留，UI 层零改动）：
 *    Frontend → /api/ask → Retriever → Vector DB → LLM → Structured Answer
 *  只需把 askBookQuestion() 内部改为 fetch('/api/ask')，其余不动。
 * ============================================================================
 */

export const CHUNK_MAP = new Map(CHUNKS.map((c) => [c.id, c]))

/** 给 answerEngine 同步检索使用；UI 仍走 retrieveChunks(bookId, question) */
export function getChunksByBookSync(bookId: string): BookChunk[] {
  return getChunksByBook(bookId)
}

// ---------------------------------------------------------------------------
// 检索：retrieveChunks
// ---------------------------------------------------------------------------

/** 候选关键词词表：所有 chunk 的 keywords 并集，按长度降序优先匹配更长更具体的词 */
function buildVocabulary(book: Book): string[] {
  const set = new Set<string>()
  book &&
    getChunksByBook(book.id).forEach((c) => c.keywords.forEach((k) => set.add(k)))
  return Array.from(set).sort((a, b) => b.length - a.length)
}

function extractKeywords(question: string, vocab: string[]): string[] {
  return vocab.filter((k) => question.includes(k))
}

function overlapScore(q: string, text: string): number {
  let s = 0
  for (let i = 0; i < q.length - 1; i++) {
    if (text.includes(q.slice(i, i + 2))) s += 1
  }
  return s
}

/** 关键词在本书中的文档频次（DF），供 IDF 加权使用：越稀有越有区分度 */
function buildKeywordDF(chunks: BookChunk[]): Map<string, number> {
  const df = new Map<string, number>()
  for (const c of chunks) {
    for (const k of new Set(c.keywords)) df.set(k, (df.get(k) ?? 0) + 1)
  }
  return df
}

/**
 * 给每个 chunk 打分（v2 迭代版）。
 *
 * 改动点：命中关键词按「长度(特异性) × IDF(稀有度)」加权，
 * 再叠加「归一化字符重叠」裁决同分并列。
 *
 * 修复的问题：旧版对「任意」命中关键词固定 +3，不考虑词的特异性，
 * 导致大量同分并列，最终退化为数组插入顺序决定胜负。
 * 例：问「框架效应是什么？」，「锚定效应」与「框架效应」同为 3 分，
 * 而「锚定效应」在数组中更靠前 → 错误占位。
 *
 * 离线评测（33 条标注问答）结果：首条溯源定位率 81.8% → 93.9%。
 */
function scoreChunks(question: string, book: Book, keywords: string[]): BookChunk[] {
  const chunks = getChunksByBook(book.id)
  const n = Math.max(1, chunks.length)
  const df = buildKeywordDF(chunks)
  const idf = (k: string) => Math.log(1 + n / (df.get(k) ?? 1))
  const norm = Math.max(1, question.length - 1)

  const scored = chunks.map((c) => {
    const matched = Array.from(new Set(c.keywords)).filter((k) => keywords.includes(k))
    const kwScore = matched.reduce((acc, k) => acc + k.length * idf(k), 0)
    const s = kwScore + overlapScore(question, c.text) / norm
    return { c, s }
  })
  scored.sort((a, b) => b.s - a.s)
  return scored.map((x) => x.c)
}

export function retrieveChunks(bookId: string, question: string): BookChunk[] {
  const book = getBook(bookId)
  if (!book) return []
  const vocab = buildVocabulary(book)
  const keywords = extractKeywords(question, vocab)
  return scoreChunks(question, book, keywords)
}

/**
 * Contextual Reading QA 的检索优先级：
 *   选中内容(Selected) → 当前章节(Same Chapter) → 整本书(Whole Book)
 * 即：把读者选中的 chunk 提到最前，紧接同章节的相关 chunk，
 * 其余整本检索结果殿后。这样既保证答案优先引用选区，
 * 又能必要时从章节 / 全书补全背景。
 */
export function retrieveWithContext(
  bookId: string,
  question: string,
  selectedChunk?: BookChunk | null,
): BookChunk[] {
  const ranked = retrieveChunks(bookId, question)
  if (!selectedChunk) return ranked
  const sameChapter = ranked.filter(
    (c) => c.chapterId === selectedChunk.chapterId && c.id !== selectedChunk.id,
  )
  const others = ranked.filter((c) => c.chapterId !== selectedChunk.chapterId)
  return [selectedChunk, ...sameChapter, ...others]
}

// ---------------------------------------------------------------------------
// 答案合成（命中预置则用预置，否则基于检索到的 chunks 合成）
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

/** 命中预置答案（精确或包含匹配前 6 字） */
function findPrebuilt(question: string): AIAnswer | undefined {
  const exact = PREBUILT_ANSWERS[question]
  if (exact) return exact
  const key = Object.keys(PREBUILT_ANSWERS).find((k) => question.includes(k.slice(0, 6)))
  return key ? PREBUILT_ANSWERS[key] : undefined
}

/** 未命中预置时，基于检索到的 chunks 合成结构化答案（依然 Grounded） */
function synthesize(question: string, chunks: BookChunk[], book: Book): AIAnswer {
  const top = chunks.slice(0, 3)
  const citations = top.map(toCitation)
  const insights: Insight[] = top.map((c, i) => ({
    id: `syn-i${i}`,
    text: `第${c.chapterNumber}章《${c.chapterTitle}》提到：${c.text.slice(0, 20)}…`,
  }))
  const kw = Array.from(new Set(top.flatMap((c) => c.keywords))).slice(0, 3)
  const conclusion = `根据《${book.title}》的内容，作者围绕你的问题给出了相关论述，主要涉及${kw.join('、')}等方面。`
  const explanation = top.map((c) => `第${c.chapterNumber}章写道：「${c.text}」`).join(' ')
  return {
    question,
    conclusion,
    explanation,
    insights,
    citations,
    followUpQuestions: generateFollowUpQuestions(question, book, top),
  }
}

// ---------------------------------------------------------------------------
// 追问生成：generateFollowUpQuestions
// ---------------------------------------------------------------------------

export function generateFollowUpQuestions(
  question: string,
  book: Book,
  topChunks: BookChunk[],
  selectedContext?: SelectedContext,
): FollowUpQuestion[] {
  // 预置答案自带追问
  const prebuilt = findPrebuilt(question)
  if (prebuilt) return prebuilt.followUpQuestions

  // Contextual QA：追问优先围绕【选中内容 + 当前答案 + 相关 chunk】
  if (selectedContext) {
    const clip =
      selectedContext.text.length > 20
        ? `${selectedContext.text.slice(0, 20)}…`
        : selectedContext.text
    const chapter = book.chapters.find((c) => c.id === selectedContext.chapterId)
    const where = chapter ? `第${chapter.number}章《${chapter.title}》` : '这一段'
    const kw = Array.from(new Set(topChunks.flatMap((c) => c.keywords)))[0] ?? '这个观点'
    return [
      { id: 'fu1', text: `「${clip}」这句话还和书中哪些观点呼应？` },
      { id: 'fu2', text: `作者为什么在${where}特别强调这一点？` },
      { id: 'fu3', text: `现实中怎么运用「${kw}」这个判断？` },
    ]
  }

  // 否则基于命中的关键词生成 3 条
  const kw = Array.from(new Set(topChunks.flatMap((c) => c.keywords))).slice(0, 3)
  if (kw.length === 0) {
    return [
      { id: 'fu1', text: `能再展开讲讲《${book.title}》的核心观点吗？` },
      { id: 'fu2', text: '书里有哪些相关的例子？' },
      { id: 'fu3', text: '这个结论和别的章节矛盾吗？' },
    ]
  }
  return kw.map((k, i) => ({ id: `fu${i + 1}`, text: `能不能展开讲讲"${k}"？` }))
}

// ---------------------------------------------------------------------------
// 核心接口：askBookQuestion
// ---------------------------------------------------------------------------

export function askBookQuestion(question: string, bookId: string): AskResult {
  const book = getBook(bookId)
  if (!book) throw new Error(`Book not found: ${bookId}`)

  const ranked = retrieveChunks(bookId, question)
  const top = ranked.slice(0, 4)

  // Retrieval 步骤（驱动 Moment 1 动画）
  const retrieval: RetrievalStep[] = top.map(toStep)

  // Answer：优先预置，否则合成
  const answer: AIAnswer = findPrebuilt(question) ?? synthesize(question, ranked, book)

  return { retrieval, answer }
}

/** 供 answerEngine + UI 校验 chunk 是否存在 */
export function getChunk(chunkId: string): BookChunk | undefined {
  return CHUNK_MAP.get(chunkId)
}

/**
 * 异步版 ask：走 answerEngine（LLM 优先，失败/未配置回退 Mock）。
 * 与原有的同步 `askBookQuestion` 并存：UI 层在过渡期可任选其一。
 */
export { askQuestion as askBookQuestionAsync } from './answerEngine'
/** 当前模型名（用于 UI 展示） */
export { getActiveModelName, isLLMAvailable } from './llmClient'
