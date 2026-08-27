# AI问书 · AI Reading Assistant

> 一款面向知识型阅读用户的 AI 阅读助手：基于书籍内容检索并回答用户问题，回答可追溯到章节 / 页码 / 原文片段。
> 既能「问整本书」，也能「选中一段 → 针对选中内容提问」。

GitHub 仓库：[github.com/IEChis/aiReadingAssistant](https://github.com/IEChis/aiReadingAssistant)

---

## ✨ 核心特性

- **全局问书（Global Book QA）**：在输入框提问，基于全书内容检索并给出结构化答案（结论 → 解释 → 核心观点 → 书中依据 → 继续提问），每条结论都锚定可点击的原文出处。
- **上下文阅读问答（Contextual Reading QA）**：在右栏原文中**选中任意段落**，立刻弹出轻量浮动工具栏 `✨AI解释 / ❓为什么 / ↗继续探索`，针对「你选中的内容」发起提问。
  - 答案顶部显示「关于你选中的内容」+ 选中原文 + 阅读上下文（第 X 章 · Pxx）。
  - 检索优先级：选中片段 → 同章其他片段 → 整本书，让答案真正贴着你的选区。
  - 答案区分 **Primary Context**（你的选中内容，带「返回选中位置」）与 **Supporting Citations**（相关依据）。
  - 双向闭环：点「查看原文 / 返回选中位置」→ 右栏阅读器自动滚动并高亮对应段落。
- **选中态克制**：选中时只靠浏览器原生高亮 + 浮动工具栏表达，不在正文上叠加边框/底色，跨段选也不突兀。
- **可溯源 & 可降级**：每条 citation 做 Grounded 校验；真实 LLM 调用失败时自动降级到本地 Mock（示例书内容），始终有答案。
- **笔记**：一键把「结论 + 书中依据」保存为笔记，存于 localStorage。

---

## 🚀 跑起来

```bash
# 克隆后进入项目根目录
git clone https://github.com/IEChis/aiReadingAssistant.git
cd aiReadingAssistant

npm install
npm run dev        # http://localhost:5173/
npm run build      # 生产构建
npm run preview    # 预览构建产物
```

> 第一次运行前请先配置 `.env`（见下）。`npm install` 在已有 `node_modules` 时会很快。

---

## 🔌 LLM 接入（.env 四项配置）

> 复制 `.env.example` 为 `.env` 即可。**修改 `.env` 后需重启 dev server 才生效。**

| 字段 | 含义 | 示例 |
| --- | --- | --- |
| `VITE_LLM_API_BASE` | 大模型 API base URL（OpenAI Chat Completions 协议） | `https://your-llm-provider.example/v1` |
| `VITE_LLM_API_KEY`  | 你的 API Key（**不要提交到 Git**，已在 `.gitignore` 忽略） | `sk-xxxxx` |
| `VITE_LLM_MODEL`    | 模型名 | `deepseek-v4-flash` |
| `VITE_LLM_ENABLED`  | `true`=优先 LLM（失败回退 Mock）；`false`=纯 Mock 演示 | `true` |

### 工作机制

```
浏览器 → POST /llm/chat/completions
              │
              └─ Vite Dev Proxy → VITE_LLM_API_BASE/chat/completions → DeepSeek/GPT/...
```

- 开发服务器已配置 proxy：`/llm/*` → `VITE_LLM_API_BASE/*`（**避免浏览器 CORS**）。
- 客户端代码只用相对路径 `/llm/...`；生产部署时请改为你们自己的服务端网关代理。
- 答案的每条 citation 都会做 **Grounded 校验**：模型必须返回 context 中真实存在的 chunkId，否则整条答案视为不 Grounded，自动降级到本地 Mock。

> ⚠️ **Demo 阶段**：API Key 写在前端可读的 `.env` 里，会出现在浏览器 bundle 中。
> 生产部署时请把 `VITE_LLM_API_BASE / KEY / MODEL` 移到**服务端环境变量**，由服务端中转调用，前端只调你们自己的 `/api/ask`。

---

## 🧭 产品流程

```
书架
  └─ 进入书籍工作台
        ├─ 首页建议问题（点击即发送）
        ├─ 底部 Ask this book 输入框（始终常驻，Enter 发送）
        ├─ Moment 1 检索动画（"正在查找书中相关内容……"逐条浮现）
        ├─ Moment 2 结构化答案（结论 → 解释 → 核心观点 → 书中依据 → 继续提问）
        └─ Moment 3 Citation 跳转（右栏阅读器自动 scrollIntoView + 临时高亮）
              └─ Follow-up（点击即追问）/ Save Note（顶部"+ 保存笔记"）
                    └─ 笔记页（localStorage 持久化）

选中原文 → 浮动工具栏（✨AI解释 / ❓为什么 / ↗继续探索）
              └─ 上下文答案（关于你选中的内容 → 解释 → 核心观点 → 相关依据 → Follow-up）
                    └─ 返回选中位置 / 查看原文（阅读器高亮滚动，形成 Reader↔AI 双向闭环）
```

---

## 🗂 关键模块

```
src/
├─ types/                         核心数据类型（Book/Chapter/Chunk/AIAnswer/Citation/SelectedContext/...）
├─ data/
│   ├─ books.ts                   5 本示例书的元数据 + 章节 + 建议问题
│   ├─ chunks.ts                  原文片段（按 book × chapter 组织）
│   └─ answers.ts                 预置结构化答案（Mock 兜底用）
├─ services/
│   ├─ mockRag.ts                 检索 + 答案合成 + 追问生成（关键词 + 重叠评分）
│   │                             retrieveWithContext：选中chunk → 同章 → 整本 优先级
│   ├─ llmClient.ts               OpenAI Chat Completions 客户端（含 Grounded system prompt 构造）
│   └─ answerEngine.ts            适配器：askBookQuestion(opts) 统一入口；LLM 优先 → Grounded 校验 → 降级 Mock
├─ hooks/useBookQA.ts             工作台状态机
├─ components/
│   ├─ layout/Layout.tsx          顶栏 + 主区域 + 底部 footer
│   ├─ book/{BookSidebar,ChapterList,BookCard}.tsx
│   ├─ chat/{ChatPanel,QuestionInput,AnswerCard,InsightCard,
│   │        CitationCard,FollowUpQuestions,RetrievalTicker,ModelBadge}.tsx
│   ├─ reader/{ReaderPanel,BookContent,BookChunk,SelectionToolbar}.tsx
│   ├─ notes/NoteCard.tsx
│   └─ ErrorBoundary.tsx          任意子组件异常时兜底（防止整条问答变空白）
├─ pages/{Home,BookWorkspace,Notes}.tsx
└─ vite-env.d.ts                  VITE_* 环境变量类型声明
```

---

## 🎯 设计原则

1. **Grounded** — AI 只依据「我能看到」的原文片段回答，绝不编造引用。
2. **Traceable** — 每条结论锚定一个 chunkId，点击可跳原文高亮。
3. **Readable** — 答案强制模板：结论 → 解释 → 核心观点 → 书中依据 → 继续提问；不像聊天气泡。
4. **Actionable** — 每个答案都引导下一步：查看原文 / 返回选中位置 / 继续提问 / 保存笔记。

三大关键瞬间（验收时刻）：

- **Moment 1**：提问 → "正在查找书中相关内容……"
- **Moment 2**：答案 → "来源：第 3 章 · P42"
- **Moment 3**：点 Citation → 阅读器 scroll + highlight

---

## ⚠️ 已知限制

- 示例书内容为**原创化要点复述**（ Demo 用，非书籍原文）。
- 响应式仅 Desktop ≥1024 三栏常驻；<1024 阅读器由「原文」按钮切换。
- 未做真实向量库（按 MVP 范围，检索为关键词 + 重叠评分）。
- LLM 调用在浏览器侧，密钥会在 bundle 中可见（生产需服务端代理）。
- 问答历史仅内存（刷新后清空），笔记存于 localStorage。

