/**
 * ============================================================================
 *  LLM 客户端  ——  通过 OpenAI Chat Completions 协议调用大模型
 * ----------------------------------------------------------------------------
 *  设计约束（来自产品原则）：
 *    Principle 1 Grounded：AI 必须只用我提供的原文片段，绝不编造引用。
 *    Principle 2 Traceable：仅暴露合法的 chunkId，前端据此渲染 Citation。
 *    输出严格 JSON，便于上层做 schema 校验与降级。
 *
 *  使用：
 *    import { callLLM, isLLMAvailable } from './llmClient'
 *    if (isLLMAvailable()) {
 *      const { content } = await callLLM({ system, user, signal })
 *    }
 * ============================================================================
 */

import type { BookChunk } from '../types'

// 客户端调用统一走 /llm 代理，避免 CORS，并隐藏真实 base。
// 生产环境应在 Nginx / 服务端做等价代理。
const DEFAULT_LLM_PATH = '/llm/chat/completions'

const LLM_TIMEOUT_MS = 15_000

export interface LLMConfig {
  base?: string // 不推荐直接传 base；正常用 .env
  apiKey?: string
  model?: string
}

/** 读取环境配置（自动从 import.meta.env 读 .env）。 */
export function getLLMConfig(): LLMConfig & { enabled: boolean } {
  return {
    enabled: String(import.meta.env.VITE_LLM_ENABLED ?? 'true').toLowerCase() !== 'false',
    apiKey: import.meta.env.VITE_LLM_API_KEY?.trim() || undefined,
    model: import.meta.env.VITE_LLM_MODEL?.trim() || undefined,
    base: import.meta.env.VITE_LLM_API_BASE?.trim() || undefined,
  }
}

/** 判断 LLM 是否可用（开关 + key + model 都到位）。 */
export function isLLMAvailable(): boolean {
  const cfg = getLLMConfig()
  return cfg.enabled && !!cfg.apiKey && !!cfg.model
}

/** 当前正在使用的模型名（用于 UI 展示，未启用时为 undefined）。 */
export function getActiveModelName(): string | undefined {
  const cfg = getLLMConfig()
  return cfg.enabled && cfg.model ? cfg.model : undefined
}

// --- OpenAI Chat Completions 协议 ----------------------------------------

interface ChatMsg {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  model: string
  messages: ChatMsg[]
  temperature?: number
  /** 强制 JSON 输出（多数 OpenAI-兼容服务支持） */
  response_format?: { type: 'json_object' | 'json_schema' }
  /** 上限，避免模型自由发挥写出过多内容 */
  max_tokens?: number
}

interface ChatResponse {
  choices: { message: { role: 'assistant'; content: string } }[]
}

/**
 * 通用 fetch 调用。
 * - 默认走开发服务器的 /llm 代理；
 * - 如果没有代理或需要直连，可传 base（生产慎用）。
 */
export async function callLLM(opts: {
  system: string
  user: string
  signal?: AbortSignal
  temperature?: number
  /** 失败回调，给上层选择降级策略 */
  onError?: (err: Error) => void
}): Promise<{ content: string; model: string }> {
  const cfg = getLLMConfig()
  if (!cfg.apiKey || !cfg.model) {
    throw new Error('LLM 未配置（缺少 VITE_LLM_API_KEY / VITE_LLM_MODEL）')
  }
  // ⚠️ 永远走相对路径 /llm/chat/completions，让 vite proxy 转发。
  // 严禁走绝对 URL 直连，原因：
  //   1) 浏览器同源策略会拦截跨域请求（即便后端允许 CORS，Key 也会被暴露给所有访问者）；
  //   2) 暴露真实 base 会让 API Key 出现在前端 bundle 中；
  //   3) 直连没有重试/日志/审计能力。
  // 生产部署必须在 Nginx / CDN / 网关侧做等价代理。
  const finalUrl = DEFAULT_LLM_PATH

  const body: ChatRequest = {
    model: cfg.model,
    messages: [
      { role: 'system', content: opts.system },
      { role: 'user', content: opts.user },
    ],
    temperature: opts.temperature ?? 0.4,
    max_tokens: 1800,
    response_format: { type: 'json_object' },
  }

  // 超时控制
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS)
  // 兼容外层传入 signal
  if (opts.signal) {
    if (opts.signal.aborted) controller.abort()
    else opts.signal.addEventListener('abort', () => controller.abort())
  }

  let res: Response
  try {
    res = await fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e))
    opts.onError?.(err)
    throw err
  } finally {
    clearTimeout(timer)
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const err = new Error(`LLM ${res.status}: ${text.slice(0, 200)}`)
    opts.onError?.(err)
    throw err
  }
  const data = (await res.json()) as ChatResponse
  const content = data.choices?.[0]?.message?.content ?? ''
  if (!content) {
    const err = new Error('LLM 返回为空')
    opts.onError?.(err)
    throw err
  }
  return { content, model: cfg.model }
}

// --- Grounded answer prompting --------------------------------------------

/** 期望 LLM 返回的 JSON 结构（仅约束，不强制运行时）。 */
export interface LLMAnswerJSON {
  conclusion: string
  explanation: string
  insights: { text: string }[]
  /** 必须使用上方 context 给定的 chunkId 之一 */
  citationChunkIds: string[]
  followUpQuestions: { text: string }[]
}

/**
 * 构造 RAG 提示词。
 *
 * 设计原则（让国产模型也能稳定工作）：
 *   1) **不要求模型决定引用**——RAG 的本质是 retriever 决定 evidence，generator 负责语言。
 *      模型可以"建议"引用编号，但不强依赖，retriever 永远会兜底补齐。
 *   2) **禁止复读原文**——要的是"编辑感"的总结，让读者真的懂，不是把片段抄一遍。
 *   3) **输出必须 JSON**，但容许 markdown 代码块包裹（解析层会兜）。
 *
 * 上下文喂入格式（用编号 1..N 替代 chunkId，对国产模型更友好）：
 *   [1] 第3章《xxx》 P.42
 *   <原文片段...>
 */
export function buildRAGPrompt(
  question: string,
  topChunks: BookChunk[],
  selectedText?: string,
): {
  system: string
  user: string
} {
  const context = topChunks
    .slice(0, 6)
    .map(
      (c, i) =>
        `[${i + 1}] 第${c.chapterNumber}章《${c.chapterTitle}》 P.${c.page}\n${c.text}`,
    )
    .join('\n\n')

  const selectedBlock = selectedText
    ? `\n【用户选中的原文】\n「${selectedText}」\n`
    : ''

  const system = `你是「AI问书」阅读助手。面对读者关于一本书的提问，**只允许**基于【context】中提供的原文片段作答，绝不引用未给出的内容。

# 你的角色
你是一位读过这本书的编辑，正在用克制、清晰的语言帮读者把书里的东西讲明白。语气要像编辑对读者的回应——不卖弄、不堆砌、不"背诵原文"。

# 硬性约束
1. **绝不逐字复读原文**：context 给你的是"原料"，你要做的是"再加工"。可以化用、改写、提炼，但不能整段抄给读者。
2. **绝不编造**：章节号、页码、引用编号必须从 context 取；context 没有的，宁可省略。
3. **可引用**：citationNumbers 是 context 里的编号（[1]..[N]），挑出最相关的 1-3 个。
   - 如果你不确定该引哪条，可以返回空数组 [] —— 客户端会基于检索结果自动补齐。
4. **结论要"像编辑写的"**：≤60 字，能直接回答"作者怎么看 / 怎么解决这个问题"。
5. **解释要"让外行能懂"**：1-2 段，把书里的概念翻译成读者能用的语言，结合书的语境，不要堆术语。
6. **核心观点（insights）= 行动性结论**：读者读完应该能"带走"点什么，比如"下次遇到这种判断，可以这样校准"。
7. **追问（followUpQuestions）= 真正值得继续问的**：要顺着你的结论问，而不是把上面的问题换个说法。

# 输出格式（必须是合法 JSON 对象，不要 markdown 代码块、不要任何解释文字）
{
  "conclusion": "一句话结论，编辑感",
  "explanation": "1-2 段解释，把书里的东西翻译给读者",
  "insights": [ { "text": "可带走的行动性观点 1" }, { "text": "..." } ],
  "citationNumbers": [1, 2],          // 引用 context 里的编号；可空数组
  "followUpQuestions": [ { "text": "..." }, { "text": "..." }, { "text": "..." } ]
}

# 常见错误（请避免）
- ❌ "第3章写道：『系统1是直觉...』" —— 这是复读，不是回答
- ❌ "根据《xxx》的内容，作者围绕你的问题给出了相关论述，主要涉及 XX 方面" —— 废话
- ✅ "作者把心智分成两套系统：系统1走快路、省力但容易偏；系统2走慢路、费力但能纠偏。日常里两套系统互相配合，问题出在系统2偷懒时——这就是为什么人疲惫时更容易做错判断。" —— 这才是回答`

  const user = `【当前书籍】${topChunks[0]?.bookId ?? ''}

【用户问题】
${question}
${selectedBlock}
【context】
${context}

请按 system 中的硬约束，输出 JSON 对象。${selectedText ? '尤其要结合【用户选中的原文】来回答。' : ''}`

  return { system, user }
}
