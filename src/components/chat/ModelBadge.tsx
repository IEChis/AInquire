import { useEffect, useState } from 'react'
import { CircleAlert, CircleCheck, Sparkles } from 'lucide-react'
import { getActiveModelName, isLLMAvailable } from '../../services/llmClient'

type Status = 'ready' | 'mock' | 'degraded'

/**
 * 中栏头部状态 chip：当前答案引擎 + 模型名。
 *
 * 三态：
 *   - ready   ：大模型已就绪且最近一次跑通 → 绿色"AI 大模型 · 模型名"
 *   - degraded：配置了 LLM 但最近一次失败/降级 → 琥珀"已切换到本地兜底"
 *   - mock    ：用户没配置 key → 灰色"本地模式"
 */
export default function ModelBadge({ error }: { error?: Error | null }) {
  const [status, setStatus] = useState<Status>('mock')

  useEffect(() => {
    setStatus(isLLMAvailable() ? 'ready' : 'mock')
  }, [])

  // 一旦收到 error，就从 ready 切到 degraded（仅当配置了 LLM 的情况下）
  const effective: Status = error && status === 'ready' ? 'degraded' : status
  const model = getActiveModelName() ?? 'LLM'

  if (effective === 'degraded') {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-soft border border-amber-100 px-2 py-1 rounded-full"
        title={error?.message || '已切到本地兜底'}
      >
        <CircleAlert size={12} />
        已切到本地兜底 · <span className="font-medium">{model}</span> 暂不可用
      </span>
    )
  }
  if (effective === 'mock') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-muted bg-surface border border-line px-2 py-1 rounded-full">
        <CircleAlert size={12} className="text-amber" />
        本地模式（未配置大模型 API Key）
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
      <CircleCheck size={12} />
      <Sparkles size={11} />
      AI 大模型 · <span className="font-medium">{model}</span>
    </span>
  )
}
