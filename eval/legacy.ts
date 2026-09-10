/**
 * 原版检索打分逻辑存档（= 修改前 src/services/mockRag.ts 中的 scoreChunks）
 * 保留在这里，是为了让「迭代前」的基线数字在任何时候都能被复现和审计，
 * 即使 mockRag.ts 后续被优化。
 */

export function overlapScore(q: string, text: string): number {
  let s = 0
  for (let i = 0; i < q.length - 1; i++) {
    if (text.includes(q.slice(i, i + 2))) s += 1
  }
  return s
}

export type MiniChunk = { id: string; text: string; keywords: string[] }

/** 原版 v2：关键词命中 +3（+2/+1 叠加），黄金句 +3；无关键词命中时退化为字符重叠 */
export function legacyRetrieve(
  bookChunks: MiniChunk[],
  question: string,
  vocab: string[],
) {
  const keywords = vocab.filter((k) => question.includes(k))
  if (keywords.length === 0) {
    return bookChunks
      .map((c) => ({ c, s: overlapScore(question, c.text) }))
      .sort((a, b) => b.s - a.s)
  }
  const scored = bookChunks.map((c) => {
    let s = 0
    c.keywords.forEach((k) => {
      if (keywords.includes(k)) s += 2
      if (question.includes(k)) s += 1
    })
    if (question.includes(c.text.slice(0, 6))) s += 3
    return { c, s }
  })
  return scored.sort((a, b) => b.s - a.s)
}

export function buildVocab(bookChunks: MiniChunk[]): string[] {
  const set = new Set<string>()
  bookChunks.forEach((c) => c.keywords.forEach((k) => set.add(k)))
  return Array.from(set).sort((a, b) => b.length - a.length)
}
