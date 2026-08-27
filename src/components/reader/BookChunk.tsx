import type { BookChunk as Chunk } from '../../types'

/**
 * 原文片段。id 固定为 chunk-${chunk.id}，供 Citation 定位（scrollIntoView）与高亮。
 */
export default function BookChunk({ chunk }: { chunk: Chunk }) {
  return (
    <p
      id={`chunk-${chunk.id}`}
      className="text-[15px] leading-[1.95] text-ink/90 px-2 -mx-2 rounded scroll-mt-6"
    >
      <span className="float-left mt-1 mr-2 text-[11px] text-faint border border-line rounded px-1.5 py-0.5 select-none">
        P{chunk.page}
      </span>
      {chunk.text}
    </p>
  )
}
