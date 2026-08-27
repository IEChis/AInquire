/// <reference types="vite/client" />

/**
 * AI问书 · 环境变量类型声明
 * Vite 暴露给浏览器访问的变量以 VITE_ 前缀命名。
 */
interface ImportMetaEnv {
  /** 大模型 API base URL（OpenAI Chat Completions 协议） */
  readonly VITE_LLM_API_BASE?: string
  /** 大模型 API Key */
  readonly VITE_LLM_API_KEY?: string
  /** 模型名，如 deepseek-v4-flash / gpt-4o-mini */
  readonly VITE_LLM_MODEL?: string
  /** 是否启用真实 LLM（失败会回退到 Mock） */
  readonly VITE_LLM_ENABLED?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
