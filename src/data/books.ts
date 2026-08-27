import type { Book } from '../types'

/**
 * 5 本示例书的元数据、章节与建议问题。
 * 原文片段集中在 chunks.ts，结构化答案集中在 answers.ts。
 * 书籍为公开畅销书，此处内容均为原创化的要点复述（用于 Demo，非原文转载）。
 */
export const BOOKS: Book[] = [
  {
    id: 'thinking-fast-slow',
    title: '思考，快与慢',
    author: '丹尼尔·卡尼曼',
    cover: { bg: '#2C2B54', fg: '#F4F2FB' },
    description: '揭示人类两套思考系统如何塑造我们的判断与决策。',
    intro:
      '我们的大脑同时运行着两套系统：直觉而快速的系统1，与缓慢而刻意的系统2。理解它们的分工与漏洞，是更有判断力地思考的第一步。',
    chapterCount: 5,
    suggestedQuestions: [
      { q: '什么是系统1和系统2？', hint: '两系统的分工' },
      { q: '锚定效应是怎么回事？', hint: '第一条启发式偏差' },
      { q: '为什么人会过度自信？', hint: '最稳固的判断偏差' },
      { q: '前景理论讲了什么？', hint: '损失与收益的不对称' },
      { q: '体验自我和记忆自我有什么不同？', hint: '两个自我的冲突' },
    ],
    chapters: [
      { id: 'ch-ts-1', number: 1, title: '两个系统', startPage: 12, endPage: 40 },
      { id: 'ch-ts-2', number: 2, title: '启发式与偏见', startPage: 41, endPage: 78 },
      { id: 'ch-ts-3', number: 3, title: '过度自信', startPage: 79, endPage: 110 },
      { id: 'ch-ts-4', number: 4, title: '前景理论', startPage: 111, endPage: 150 },
      { id: 'ch-ts-5', number: 5, title: '两个自我', startPage: 151, endPage: 180 },
    ],
  },
  {
    id: 'influence',
    title: '影响力',
    author: '罗伯特·西奥迪尼',
    cover: { bg: '#9A3B2E', fg: '#FBF1EC' },
    description: '拆解说服背后的六大心理学原理。',
    intro:
      '为什么我们常在不经意间答应请求？作者用大量实验揭示了互惠、承诺、社会认同、喜好、权威与稀缺六大原理，如何被系统地用来引导顺从。',
    chapterCount: 5,
    suggestedQuestions: [
      { q: '互惠原理是什么？', hint: '先施惠再提要求' },
      { q: '社会认同如何影响我们的决定？', hint: '模仿多数人的做法' },
      { q: '权威为什么能让人服从？', hint: '制服与头衔的魔力' },
      { q: '稀缺原理是怎样起作用的？', hint: '越难得到越想要' },
      { q: '承诺和一致有什么说服力？', hint: '公开承诺的约束力' },
    ],
    chapters: [
      { id: 'ch-inf-1', number: 1, title: '互惠', startPage: 10, endPage: 38 },
      { id: 'ch-inf-2', number: 2, title: '承诺与一致', startPage: 39, endPage: 70 },
      { id: 'ch-inf-3', number: 3, title: '社会认同', startPage: 71, endPage: 102 },
      { id: 'ch-inf-4', number: 4, title: '喜好与权威', startPage: 103, endPage: 134 },
      { id: 'ch-inf-5', number: 5, title: '稀缺', startPage: 135, endPage: 166 },
    ],
  },
  {
    id: 'principles',
    title: '原则',
    author: '瑞·达利欧',
    cover: { bg: '#1F6B5C', fg: '#EFFAF6' },
    description: '一套可复制的生活与工作决策系统。',
    intro:
      '作者把自己在桥水基金验证过的处事方法提炼为"原则"：拥抱现实、五步流程、极度求真与透明、可信度加权决策，并把它们系统化地用于组织。',
    chapterCount: 5,
    suggestedQuestions: [
      { q: '什么是五步流程？', hint: '目标到执行的闭环' },
      { q: '极度求真与透明有什么用？', hint: '减少内耗的文化' },
      { q: '可信度加权决策是什么意思？', hint: '让最可信的人权重更大' },
      { q: '如何拥抱现实？', hint: '痛苦加反思等于进步' },
      { q: '工作原则的核心是什么？', hint: '创意择优取代层级' },
    ],
    chapters: [
      { id: 'ch-pr-1', number: 1, title: '拥抱现实', startPage: 3, endPage: 30 },
      { id: 'ch-pr-2', number: 2, title: '五步流程', startPage: 31, endPage: 66 },
      { id: 'ch-pr-3', number: 3, title: '极度求真与透明', startPage: 67, endPage: 100 },
      { id: 'ch-pr-4', number: 4, title: '可信度加权决策', startPage: 101, endPage: 134 },
      { id: 'ch-pr-5', number: 5, title: '工作原则', startPage: 135, endPage: 180 },
    ],
  },
  {
    id: 'sapiens',
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    cover: { bg: '#A6791F', fg: '#FBF6E7' },
    description: '从认知革命到智人未来的宏大叙事。',
    intro:
      '智人何以统治地球？作者以三条线索串起历史：认知革命让我们讲述虚构故事，农业革命重塑了生存方式，科学革命则把人类推向改写自身命运的边缘。',
    chapterCount: 5,
    suggestedQuestions: [
      { q: '认知革命是什么？', hint: '虚构故事的能力' },
      { q: '农业革命是进步吗？', hint: '更辛苦的生存牢笼' },
      { q: '科学革命为什么会发生？', hint: '承认无知换取新知' },
      { q: '金钱为什么能连接陌生人？', hint: '最通用的信任系统' },
      { q: '智人的未来会怎样？', hint: '生物工程与数据主义' },
    ],
    chapters: [
      { id: 'ch-sp-1', number: 1, title: '认知革命', startPage: 1, endPage: 44 },
      { id: 'ch-sp-2', number: 2, title: '农业革命', startPage: 45, endPage: 110 },
      { id: 'ch-sp-3', number: 3, title: '人类的融合统一', startPage: 111, endPage: 200 },
      { id: 'ch-sp-4', number: 4, title: '科学革命', startPage: 201, endPage: 300 },
      { id: 'ch-sp-5', number: 5, title: '智人的末日', startPage: 301, endPage: 400 },
    ],
  },
  {
    id: 'naval-almanack',
    title: '纳瓦尔宝典',
    author: '埃里克·乔根森',
    cover: { bg: '#34495E', fg: '#ECF2F8' },
    description: '关于财富、判断力与幸福的现代智慧集。',
    intro:
      '财富不等于工资，幸福是一种可训练的技能。作者在杠杆、判断力与自我成长上的犀利洞察，为个人在这个时代如何立足提供了清晰的坐标。',
    chapterCount: 5,
    suggestedQuestions: [
      { q: '财富和金钱有什么区别？', hint: '睡觉时也能赚钱' },
      { q: '纳瓦尔说的杠杆是什么？', hint: '代码与媒体的复利' },
      { q: '为什么判断力比努力重要？', hint: '知道该做什么更稀缺' },
      { q: '幸福可以训练吗？', hint: '一种可习得的技能' },
      { q: '怎样做自我成长？', hint: '找到自己并诚实面对' },
    ],
    chapters: [
      { id: 'ch-nv-1', number: 1, title: '财富与金钱', startPage: 3, endPage: 40 },
      { id: 'ch-nv-2', number: 2, title: '杠杆', startPage: 41, endPage: 86 },
      { id: 'ch-nv-3', number: 3, title: '判断力', startPage: 87, endPage: 130 },
      { id: 'ch-nv-4', number: 4, title: '幸福', startPage: 131, endPage: 180 },
      { id: 'ch-nv-5', number: 5, title: '自我成长', startPage: 181, endPage: 240 },
    ],
  },
]

export function getBook(bookId: string): Book | undefined {
  return BOOKS.find((b) => b.id === bookId)
}

export function getAllBooks(): Book[] {
  return BOOKS
}
