// 离线评测标注集：每条 = (书, 用户提问, 期望命中的原文片段 chunkId)
// 问题均为自然语言形式，期望 chunk 由片段内容/关键词确定，人工标注、可复核。
// 用于计算「溯源定位率」，替代不可得的真实用户样本。

export interface GoldItem {
  bookId: string
  question: string
  expectedChunkId: string
}

export const GOLD: GoldItem[] = [
  // 思考，快与慢
  { bookId: 'thinking-fast-slow', question: '什么是系统1？', expectedChunkId: 'ts1-1' },
  { bookId: 'thinking-fast-slow', question: '系统2负责什么工作？', expectedChunkId: 'ts1-2' },
  { bookId: 'thinking-fast-slow', question: '什么是锚定效应？', expectedChunkId: 'ts2-3' },
  { bookId: 'thinking-fast-slow', question: '代表性启发式是什么？', expectedChunkId: 'ts2-1' },
  { bookId: 'thinking-fast-slow', question: '框架效应是什么？', expectedChunkId: 'ts2-5' },
  { bookId: 'thinking-fast-slow', question: '人为什么会过度自信？', expectedChunkId: 'ts3-1' },
  { bookId: 'thinking-fast-slow', question: '什么是规划谬误？', expectedChunkId: 'ts3-3' },
  { bookId: 'thinking-fast-slow', question: '前景理论讲了什么？', expectedChunkId: 'ts4-1' },
  { bookId: 'thinking-fast-slow', question: '什么是损失厌恶？', expectedChunkId: 'ts4-2' },
  { bookId: 'thinking-fast-slow', question: '体验自我和记忆自我有什么区别？', expectedChunkId: 'ts5-1' },
  { bookId: 'thinking-fast-slow', question: '峰终定律是什么？', expectedChunkId: 'ts5-2' },
  // 影响力
  { bookId: 'influence', question: '互惠原理是什么？', expectedChunkId: 'inf1-1' },
  { bookId: 'influence', question: '免费试用利用了什么心理原理？', expectedChunkId: 'inf1-4' },
  { bookId: 'influence', question: '公开承诺有什么作用？', expectedChunkId: 'inf2-1' },
  { bookId: 'influence', question: '什么是社会认同？', expectedChunkId: 'inf3-1' },
  { bookId: 'influence', question: '权威符号为什么会降低我们的质疑？', expectedChunkId: 'inf4-4' },
  { bookId: 'influence', question: '稀缺原理是怎样起作用的？', expectedChunkId: 'inf5-1' },
  { bookId: 'influence', question: '限量发售利用了什么原理？', expectedChunkId: 'inf5-2' },
  // 原则
  { bookId: 'principles', question: '什么是五步流程？', expectedChunkId: 'pr2-1' },
  { bookId: 'principles', question: '极度求真与透明有什么用？', expectedChunkId: 'pr3-1' },
  { bookId: 'principles', question: '可信度加权决策是什么意思？', expectedChunkId: 'pr4-1' },
  { bookId: 'principles', question: '痛苦加反思等于什么？', expectedChunkId: 'pr1-2' },
  { bookId: 'principles', question: '什么是创意择优？', expectedChunkId: 'pr5-3' },
  // 人类简史
  { bookId: 'sapiens', question: '认知革命是什么？', expectedChunkId: 'sp1-1' },
  { bookId: 'sapiens', question: '农业革命是进步吗？', expectedChunkId: 'sp2-1' },
  { bookId: 'sapiens', question: '金钱为什么能连接陌生人？', expectedChunkId: 'sp3-1' },
  { bookId: 'sapiens', question: '科学革命为什么会发生？', expectedChunkId: 'sp4-1' },
  { bookId: 'sapiens', question: '什么是数据主义？', expectedChunkId: 'sp5-3' },
  // 纳瓦尔宝典
  { bookId: 'naval-almanack', question: '财富和金钱有什么区别？', expectedChunkId: 'nv1-1' },
  { bookId: 'naval-almanack', question: '纳瓦尔说的杠杆是什么？', expectedChunkId: 'nv2-1' },
  { bookId: 'naval-almanack', question: '为什么判断力比努力更重要？', expectedChunkId: 'nv3-1' },
  { bookId: 'naval-almanack', question: '幸福可以训练吗？', expectedChunkId: 'nv4-1' },
  { bookId: 'naval-almanack', question: '如何进行自我成长？', expectedChunkId: 'nv5-1' },
]
