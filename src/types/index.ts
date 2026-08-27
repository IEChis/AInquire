// 《AI问书》核心数据模型 —— Mock 阶段契约
// 未来接入真实 LLM / Vector DB 时，AIAnswer / Citation 等字段保持不变，前端零改动。

/** 章节：阅读器左侧目录与"继续阅读"的最小单元 */
export interface Chapter {
  id: string
  number: number
  title: string
  startPage: number
  endPage: number
}

/** 书中最小检索 / 引用单元（Retrieval 命中即此对象） */
export interface BookChunk {
  id: string
  bookId: string
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  page: number
  section?: string
  text: string
  keywords: string[]
}

/** 引用：把答案中的结论锚定到具体原文片段（Principle 2 Traceable 的落点） */
export interface Citation {
  chunkId: string
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  page: number
  quote: string
}

/** 核心观点 / Key Insight（AI Answer 中的结构化要点） */
export interface Insight {
  id: string
  text: string
}

/** 继续追问（Follow-up）：用户点击后自动发送 */
export interface FollowUpQuestion {
  id: string
  text: string
}

/** 用户的一条提问 */
export interface AIQuestion {
  id: string
  text: string
  createdAt: number
}

/** 结构化答案（强制模板：结论 → 解释 → 核心观点 → 书中依据 → 继续提问） */
export interface AIAnswer {
  question: string
  conclusion: string
  explanation: string
  insights: Insight[]
  citations: Citation[]
  followUpQuestions: FollowUpQuestion[]
}

/** 首页 / 书架展示用的建议问题 */
export interface SuggestedQuestion {
  q: string
  hint?: string
}

export interface BookCover {
  bg: string
  fg: string
}

/** 书籍元数据 + 章节（不含原文片段，片段集中在 chunks.ts） */
export interface Book {
  id: string
  title: string
  author: string
  cover: BookCover
  description: string
  intro: string
  chapterCount: number
  suggestedQuestions: SuggestedQuestion[]
  chapters: Chapter[]
}

/** 检索过程的一步（驱动 Moment 1 "检索正在发生"动画） */
export interface RetrievalStep {
  chunkId: string
  chapterNumber: number
  chapterTitle: string
  page: number
  snippet: string
}

export interface AskResult {
  retrieval: RetrievalStep[]
  answer: AIAnswer
}

/** 一次完整的问答回合 */
export interface QATurn {
  question: AIQuestion
  answer: AIAnswer
  /** 这条答案来自真实大模型 / Mock 预置 / Mock 合成（用于 UI 透明度） */
  source?: 'llm' | 'mock-prebuilt' | 'mock-synth'
  /** 大模型名（仅在 source === 'llm' 时有值） */
  model?: string
}

/** 选中文字后发起上下文提问时携带的环境信息（Reader → AI 的来路） */
export interface SelectedContext {
  id: string
  bookId: string
  chapterId: string
  chunkId: string
  page: number
  text: string
  /** 选区在 chunk 文本内的字符偏移（精确定位用，可空） */
  startOffset?: number
  endOffset?: number
  /** 便于 UI 直接展示的章节信息（由阅读器补全，可空） */
  chapterNumber?: number
  chapterTitle?: string
}

/** 用户的一条提问（扩展：区分 global / selection 两种来源） */
export interface AIQuestion {
  id: string
  text: string
  createdAt: number
  /** 所属图书 id（便于跨书检索与统计） */
  bookId?: string
  /**
   * 提问来源：
   *  - 'global'    = 直接向整本书提问（底部输入框 / 建议问题）
   *  - 'selection' = 针对原文选中内容提问（Contextual Reading QA）
   */
  source?: 'global' | 'selection'
  /** 选中内容上下文（仅当 source === 'selection' 时有值） */
  selectedContext?: SelectedContext
}

/** 用户保存的笔记（持久化到 localStorage） */
export interface Note {
  id: string
  bookId: string
  bookTitle: string
  question: string
  answerSnippet: string
  insights: string[]
  citation?: Citation
  content: string
  createdAt: string
}
