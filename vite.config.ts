import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ROOT = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Vite 配置同时读取 .env（开发期代理需要目标地址）
  const env = loadEnv(mode, ROOT, '')
  const llmBase = env.VITE_LLM_API_BASE || 'https://aigw.yuexiuproperty.cn/v1'

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      /**
       * 把大模型调用代理到后端，避免浏览器 CORS。
       * - 客户端请求 /llm/chat/completions
       * - 由 Vite 开发服务器转发到 VITE_LLM_API_BASE/chat/completions
       * - 生产环境请在 Web 服务器（Nginx / CDN）做等价配置，不要把 API Key 暴露给前端
       */
      proxy: {
        '/llm': {
          target: llmBase,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/llm/, ''),
        },
      },
    },
  }
})
