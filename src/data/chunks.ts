import type { BookChunk } from '../types'

/**
 * 全部 5 本书的原文片段（Mock 切片）。
 * 每本 5 章 × 5 片段。keywords 用于 mockRAG 的关键词检索打分。
 * 内容均为原创化要点复述，用于演示检索与引用，非书籍原文转载。
 */
export const CHUNKS: BookChunk[] = [
  // ===================== 思考，快与慢 =====================
  // 第1章 两个系统
  { id: 'ts1-1', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-1', chapterNumber: 1, chapterTitle: '两个系统', page: 15, text: '系统1是自动、快速、不费力的思考，它凭直觉运转，几乎不需要意志努力。', keywords: ['系统1', '直觉', '自动', '快速'] },
  { id: 'ts1-2', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-1', chapterNumber: 1, chapterTitle: '两个系统', page: 19, text: '系统2是缓慢、刻意、需要努力的思考，负责复杂的计算与自我控制。', keywords: ['系统2', '努力', '控制', '复杂'] },
  { id: 'ts1-3', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-1', chapterNumber: 1, chapterTitle: '两个系统', page: 24, text: '系统1总是先启动，系统2常常默认信任系统1的判断，只在必要时介入。', keywords: ['系统1', '系统2', '信任', '介入'] },
  { id: 'ts1-4', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-1', chapterNumber: 1, chapterTitle: '两个系统', page: 31, text: '当我们放松或疲惫时，系统2的监控会松懈，错误便更容易溜进来。', keywords: ['疲惫', '监控', '松懈', '错误'] },
  { id: 'ts1-5', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-1', chapterNumber: 1, chapterTitle: '两个系统', page: 37, text: '认知错觉源于系统1的联想机制过于自信，把熟悉误认为真实。', keywords: ['认知错觉', '联想', '熟悉', '自信'] },
  // 第2章 启发式与偏见
  { id: 'ts2-1', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-2', chapterNumber: 2, chapterTitle: '启发式与偏见', page: 44, text: '代表性启发式让我们根据相似度判断概率，却忽略基础概率。', keywords: ['代表性', '启发式', '概率', '基础概率'] },
  { id: 'ts2-2', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-2', chapterNumber: 2, chapterTitle: '启发式与偏见', page: 51, text: '可得性启发式让我们高估容易想起的事件，新闻越醒目越觉常见。', keywords: ['可得性', '启发式', '高估', '频率'] },
  { id: 'ts2-3', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-2', chapterNumber: 2, chapterTitle: '启发式与偏见', page: 58, text: '锚定效应指人们在估计时过度依赖最先接触到的数字。', keywords: ['锚定', '效应', '估计', '数字'] },
  { id: 'ts2-4', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-2', chapterNumber: 2, chapterTitle: '启发式与偏见', page: 65, text: '确认偏误使我们更关注支持既有观点的证据，忽略反例。', keywords: ['确认偏误', '证据', '观点', '忽略'] },
  { id: 'ts2-5', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-2', chapterNumber: 2, chapterTitle: '启发式与偏见', page: 72, text: '框架效应表明，同一信息的不同表述会改变人们的决策。', keywords: ['框架效应', '表述', '决策', '信息'] },
  // 第3章 过度自信
  { id: 'ts3-1', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-3', chapterNumber: 3, chapterTitle: '过度自信', page: 82, text: '过度自信是人类判断中最稳固的偏差，专家尤其容易高估自己。', keywords: ['过度自信', '专家', '偏差', '高估'] },
  { id: 'ts3-2', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-3', chapterNumber: 3, chapterTitle: '过度自信', page: 89, text: '人们往往对自己的知识边界缺乏准确认知，误把知道名字当作理解。', keywords: ['知识边界', '理解', '认知', '错觉'] },
  { id: 'ts3-3', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-3', chapterNumber: 3, chapterTitle: '过度自信', page: 96, text: '规划谬误让我们对项目的耗时与成本过于乐观，低估风险。', keywords: ['规划谬误', '乐观', '风险', '项目'] },
  { id: 'ts3-4', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-3', chapterNumber: 3, chapterTitle: '过度自信', page: 103, text: '事后诸葛亮效应让我们在结果发生后，误以为当初能够预见。', keywords: ['后见之明', '预见', '结果', '偏差'] },
  { id: 'ts3-5', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-3', chapterNumber: 3, chapterTitle: '过度自信', page: 108, text: '减少过度自信的方法之一，是主动寻找能推翻自己判断的证据。', keywords: ['反证', '证据', '方法', '校准'] },
  // 第4章 前景理论
  { id: 'ts4-1', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-4', chapterNumber: 4, chapterTitle: '前景理论', page: 116, text: '前景理论指出，人们对损失的敏感程度远高于同等数量的收益。', keywords: ['前景理论', '损失', '收益', '敏感'] },
  { id: 'ts4-2', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-4', chapterNumber: 4, chapterTitle: '前景理论', page: 123, text: '损失厌恶让人更倾向于规避损失，哪怕要承担更大的不确定性。', keywords: ['损失厌恶', '规避', '不确定性', '风险'] },
  { id: 'ts4-3', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-4', chapterNumber: 4, chapterTitle: '前景理论', page: 130, text: '价值函数呈S形，在损失区陡峭、在收益区平缓，反映风险态度不对称。', keywords: ['价值函数', 'S形', '风险', '不对称'] },
  { id: 'ts4-4', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-4', chapterNumber: 4, chapterTitle: '前景理论', page: 139, text: '参照点决定了同一结果被感知为收益还是损失，框架由此影响选择。', keywords: ['参照点', '框架', '选择', '感知'] },
  { id: 'ts4-5', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-4', chapterNumber: 4, chapterTitle: '前景理论', page: 147, text: '人们对小概率事件既可能过度加权，也可能忽视，取决于表述方式。', keywords: ['小概率', '加权', '忽视', '表述'] },
  // 第5章 两个自我
  { id: 'ts5-1', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-5', chapterNumber: 5, chapterTitle: '两个自我', page: 156, text: '体验自我记录着当下的感受，记忆自我负责讲述生活的故事。', keywords: ['体验自我', '记忆自我', '感受', '故事'] },
  { id: 'ts5-2', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-5', chapterNumber: 5, chapterTitle: '两个自我', page: 162, text: '峰终定律指人们对一段体验的评价，主要由高峰与结尾决定。', keywords: ['峰终定律', '高峰', '结尾', '评价'] },
  { id: 'ts5-3', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-5', chapterNumber: 5, chapterTitle: '两个自我', page: 168, text: '记忆自我常常忽略时长，使漫长而平淡的过程被轻易遗忘。', keywords: ['记忆', '时长', '忽略', '体验'] },
  { id: 'ts5-4', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-5', chapterNumber: 5, chapterTitle: '两个自我', page: 173, text: '两个自我的冲突，解释了为何我们常做出与长期幸福相悖的选择。', keywords: ['冲突', '幸福', '选择', '自我'] },
  { id: 'ts5-5', bookId: 'thinking-fast-slow', chapterId: 'ch-ts-5', chapterNumber: 5, chapterTitle: '两个自我', page: 179, text: '认识两个系统的局限，是更有判断力地思考与决策的第一步。', keywords: ['局限', '判断力', '决策', '系统'] },

  // ===================== 影响力 =====================
  // 第1章 互惠
  { id: 'inf1-1', bookId: 'influence', chapterId: 'ch-inf-1', chapterNumber: 1, chapterTitle: '互惠', page: 13, text: '互惠原理指当别人给予我们好处时，我们感到有义务回报。', keywords: ['互惠', '回报', '义务', '好处'] },
  { id: 'inf1-2', bookId: 'influence', chapterId: 'ch-inf-1', chapterNumber: 1, chapterTitle: '互惠', page: 19, text: '先施以小惠再提要求，对方答应请求的概率会显著提高。', keywords: ['小惠', '请求', '概率', '互惠'] },
  { id: 'inf1-3', bookId: 'influence', chapterId: 'ch-inf-1', chapterNumber: 1, chapterTitle: '互惠', page: 26, text: '不对等的让步也会触发互惠，对方退一步我们便想退一步。', keywords: ['让步', '互惠', '触发', '协商'] },
  { id: 'inf1-4', bookId: 'influence', chapterId: 'ch-inf-1', chapterNumber: 1, chapterTitle: '互惠', page: 31, text: '免费试用正是利用互惠，让人在接受后再难以拒绝购买。', keywords: ['免费试用', '互惠', '购买', '拒绝'] },
  { id: 'inf1-5', bookId: 'influence', chapterId: 'ch-inf-1', chapterNumber: 1, chapterTitle: '互惠', page: 35, text: '识别互惠陷阱，关键在于区分善意馈赠与有目的的施惠。', keywords: ['陷阱', '区分', '馈赠', '目的'] },
  // 第2章 承诺与一致
  { id: 'inf2-1', bookId: 'influence', chapterId: 'ch-inf-2', chapterNumber: 2, chapterTitle: '承诺与一致', page: 42, text: '一旦我们公开做出承诺，就会倾向于保持与之一致的行为。', keywords: ['承诺', '一致', '公开', '行为'] },
  { id: 'inf2-2', bookId: 'influence', chapterId: 'ch-inf-2', chapterNumber: 2, chapterTitle: '承诺与一致', page: 49, text: '书面承诺比口头更有约束力，因为它可被自己反复看到。', keywords: ['书面', '承诺', '约束', '一致'] },
  { id: 'inf2-3', bookId: 'influence', chapterId: 'ch-inf-2', chapterNumber: 2, chapterTitle: '承诺与一致', page: 56, text: '即使最初的理由消失，人们仍会为维护一致性而继续行动。', keywords: ['理由', '一致', '行动', '动机'] },
  { id: 'inf2-4', bookId: 'influence', chapterId: 'ch-inf-2', chapterNumber: 2, chapterTitle: '承诺与一致', page: 63, text: '循序渐进的小请求，能逐步把人锁定在更大的承诺里。', keywords: ['小请求', '锁定', '承诺', '策略'] },
  { id: 'inf2-5', bookId: 'influence', chapterId: 'ch-inf-2', chapterNumber: 2, chapterTitle: '承诺与一致', page: 68, text: '保持一致本是高效的社会机制，却被用来引导非理性顺从。', keywords: ['一致', '社会', '顺从', '机制'] },
  // 第3章 社会认同
  { id: 'inf3-1', bookId: 'influence', chapterId: 'ch-inf-3', chapterNumber: 3, chapterTitle: '社会认同', page: 74, text: '社会认同指我们在不确定时，倾向于模仿多数人的做法。', keywords: ['社会认同', '模仿', '多数', '不确定'] },
  { id: 'inf3-2', bookId: 'influence', chapterId: 'ch-inf-3', chapterNumber: 3, chapterTitle: '社会认同', page: 81, text: '罐头笑声让观众更易发笑，因为他人的反应成为行为线索。', keywords: ['罐头笑声', '反应', '线索', '认同'] },
  { id: 'inf3-3', bookId: 'influence', chapterId: 'ch-inf-3', chapterNumber: 3, chapterTitle: '社会认同', page: 88, text: '不确定性越高，我们越依赖相似群体来判断正确做法。', keywords: ['不确定', '相似', '群体', '判断'] },
  { id: 'inf3-4', bookId: 'influence', chapterId: 'ch-inf-3', chapterNumber: 3, chapterTitle: '社会认同', page: 95, text: '多元无知让人人在场却无人出手，误以为别人都不担心。', keywords: ['多元无知', '旁观', '误解', '群体'] },
  { id: 'inf3-5', bookId: 'influence', chapterId: 'ch-inf-3', chapterNumber: 3, chapterTitle: '社会认同', page: 100, text: '营造热度与从众氛围，是营销中调动社会认同的常见手法。', keywords: ['热度', '从众', '营销', '认同'] },
  // 第4章 喜好与权威
  { id: 'inf4-1', bookId: 'influence', chapterId: 'ch-inf-4', chapterNumber: 4, chapterTitle: '喜好与权威', page: 106, text: '我们更容易答应自己喜爱之人的请求，喜好由此被利用。', keywords: ['喜好', '请求', '利用', '关系'] },
  { id: 'inf4-2', bookId: 'influence', chapterId: 'ch-inf-4', chapterNumber: 4, chapterTitle: '喜好与权威', page: 113, text: '外表吸引力带来光环效应，让人把好看等同于有能力。', keywords: ['吸引力', '光环', '能力', '偏见'] },
  { id: 'inf4-3', bookId: 'influence', chapterId: 'ch-inf-4', chapterNumber: 4, chapterTitle: '喜好与权威', page: 120, text: '相似性与恭维会迅速拉近距离，成为说服的隐形筹码。', keywords: ['相似性', '恭维', '说服', '距离'] },
  { id: 'inf4-4', bookId: 'influence', chapterId: 'ch-inf-4', chapterNumber: 4, chapterTitle: '喜好与权威', page: 127, text: '权威符号如制服与头衔，会大幅降低我们的质疑意愿。', keywords: ['权威', '制服', '头衔', '质疑'] },
  { id: 'inf4-5', bookId: 'influence', chapterId: 'ch-inf-4', chapterNumber: 4, chapterTitle: '喜好与权威', page: 133, text: '米尔格拉姆实验显示，普通人在权威命令下会服从伤害行为。', keywords: ['米尔格拉姆', '权威', '服从', '实验'] },
  // 第5章 稀缺
  { id: 'inf5-1', bookId: 'influence', chapterId: 'ch-inf-5', chapterNumber: 5, chapterTitle: '稀缺', page: 138, text: '稀缺原理指某物越难获得，我们对其的渴望就越强烈。', keywords: ['稀缺', '渴望', '获得', '限制'] },
  { id: 'inf5-2', bookId: 'influence', chapterId: 'ch-inf-5', chapterNumber: 5, chapterTitle: '稀缺', page: 145, text: '限量发售与限时优惠，都是在人为制造稀缺的紧迫感。', keywords: ['限量', '限时', '紧迫', '稀缺'] },
  { id: 'inf5-3', bookId: 'influence', chapterId: 'ch-inf-5', chapterNumber: 5, chapterTitle: '稀缺', page: 152, text: '对失去自由的恐惧，会让人反弹式地更想保住选择权。', keywords: ['自由', '恐惧', '反弹', '选择'] },
  { id: 'inf5-4', bookId: 'influence', chapterId: 'ch-inf-5', chapterNumber: 5, chapterTitle: '稀缺', page: 159, text: '当稀缺与竞争叠加，人们的判断会更冲动、更易出错。', keywords: ['竞争', '冲动', '判断', '稀缺'] },
  { id: 'inf5-5', bookId: 'influence', chapterId: 'ch-inf-5', chapterNumber: 5, chapterTitle: '稀缺', page: 165, text: '应对稀缺诱惑，最好的办法是暂停，问自己是否真需要它。', keywords: ['应对', '暂停', '需要', '稀缺'] },

  // ===================== 原则 =====================
  // 第1章 拥抱现实
  { id: 'pr1-1', bookId: 'principles', chapterId: 'ch-pr-1', chapterNumber: 1, chapterTitle: '拥抱现实', page: 6, text: '拥抱现实并应对它，而不是希望它符合你的愿望，是成长的起点。', keywords: ['现实', '应对', '愿望', '成长'] },
  { id: 'pr1-2', bookId: 'principles', chapterId: 'ch-pr-1', chapterNumber: 1, chapterTitle: '拥抱现实', page: 12, text: '痛苦加反思等于进步，直面错误才能从中获得收益。', keywords: ['痛苦', '反思', '进步', '错误'] },
  { id: 'pr1-3', bookId: 'principles', chapterId: 'ch-pr-1', chapterNumber: 1, chapterTitle: '拥抱现实', page: 18, text: '真相是任何良好结果的根本基础，模糊真相只会累积风险。', keywords: ['真相', '结果', '风险', '基础'] },
  { id: 'pr1-4', bookId: 'principles', chapterId: 'ch-pr-1', chapterNumber: 1, chapterTitle: '拥抱现实', page: 23, text: '不要混淆目标与事实，用清醒的眼睛区分想要与真实。', keywords: ['目标', '事实', '区分', '清醒'] },
  { id: 'pr1-5', bookId: 'principles', chapterId: 'ch-pr-1', chapterNumber: 1, chapterTitle: '拥抱现实', page: 28, text: '把生活看作机器，你既是设计者也是操作者，可不断优化。', keywords: ['机器', '设计', '优化', '生活'] },
  // 第2章 五步流程
  { id: 'pr2-1', bookId: 'principles', chapterId: 'ch-pr-2', chapterNumber: 2, chapterTitle: '五步流程', page: 34, text: '五步流程：设目标、找问题、诊断根因、设计方案、执行。', keywords: ['五步', '目标', '诊断', '执行'] },
  { id: 'pr2-2', bookId: 'principles', chapterId: 'ch-pr-2', chapterNumber: 2, chapterTitle: '五步流程', page: 41, text: '多数人卡在某一两步，有人善设定却懒于执行，反之亦然。', keywords: ['卡顿', '执行', '设定', '平衡'] },
  { id: 'pr2-3', bookId: 'principles', chapterId: 'ch-pr-2', chapterNumber: 2, chapterTitle: '五步流程', page: 48, text: '诊断要区分症状与根源，治标不治本会反复跌倒。', keywords: ['诊断', '根源', '症状', '反复'] },
  { id: 'pr2-4', bookId: 'principles', chapterId: 'ch-pr-2', chapterNumber: 2, chapterTitle: '五步流程', page: 55, text: '把大问题拆成可解决的小问题，逐一设计具体方案。', keywords: ['拆解', '方案', '问题', '具体'] },
  { id: 'pr2-5', bookId: 'principles', chapterId: 'ch-pr-2', chapterNumber: 2, chapterTitle: '五步流程', page: 62, text: '执行力来自纪律与习惯，而非一时的意志力爆发。', keywords: ['执行', '纪律', '习惯', '意志'] },
  // 第3章 极度求真与透明
  { id: 'pr3-1', bookId: 'principles', chapterId: 'ch-pr-3', chapterNumber: 3, chapterTitle: '极度求真与透明', page: 70, text: '极度求真意味着说真话并鼓励他人也如此，哪怕令人不适。', keywords: ['求真', '真话', '鼓励', '不适'] },
  { id: 'pr3-2', bookId: 'principles', chapterId: 'ch-pr-3', chapterNumber: 3, chapterTitle: '极度求真与透明', page: 77, text: '极度透明让信息自由流动，减少政治与误解的内耗。', keywords: ['透明', '信息', '政治', '误解'] },
  { id: 'pr3-3', bookId: 'principles', chapterId: 'ch-pr-3', chapterNumber: 3, chapterTitle: '极度求真与透明', page: 84, text: '有意义的关系与高效协作，建立在坦诚而非客套之上。', keywords: ['关系', '协作', '坦诚', '高效'] },
  { id: 'pr3-4', bookId: 'principles', chapterId: 'ch-pr-3', chapterNumber: 3, chapterTitle: '极度求真与透明', page: 91, text: '当众承认错误不是弱点，而是加速学习的可信信号。', keywords: ['承认', '错误', '学习', '可信'] },
  { id: 'pr3-5', bookId: 'principles', chapterId: 'ch-pr-3', chapterNumber: 3, chapterTitle: '极度求真与透明', page: 98, text: '文化需要机制保障，否则求真透明只会停留在口号。', keywords: ['文化', '机制', '保障', '口号'] },
  // 第4章 可信度加权决策
  { id: 'pr4-1', bookId: 'principles', chapterId: 'ch-pr-4', chapterNumber: 4, chapterTitle: '可信度加权决策', page: 104, text: '可信度加权决策，是让最可信的人的观点获得更大权重。', keywords: ['可信度', '权重', '决策', '观点'] },
  { id: 'pr4-2', bookId: 'principles', chapterId: 'ch-pr-4', chapterNumber: 4, chapterTitle: '可信度加权决策', page: 111, text: '可信度来自多次成功的记录与可验证的逻辑，而非职位。', keywords: ['可信', '记录', '逻辑', '职位'] },
  { id: 'pr4-3', bookId: 'principles', chapterId: 'ch-pr-4', chapterNumber: 4, chapterTitle: '可信度加权决策', page: 118, text: '与意见相反的人深度探讨，往往比独断更接近真相。', keywords: ['探讨', '相反', '真相', '分歧'] },
  { id: 'pr4-4', bookId: 'principles', chapterId: 'ch-pr-4', chapterNumber: 4, chapterTitle: '可信度加权决策', page: 125, text: '用算法辅助而非替代判断，把经验沉淀为可复用的规则。', keywords: ['算法', '规则', '经验', '判断'] },
  { id: 'pr4-5', bookId: 'principles', chapterId: 'ch-pr-4', chapterNumber: 4, chapterTitle: '可信度加权决策', page: 131, text: '决策要可追溯，清楚记录谁因何采信了哪种观点。', keywords: ['决策', '追溯', '记录', '采信'] },
  // 第5章 工作原则
  { id: 'pr5-1', bookId: 'principles', chapterId: 'ch-pr-5', chapterNumber: 5, chapterTitle: '工作原则', page: 138, text: '工作原则是人生原则在组织中的延伸与系统化。', keywords: ['工作', '原则', '组织', '系统'] },
  { id: 'pr5-2', bookId: 'principles', chapterId: 'ch-pr-5', chapterNumber: 5, chapterTitle: '工作原则', page: 145, text: '让合适的人站在合适的角色，比事必躬亲更重要。', keywords: ['角色', '合适', '分工', '人才'] },
  { id: 'pr5-3', bookId: 'principles', chapterId: 'ch-pr-5', chapterNumber: 5, chapterTitle: '工作原则', page: 152, text: '用创意择优取代层级压制，让好想法无论来源都能胜出。', keywords: ['创意择优', '层级', '想法', '来源'] },
  { id: 'pr5-4', bookId: 'principles', chapterId: 'ch-pr-5', chapterNumber: 5, chapterTitle: '工作原则', page: 159, text: '建立问题日志，把每次失误变成制度化的改进资产。', keywords: ['问题日志', '失误', '改进', '制度'] },
  { id: 'pr5-5', bookId: 'principles', chapterId: 'ch-pr-5', chapterNumber: 5, chapterTitle: '工作原则', page: 174, text: '持续进化是目标本身，组织与个人都应在反思中迭代。', keywords: ['进化', '迭代', '反思', '目标'] },

  // ===================== 人类简史 =====================
  // 第1章 认知革命
  { id: 'sp1-1', bookId: 'sapiens', chapterId: 'ch-sp-1', chapterNumber: 1, chapterTitle: '认知革命', page: 8, text: '约七万年前，认知革命让智人获得虚构故事的能力。', keywords: ['认知革命', '虚构', '故事', '智人'] },
  { id: 'sp1-2', bookId: 'sapiens', chapterId: 'ch-sp-1', chapterNumber: 1, chapterTitle: '认知革命', page: 16, text: '语言能描述不存在的事物，使大规模灵活协作成为可能。', keywords: ['语言', '协作', '虚构', '大规模'] },
  { id: 'sp1-3', bookId: 'sapiens', chapterId: 'ch-sp-1', chapterNumber: 1, chapterTitle: '认知革命', page: 24, text: '神话、宗教与金钱都是共享的想象，却能把陌生人连成网络。', keywords: ['神话', '宗教', '金钱', '网络'] },
  { id: 'sp1-4', bookId: 'sapiens', chapterId: 'ch-sp-1', chapterNumber: 1, chapterTitle: '认知革命', page: 32, text: '想象的秩序不靠暴力维持，而靠人与人之间相互相信。', keywords: ['想象', '秩序', '相信', '维持'] },
  { id: 'sp1-5', bookId: 'sapiens', chapterId: 'ch-sp-1', chapterNumber: 1, chapterTitle: '认知革命', page: 40, text: '认知革命是历史起点，让智人走出非洲并重塑生态。', keywords: ['历史', '起点', '生态', '扩张'] },
  // 第2章 农业革命
  { id: 'sp2-1', bookId: 'sapiens', chapterId: 'ch-sp-2', chapterNumber: 2, chapterTitle: '农业革命', page: 52, text: '农业革命看似进步，实则让人类陷入更辛苦的生存牢笼。', keywords: ['农业', '牢笼', '辛苦', '生存'] },
  { id: 'sp2-2', bookId: 'sapiens', chapterId: 'ch-sp-2', chapterNumber: 2, chapterTitle: '农业革命', page: 64, text: '小麦驯化了人类，迫使智人定居、劳作并围绕作物组织生活。', keywords: ['小麦', '驯化', '定居', '作物'] },
  { id: 'sp2-3', bookId: 'sapiens', chapterId: 'ch-sp-2', chapterNumber: 2, chapterTitle: '农业革命', page: 78, text: '人口增长并未提升个体幸福，反而带来更密集的劳碌。', keywords: ['人口', '幸福', '劳碌', '密集'] },
  { id: 'sp2-4', bookId: 'sapiens', chapterId: 'ch-sp-2', chapterNumber: 2, chapterTitle: '农业革命', page: 90, text: '文字最初为记账而生，后来才承载思想与法律。', keywords: ['文字', '记账', '法律', '思想'] },
  { id: 'sp2-5', bookId: 'sapiens', chapterId: 'ch-sp-2', chapterNumber: 2, chapterTitle: '农业革命', page: 104, text: '帝国与货币把原本隔绝的族群，编织进同一套秩序。', keywords: ['帝国', '货币', '族群', '秩序'] },
  // 第3章 人类的融合统一
  { id: 'sp3-1', bookId: 'sapiens', chapterId: 'ch-sp-3', chapterNumber: 3, chapterTitle: '人类的融合统一', page: 118, text: '金钱是人类最通用的信任系统，能跨越宗教与国界。', keywords: ['金钱', '信任', '宗教', '国界'] },
  { id: 'sp3-2', bookId: 'sapiens', chapterId: 'ch-sp-3', chapterNumber: 3, chapterTitle: '人类的融合统一', page: 134, text: '帝国通过同化与法律，把多元文化熔铸为共同认同。', keywords: ['帝国', '同化', '法律', '认同'] },
  { id: 'sp3-3', bookId: 'sapiens', chapterId: 'ch-sp-3', chapterNumber: 3, chapterTitle: '人类的融合统一', page: 152, text: '全球性宗教提供了普世叙事，把不同人群纳入同一意义。', keywords: ['宗教', '叙事', '意义', '普世'] },
  { id: 'sp3-4', bookId: 'sapiens', chapterId: 'ch-sp-3', chapterNumber: 3, chapterTitle: '人类的融合统一', page: 176, text: '商人、征服者与先知，是三股推动人类融合的力量。', keywords: ['商人', '征服', '先知', '融合'] },
  { id: 'sp3-5', bookId: 'sapiens', chapterId: 'ch-sp-3', chapterNumber: 3, chapterTitle: '人类的融合统一', page: 196, text: '融合不等于同质，而是在共享框架下的参差共存。', keywords: ['融合', '同质', '框架', '共存'] },
  // 第4章 科学革命
  { id: 'sp4-1', bookId: 'sapiens', chapterId: 'ch-sp-4', chapterNumber: 4, chapterTitle: '科学革命', page: 210, text: '科学革命源于承认无知，并以观察与数学换取新知。', keywords: ['科学', '无知', '观察', '数学'] },
  { id: 'sp4-2', bookId: 'sapiens', chapterId: 'ch-sp-4', chapterNumber: 4, chapterTitle: '科学革命', page: 228, text: '帝国、科学与资本主义三者互相喂养，驱动现代扩张。', keywords: ['帝国', '科学', '资本', '扩张'] },
  { id: 'sp4-3', bookId: 'sapiens', chapterId: 'ch-sp-4', chapterNumber: 4, chapterTitle: '科学革命', page: 246, text: '资本主义把信任投向未来，用信贷撬动远超过去的财富。', keywords: ['资本', '信贷', '未来', '财富'] },
  { id: 'sp4-4', bookId: 'sapiens', chapterId: 'ch-sp-4', chapterNumber: 4, chapterTitle: '科学革命', page: 268, text: '工业革命把能量转化为动力，彻底改写了人类的生产方式。', keywords: ['工业', '能量', '动力', '生产'] },
  { id: 'sp4-5', bookId: 'sapiens', chapterId: 'ch-sp-4', chapterNumber: 4, chapterTitle: '科学革命', page: 292, text: '现代医学与农业，使人口空前增长却也加剧生态负担。', keywords: ['医学', '农业', '人口', '生态'] },
  // 第5章 智人的末日
  { id: 'sp5-1', bookId: 'sapiens', chapterId: 'ch-sp-5', chapterNumber: 5, chapterTitle: '智人的末日', page: 308, text: '生物工程可能重写生命密码，模糊自然与人工的界限。', keywords: ['生物工程', '生命', '自然', '人工'] },
  { id: 'sp5-2', bookId: 'sapiens', chapterId: 'ch-sp-5', chapterNumber: 5, chapterTitle: '智人的末日', page: 324, text: '算法与网络正接管决策，人类或被自己的造物取代。', keywords: ['算法', '决策', '取代', '网络'] },
  { id: 'sp5-3', bookId: 'sapiens', chapterId: 'ch-sp-5', chapterNumber: 5, chapterTitle: '智人的末日', page: 344, text: '数据主义认为宇宙由数据流构成，价值在于信息流通。', keywords: ['数据主义', '数据', '信息', '价值'] },
  { id: 'sp5-4', bookId: 'sapiens', chapterId: 'ch-sp-5', chapterNumber: 5, chapterTitle: '智人的末日', page: 366, text: '智人的未来可能分化为生物种姓，或被超级智能边缘化。', keywords: ['智人', '分化', '智能', '边缘'] },
  { id: 'sp5-5', bookId: 'sapiens', chapterId: 'ch-sp-5', chapterNumber: 5, chapterTitle: '智人的末日', page: 392, text: '历史没有剧本，我们仍可在认知的岔路口选择去向。', keywords: ['历史', '选择', '岔路', '未来'] },

  // ===================== 纳瓦尔宝典 =====================
  // 第1章 财富与金钱
  { id: 'nv1-1', bookId: 'naval-almanack', chapterId: 'ch-nv-1', chapterNumber: 1, chapterTitle: '财富与金钱', page: 8, text: '财富是睡觉时也能为你赚钱的资产，金钱只是它的交换媒介。', keywords: ['财富', '资产', '金钱', '被动'] },
  { id: 'nv1-2', bookId: 'naval-almanack', chapterId: 'ch-nv-1', chapterNumber: 1, chapterTitle: '财富与金钱', page: 16, text: '追求财富而非单纯高薪，因为工资买不断你的时间。', keywords: ['财富', '工资', '时间', '自由'] },
  { id: 'nv1-3', bookId: 'naval-almanack', chapterId: 'ch-nv-1', chapterNumber: 1, chapterTitle: '财富与金钱', page: 24, text: '找到能满足社会需求且你擅长的专长，是致富的起点。', keywords: ['专长', '需求', '擅长', '致富'] },
  { id: 'nv1-4', bookId: 'naval-almanack', chapterId: 'ch-nv-1', chapterNumber: 1, chapterTitle: '财富与金钱', page: 32, text: '责任与所有权结合，让你分享成果而非只领薪水。', keywords: ['责任', '所有权', '分享', '成果'] },
  { id: 'nv1-5', bookId: 'naval-almanack', chapterId: 'ch-nv-1', chapterNumber: 1, chapterTitle: '财富与金钱', page: 38, text: '赚钱不需许可，但需要长期坚持与复利式的积累。', keywords: ['赚钱', '许可', '坚持', '复利'] },
  // 第2章 杠杆
  { id: 'nv2-1', bookId: 'naval-almanack', chapterId: 'ch-nv-2', chapterNumber: 2, chapterTitle: '杠杆', page: 46, text: '杠杆有三种：劳力、资本，以及边际成本为零的代码与媒体。', keywords: ['杠杆', '劳力', '资本', '代码'] },
  { id: 'nv2-2', bookId: 'naval-almanack', chapterId: 'ch-nv-2', chapterNumber: 2, chapterTitle: '杠杆', page: 56, text: '代码与媒体是现代最好的杠杆，一次创造可被无限复制。', keywords: ['代码', '媒体', '杠杆', '复制'] },
  { id: 'nv2-3', bookId: 'naval-almanack', chapterId: 'ch-nv-2', chapterNumber: 2, chapterTitle: '杠杆', page: 66, text: '学会用杠杆放大专长，而非用时间线性地出售自己。', keywords: ['杠杆', '专长', '时间', '线性'] },
  { id: 'nv2-4', bookId: 'naval-almanack', chapterId: 'ch-nv-2', chapterNumber: 2, chapterTitle: '杠杆', page: 74, text: '财富来自拥有企业股权或知识产权，而非计时工资。', keywords: ['股权', '知识产权', '财富', '工资'] },
  { id: 'nv2-5', bookId: 'naval-almanack', chapterId: 'ch-nv-2', chapterNumber: 2, chapterTitle: '杠杆', page: 84, text: '最有力的杠杆往往免费，关键在于你是否愿意长期投入。', keywords: ['杠杆', '免费', '长期', '投入'] },
  // 第3章 判断力
  { id: 'nv3-1', bookId: 'naval-almanack', chapterId: 'ch-nv-3', chapterNumber: 3, chapterTitle: '判断力', page: 92, text: '判断力是知道该做什么的能力，比单纯努力更稀缺。', keywords: ['判断力', '努力', '稀缺', '能力'] },
  { id: 'nv3-2', bookId: 'naval-almanack', chapterId: 'ch-nv-3', chapterNumber: 3, chapterTitle: '判断力', page: 100, text: '在重大决策上少做但做对，远胜在许多小事上忙个不停。', keywords: ['决策', '少做', '做对', '忙碌'] },
  { id: 'nv3-3', bookId: 'naval-almanack', chapterId: 'ch-nv-3', chapterNumber: 3, chapterTitle: '判断力', page: 110, text: '基础知识比热门技巧更有复利，数学与逻辑是底层杠杆。', keywords: ['基础', '复利', '数学', '逻辑'] },
  { id: 'nv3-4', bookId: 'naval-almanack', chapterId: 'ch-nv-3', chapterNumber: 3, chapterTitle: '判断力', page: 120, text: '远离短期诱惑，把注意力放在长期价值的积累上。', keywords: ['短期', '诱惑', '注意力', '长期'] },
  { id: 'nv3-5', bookId: 'naval-almanack', chapterId: 'ch-nv-3', chapterNumber: 3, chapterTitle: '判断力', page: 128, text: '清晰的思考来自独处与阅读，而非喧嚣的社交反馈。', keywords: ['思考', '独处', '阅读', '社交'] },
  // 第4章 幸福
  { id: 'nv4-1', bookId: 'naval-almanack', chapterId: 'ch-nv-4', chapterNumber: 4, chapterTitle: '幸福', page: 136, text: '幸福是一种可训练的技能，而非天生性格或外在条件。', keywords: ['幸福', '技能', '训练', '性格'] },
  { id: 'nv4-2', bookId: 'naval-almanack', chapterId: 'ch-nv-4', chapterNumber: 4, chapterTitle: '幸福', page: 144, text: '欲望是痛苦的根源，降低预期往往比获取更易带来满足。', keywords: ['欲望', '痛苦', '预期', '满足'] },
  { id: 'nv4-3', bookId: 'naval-almanack', chapterId: 'ch-nv-4', chapterNumber: 4, chapterTitle: '幸福', page: 154, text: '活在当下、接纳现实，是摆脱焦虑最朴素也最有效的办法。', keywords: ['当下', '接纳', '焦虑', '现实'] },
  { id: 'nv4-4', bookId: 'naval-almanack', chapterId: 'ch-nv-4', chapterNumber: 4, chapterTitle: '幸福', page: 164, text: '健康、睡眠与平静的心，是幸福最被低估的三大基石。', keywords: ['健康', '睡眠', '平静', '基石'] },
  { id: 'nv4-5', bookId: 'naval-almanack', chapterId: 'ch-nv-4', chapterNumber: 4, chapterTitle: '幸福', page: 176, text: '幸福的反面不是悲伤，而是对现状的挑剔与抗拒。', keywords: ['幸福', '悲伤', '抗拒', '现状'] },
  // 第5章 自我成长
  { id: 'nv5-1', bookId: 'naval-almanack', chapterId: 'ch-nv-5', chapterNumber: 5, chapterTitle: '自我成长', page: 188, text: '自我成长是找到自己、并诚实面对真实欲望的过程。', keywords: ['成长', '自我', '欲望', '诚实'] },
  { id: 'nv5-2', bookId: 'naval-almanack', chapterId: 'ch-nv-5', chapterNumber: 5, chapterTitle: '自我成长', page: 198, text: '阅读经典比追逐资讯更有养分，长期塑造你的思维骨架。', keywords: ['阅读', '经典', '资讯', '思维'] },
  { id: 'nv5-3', bookId: 'naval-almanack', chapterId: 'ch-nv-5', chapterNumber: 5, chapterTitle: '自我成长', page: 208, text: '建立声誉需要时间，但它会在关键时刻为你背书。', keywords: ['声誉', '时间', '背书', '信任'] },
  { id: 'nv5-4', bookId: 'naval-almanack', chapterId: 'ch-nv-5', chapterNumber: 5, chapterTitle: '自我成长', page: 220, text: '与聪明正直者同行，你的标准与机会都会被悄悄抬高。', keywords: ['同行', '正直', '标准', '机会'] },
  { id: 'nv5-5', bookId: 'naval-almanack', chapterId: 'ch-nv-5', chapterNumber: 5, chapterTitle: '自我成长', page: 236, text: '人生是单程试炼，意义由你定义，而非由外界授予。', keywords: ['人生', '意义', '定义', '试炼'] },
]

export function getChunksByBook(bookId: string): BookChunk[] {
  return CHUNKS.filter((c) => c.bookId === bookId)
}
