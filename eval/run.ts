/**
 * AI问书 · 离线溯源评测（权威口径）
 *
 * 评测集：eval/goldSet.ts —— 33 条「(问题, 期望原文片段)」人工标注，覆盖 5 本书。
 * 原理：检索是确定性纯函数，给定问题即可算出命中的原文片段，无需真人参与。
 *
 * 三个指标：
 *   1) 首条溯源定位率 Top-1 = 期望片段排在检索结果第 1 位的比例
 *   2) 前三溯源定位率 Top-3 = 期望片段出现在检索结果前 3 位（即被引用的依据）的比例
 *   3) 选中即问溯源锚定率   = 用户选中某片段后，该片段排在检索结果第 1 位的比例
 *
 * 运行：见 README 或 `npm run eval`
 */
import { CHUNKS } from '../src/data/chunks'
import { retrieveChunks, retrieveWithContext } from '../src/services/mockRag'
import { GOLD } from './goldSet'
import { buildVocab, legacyRetrieve, type MiniChunk } from './legacy'

const CHUNK_MAP = new Map(CHUNKS.map((c) => [c.id, c]))

/** 迭代前的旧版检索（打分逻辑存档在 legacy.ts，保证基线数字永远可复现） */
function legacyRetrieveChunks(bookId: string, question: string) {
  const cs = CHUNKS.filter((c) => c.bookId === bookId)
  const mini: MiniChunk[] = cs.map((c) => ({ id: c.id, text: c.text, keywords: c.keywords }))
  return legacyRetrieve(mini, question, buildVocab(cs)).map((x) => CHUNK_MAP.get(x.c.id)!)
}

type Ret = (bookId: string, q: string) => Array<{ id: string }>

function topK(r: Ret) {
  let t1 = 0
  let t3 = 0
  for (const g of GOLD) {
    const ids = r(g.bookId, g.question).map((c) => c.id)
    if (ids[0] === g.expectedChunkId) t1++
    if (ids.slice(0, 3).includes(g.expectedChunkId)) t3++
  }
  return { t1, t3, n: GOLD.length, r1: t1 / GOLD.length, r3: t3 / GOLD.length }
}

const before = topK((b, q) => legacyRetrieveChunks(b, q))
const after = topK((b, q) => retrieveChunks(b, q))

console.log('=== AI问书 · 离线溯源评测（标注集 n=33，5 本书）===')
console.log('')
console.log('【1】检索排序迭代前后对比（Top-1 首条溯源定位率）')
console.log(`  迭代前（旧版：任意命中关键词固定 +3）  Top-1 ${(before.r1 * 100).toFixed(1)}%  (${before.t1}/${before.n})   Top-3 ${(before.r3 * 100).toFixed(1)}%`)
console.log(`  迭代后（长词×IDF 加权 + 重叠裁决）      Top-1 ${(after.r1 * 100).toFixed(1)}%  (${after.t1}/${after.n})   Top-3 ${(after.r3 * 100).toFixed(1)}%`)
console.log(`  >>> 提升：${(before.r1 * 100).toFixed(1)}% → ${(after.r1 * 100).toFixed(1)}%   (+${(((after.r1 - before.r1) * 100)).toFixed(1)}pp)`)

// 选中即问锚定率：用户选中片段时，该片段是否排到检索首位
let anchorBefore = 0
let anchorAfter = 0
let anchorCtx = 0
for (const g of GOLD) {
  const sel = CHUNK_MAP.get(g.expectedChunkId)!
  if (legacyRetrieveChunks(g.bookId, g.question)[0]?.id === g.expectedChunkId) anchorBefore++
  if (retrieveChunks(g.bookId, g.question)[0]?.id === g.expectedChunkId) anchorAfter++
  if (retrieveWithContext(g.bookId, g.question, sel)[0]?.id === g.expectedChunkId) anchorCtx++
}
const n = GOLD.length
console.log('')
console.log('【2】「选中即问」溯源锚定率（选中片段是否排到检索首位）')
console.log(`  未引入检索优先级（旧版打分）        ${(anchorBefore / n * 100).toFixed(1)}%  (${anchorBefore}/${n})`)
console.log(`  未引入检索优先级（新版打分）        ${(anchorAfter / n * 100).toFixed(1)}%  (${anchorAfter}/${n})`)
console.log(`  引入「选中→同章→整本」优先级        ${(anchorCtx / n * 100).toFixed(1)}%  (${anchorCtx}/${n})`)
console.log(`  >>> 提升：${(anchorBefore / n * 100).toFixed(1)}% → ${(anchorCtx / n * 100).toFixed(1)}%   (+${(((anchorCtx - anchorBefore) / n) * 100).toFixed(1)}pp)`)

console.log('')
console.log('【3】迭代后仍失手的条目（未做任何标签美化）')
for (const g of GOLD) {
  const ids = retrieveChunks(g.bookId, g.question).map((c) => c.id)
  if (ids[0] === g.expectedChunkId) continue
  const exp = CHUNK_MAP.get(g.expectedChunkId)!
  const got = CHUNK_MAP.get(ids[0])!
  console.log(`  Q: ${g.question}`)
  console.log(`     期望 ${g.expectedChunkId} | ${exp.text.slice(0, 30)}…`)
  console.log(`     实际 ${ids[0]} | ${got.text.slice(0, 30)}…  （期望片段排名 ${ids.indexOf(g.expectedChunkId) + 1}）`)
}
