import type { QATurn, SelectedContext } from '../../types'
import type { AnswerSource } from '../../services/answerEngine'
import { isLLMAvailable } from '../../services/llmClient'
import InsightCard from './InsightCard'
import FollowUpQuestions from './FollowUpQuestions'
import CitationCard from '../citation/CitationCard'
import { Bookmark, Plus, Quote, ArrowUpRight, Check, Sparkles, CircleAlert } from 'lucide-react'
import { useState } from 'react'

/**
 * 结构化答案卡片（Principle 3 Readable / Principle 4 Actionable）。
 * 模板：结论 → 解释 → 核心观点 → 书中依据 → 继续提问。
 * 不使用聊天气泡流，以区别于普通 Chatbot。
 */
export default function AnswerCard({
  turn,
  source,
  model,
  onJump,
  onFollowUp,
  onSaveNote,
}: {
  turn: QATurn
  source?: AnswerSource
  model?: string
  onJump: (chunkId: string) => void
  onFollowUp: (q: string) => void
  onSaveNote: (turn: QATurn) => void
}) {
  const { answer } = turn
  const [saved, setSaved] = useState(false)
  const [fav, setFav] = useState(false)

  // Contextual Reading QA：选中内容作为 Primary Context，其余 citations 为 Supporting
  const sel = turn.question.selectedContext
  const supporting = sel
    ? answer.citations.filter((c) => c.chunkId !== sel.chunkId)
    : answer.citations

  function handleSave() {
    onSaveNote(turn)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  return (
    <article className="bg-surface rounded-card border border-line shadow-card p-5 sm:p-6 animate-fade-up">
      {/* 上下文提问专属：关于你选中的内容（Reader → AI 的来路） */}
      {sel && (
        <div className="mb-4 rounded-xl bg-accent-soft/60 border border-accent/15 px-4 py-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-accent uppercase">
            <Quote size={12} /> 关于你选中的内容
          </div>
          <blockquote className="mt-1.5 text-sm text-ink/80 leading-relaxed border-l-2 border-accent pl-3">
            {sel.text.length > 240 ? `${sel.text.slice(0, 240)}…` : sel.text}
          </blockquote>
          {(sel.chapterNumber || sel.page) && (
            <div className="mt-2 text-[11px] text-faint">
              阅读上下文 · 第{sel.chapterNumber}章《{sel.chapterTitle}》 · P.{sel.page}
            </div>
          )}
        </div>
      )}

      {/* 问题回显 + Grounded 标识 */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold leading-snug">{answer.question}</h3>
        <SourceBadge source={source} model={model} />
      </div>

      {/* 结论 */}
      <Section label="结论">
        <p className="text-ink font-medium leading-relaxed">{answer.conclusion}</p>
      </Section>

      {/* 解释 */}
      <Section label="详细解释">
        <p className="text-muted leading-relaxed text-[15px]">{answer.explanation}</p>
      </Section>

      {/* 核心观点 */}
      <Section label="核心观点" icon={<Quote size={13} className="text-amber" />}>
        <ul className="space-y-2.5 mt-1">
          {answer.insights.map((ins, i) => (
            <InsightCard key={ins.id} insight={ins} index={i + 1} />
          ))}
        </ul>
      </Section>

      {/* Primary Context（用户选中内容）+ Supporting Citations（章节/全书检索到的其他依据） */}
      {sel && (
        <Section label="选中内容" icon={<Quote size={13} className="text-accent" />}>
          <PrimaryContextCard ctx={sel} onReturn={onJump} />
        </Section>
      )}

      {/* 书中依据：每条都是可点击跳转的证据卡（Principle 2 Traceable） */}
      {supporting.length > 0 && (
        <Section
          label={sel ? '相关依据' : '书中依据'}
          icon={<ArrowUpRight size={13} className="text-accent" />}
        >
          <div className="space-y-2.5 mt-1">
            {supporting.map((c, i) => (
              <CitationCard key={c.chunkId} citation={c} index={i + 1} onJump={onJump} />
            ))}
          </div>
        </Section>
      )}

      {/* 继续提问（Follow-up） */}
      <div className="mt-5">
        <FollowUpQuestions questions={answer.followUpQuestions} onAsk={onFollowUp} />
      </div>

      {/* 行动栏（Principle 4 Actionable） */}
      <div className="mt-6 pt-4 border-t border-line flex items-center gap-2">
        <button
          onClick={() => onJump(answer.citations[0]?.chunkId)}
          className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1"
        >
          <ArrowUpRight size={14} /> 查看原文
        </button>
        <span className="text-line">·</span>
        <button
          onClick={handleSave}
          disabled={saved}
          className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 ${
            saved
              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
              : 'text-ink border border-line hover:border-accent hover:text-accent'
          }`}
        >
          {saved ? <Check size={14} /> : <Plus size={14} />}
          {saved ? '已保存到笔记' : '保存笔记'}
        </button>
        <button
          onClick={() => setFav((v) => !v)}
          title={fav ? '已收藏' : '收藏'}
          aria-pressed={fav}
          className={`ml-auto text-sm transition-colors rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 ${
            fav ? 'text-accent' : 'text-faint hover:text-accent'
          }`}
        >
          <Bookmark size={16} className={fav ? 'fill-accent' : ''} />
        </button>
      </div>
    </article>
  )
}

function Section({
  label,
  icon,
  children,
}: {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="mt-5">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-semibold tracking-wide text-faint uppercase">{label}</span>
        <span className="flex-1 h-px bg-line" />
      </div>
      {children}
    </section>
  )
}

/**
 * 来源标识：告诉用户"这条答案是真实大模型给的，还是本地内容给的"。
 * Grounded 原则下，每条答案都基于书中内容生成；标识只是透明度。
 * 配色克制：仅"真实 LLM"用 emerald 作正信号；本地内容统一用 accent；
 * 只有"配置了 LLM 却没用上（失败/未通过校验）"才用 amber 提示，避免颜色泛滥。
 */
function SourceBadge({ source, model }: { source?: AnswerSource; model?: string }) {
  if (source === 'llm') {
    return (
      <span className="shrink-0 mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
        <Sparkles size={11} />
        AI 大模型 · <span className="font-medium">{model ?? 'LLM'}</span>
      </span>
    )
  }
  if (source === 'mock-synth' && isLLMAvailable()) {
    // 配置了大模型但本次没用上（连接失败 / 未通过 Grounded 校验）→ 明确告警
    return (
      <span className="shrink-0 mt-1 inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-soft border border-amber-100 px-2 py-0.5 rounded-full">
        <CircleAlert size={11} />
        本地兜底 · 大模型暂不可用
      </span>
    )
  }
  if (source === 'mock-prebuilt') {
    return (
      <span className="shrink-0 mt-1 inline-flex items-center gap-1 text-[11px] text-accent bg-accent-soft border border-accent/20 px-2 py-0.5 rounded-full">
        <Sparkles size={11} />
        预设答案 · 基于书中内容
      </span>
    )
  }
  return (
    <span className="shrink-0 mt-1 inline-flex items-center gap-1 text-[11px] text-accent bg-accent-soft px-2 py-0.5 rounded-full">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" /> 基于书中内容
    </span>
  )
}

/**
 * Primary Context 卡片：显示在 Contextual QA 答案中的「用户选中内容」。
 * 与「相关依据」(CitationCard) 区分——它代表读者提问的起点，
 * 并提供「返回选中位置」把读者送回原文对应片段（Reader 高亮 + 滚动）。
 */
function PrimaryContextCard({
  ctx,
  onReturn,
}: {
  ctx: SelectedContext
  onReturn: (chunkId: string) => void
}) {
  return (
    <div className="rounded-card border border-accent/30 bg-accent-soft/50 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-accent/10 border-b border-accent/20">
        <span className="grid place-items-center h-5 w-5 rounded bg-accent text-paper">
          <Quote size={11} />
        </span>
        <span className="text-[11px] font-semibold tracking-wide text-accent uppercase">
          你的选中内容
        </span>
        <span className="ml-auto text-[11px] text-muted">
          第{ctx.chapterNumber}章 · P.{ctx.page}
        </span>
      </div>
      <blockquote className="px-3 py-2.5 text-sm text-ink/90 leading-relaxed">
        {ctx.text}
      </blockquote>
      <div className="flex items-center justify-between px-3 py-2 border-t border-accent/20">
        <span className="text-[11px] text-faint">这是你提问的起点</span>
        {ctx.chunkId && (
          <button
            onClick={() => onReturn(ctx.chunkId)}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          >
            返回选中位置 <ArrowUpRight size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
