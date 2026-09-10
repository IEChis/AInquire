// 诊断：把每条标注问答的「期望片段 / 实际命中 / 各自得分」打出来，并并排对比候选排序方案。
import { CHUNKS } from '../src/data/chunks'
import { GOLD } from './goldSet'
import { buildVocab, legacyRetrieve, overlapScore } from './legacy'

const CHUNK_MAP = new Map(CHUNKS.map((c) => [c.id, c]))
type Scored = { id: string; s: number }

function normOverlap(q: string, text: string) {
  return overlapScore(q, text) / Math.max(1, q.length - 1)
}

// v1 基线：纯字符重叠
function v1(bookId: string, q: string): Scored[] {
  return CHUNKS.filter((c) => c.bookId === bookId)
    .map((c) => ({ id: c.id, s: overlapScore(q, c.text) }))
    .sort((a, b) => b.s - a.s)
}

// v2 原版：关键词 +3，黄金句 +3
function v2(bookId: string, q: string): Scored[] {
  const cs = CHUNKS.filter((c) => c.bookId === bookId)
  return legacyRetrieve(cs.map((c) => ({ id: c.id, text: c.text, keywords: c.keywords })), q, buildVocab(cs))
    .map((x) => ({ id: x.c.id, s: x.s }))
}

// v3 候选：IDF 加权的关键词命中 + 归一化字符重叠做区分度
function v3(bookId: string, q: string): Scored[] {
  const cs = CHUNKS.filter((c) => c.bookId === bookId)
  const N = cs.length
  const df = new Map<string, number>()
  for (const c of cs) for (const k of new Set(c.keywords)) df.set(k, (df.get(k) ?? 0) + 1)
  const idf = (k: string) => Math.log(1 + N / (df.get(k) ?? 1))
  return cs
    .map((c) => {
      const matched = Array.from(new Set(c.keywords)).filter((k) => q.includes(k))
      const kwScore = matched.reduce((acc, k) => acc + idf(k), 0)
      const s = kwScore + normOverlap(q, c.text) * 1.0
      return { id: c.id, s }
    })
    .sort((a, b) => b.s - a.s)
}

// v4 候选：关键词按「长度(特异性) × IDF(稀有度)」加权 + 归一化字符重叠做并列裁决
function keywordStats(bookId: string) {
  const cs = CHUNKS.filter((c) => c.bookId === bookId)
  const N = cs.length
  const df = new Map<string, number>()
  for (const c of cs) for (const k of new Set(c.keywords)) df.set(k, (df.get(k) ?? 0) + 1)
  return { cs, idf: (k: string) => Math.log(1 + N / (df.get(k) ?? 1)) }
}

function v4(bookId: string, q: string, overlapW = 1.0): Scored[] {
  const { cs, idf } = keywordStats(bookId)
  return cs
    .map((c) => {
      const matched = Array.from(new Set(c.keywords)).filter((k) => q.includes(k))
      const kwScore = matched.reduce((acc, k) => acc + k.length * idf(k), 0)
      return { id: c.id, s: kwScore + normOverlap(q, c.text) * overlapW }
    })
    .sort((a, b) => b.s - a.s)
}

const variants: Array<[string, (b: string, q: string) => Scored[]]> = [
  ['v1 纯字符重叠', v1],
  ['v2 原版关键词加权', v2],
  ['v3 IDF+重叠', v3],
  ['v4 长词IDF+重叠', v4],
]

console.log('=== 各方案 Top-1 / Top-3 溯源定位率 (n=33) ===')
for (const [name, fn] of variants) {
  let t1 = 0
  let t3 = 0
  for (const g of GOLD) {
    const r = fn(g.bookId, g.question).map((x) => x.id)
    if (r[0] === g.expectedChunkId) t1++
    if (r.slice(0, 3).includes(g.expectedChunkId)) t3++
  }
  console.log(`  ${name.padEnd(18)} Top-1 ${(t1 / 33 * 100).toFixed(1)}% (${t1}/33)   Top-3 ${(t3 / 33 * 100).toFixed(1)}% (${t3}/33)`)
}

console.log('')
console.log('=== v4 对重叠权重的敏感度（确认不是靠调参取胜）===')
for (const w of [0, 0.5, 1.0, 2.0, 5.0]) {
  let t1 = 0
  for (const g of GOLD) {
    if (v4(g.bookId, g.question, w)[0].id === g.expectedChunkId) t1++
  }
  console.log(`  重叠权重 w=${w.toFixed(1)}  →  Top-1 ${(t1 / 33 * 100).toFixed(1)}% (${t1}/33)`)
}

console.log('')
console.log('=== v2 原版失手明细（Top-1 未命中期望片段）===')
for (const g of GOLD) {
  const exp = CHUNK_MAP.get(g.expectedChunkId)!
  const r2 = v2(g.bookId, g.question)
  if (r2[0].id === g.expectedChunkId) continue
  const got = CHUNK_MAP.get(r2[0].id)!
  console.log('')
  console.log(`Q: ${g.question}`)
  console.log(`   期望片段 ${g.expectedChunkId} | ${exp.text.slice(0, 26)}…`)
  console.log(`   实际命中 ${r2[0].id} | ${got.text.slice(0, 26)}…`)
  console.log(`   → v2 得分明细: ` + r2.slice(0, 3).map((x) => `${x.id}=${x.s.toFixed(2)}`).join('  '))
  console.log(`   → 期望片段在 v2 中得分=${r2.find((x) => x.id === g.expectedChunkId)?.s.toFixed(2)}, 排名=${r2.findIndex((x) => x.id === g.expectedChunkId) + 1}`)
  const r1 = v1(g.bookId, g.question)
  const r3 = v3(g.bookId, g.question)
  console.log(`   → v1 命中 ${r1[0].id} (${r1[0].id === g.expectedChunkId ? 'OK' : 'MISS'})  |  v3 命中 ${r3[0].id} (${r3[0].id === g.expectedChunkId ? 'OK' : 'MISS'})`)
}
