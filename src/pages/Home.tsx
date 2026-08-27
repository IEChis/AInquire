import { getAllBooks } from '../data/books'
import BookCard from '../components/book/BookCard'

const VALUES = [
  { problem: '找不到', desc: '不想翻完整本书', solve: 'AI 帮你快速定位相关内容' },
  { problem: '看不懂', desc: '遇到复杂概念或作者观点', solve: '直接向书提问，获得解释' },
  { problem: '不敢信', desc: '怕 AI 凭空生成', solve: '每个结论都展示 Citation 来源' },
  { problem: '读不下去', desc: '得到答案后流程断掉', solve: '查看原文 · 追问 · 保存笔记' },
]

export default function Home() {
  const books = getAllBooks()

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-shell px-6">
        {/* Hero */}
        <section className="py-20 sm:py-28 max-w-3xl">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-accent bg-accent-soft px-3 py-1 rounded-full">
            AI-native Reading Assistant
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight mt-6">
            向一本书提问，
            <br />
            而不是向 AI 提问。
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            选一本书，直接问它。AI 的回答<strong className="text-ink">基于书中内容</strong>生成，
            并追溯到<strong className="text-ink">章节、页码与原文片段</strong>——让你读懂、敢信、能验证、读得下去。
          </p>
          <p className="mt-4 text-sm text-faint">体验路径：Ask → Understand → Verify → Continue Reading</p>
        </section>

        {/* 四大价值 */}
        <section className="pb-16">
          <h2 className="font-display text-2xl font-semibold mb-6">我们解决的四个问题</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v) => (
              <div key={v.problem} className="bg-surface border border-line rounded-card p-5 shadow-card">
                <div className="text-faint text-sm line-through">{v.problem}？</div>
                <div className="font-display text-lg font-semibold mt-1">{v.desc}</div>
                <p className="text-sm text-muted mt-3 leading-relaxed">{v.solve}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 书架 */}
        <section className="pb-24">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold">书架</h2>
            <span className="text-sm text-faint">{books.length} 本示例书</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
