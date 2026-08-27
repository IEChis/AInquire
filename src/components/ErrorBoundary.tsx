import { Component, type ReactNode } from 'react'

interface Props {
  /** 出错时仍可见的兜底 UI 重置 */
  children: ReactNode
  /** 自定义兜底 UI */
  fallback?: (err: Error, reset: () => void) => ReactNode
}

interface State {
  err: Error | null
}

/**
 * 兜底错误边界：避免 AnswerCard / 任何子组件异常时把整条问答
 * 渲染成一片空白（这是课堂 Demo 的最大信任杀手）。
 * 出错时降级为"答案加载失败，点击重试"。
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { err: null }

  static getDerivedStateFromError(err: Error): State {
    return { err }
  }

  componentDidCatch(err: Error) {
    // 仅 console 打印；产品内显示友好兜底
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', err)
  }

  reset = () => this.setState({ err: null })

  render() {
    if (this.state.err) {
      if (this.props.fallback) return this.props.fallback(this.state.err, this.reset)
      return (
        <div className="bg-surface rounded-card border border-line shadow-card p-5 text-sm text-muted">
          <div className="font-medium text-ink mb-1">这一条问答渲染失败</div>
          <div className="text-faint mb-3">刷新或换一个表述再试即可。</div>
          <button
            onClick={this.reset}
            className="text-accent hover:underline text-sm font-medium"
          >
            重新加载
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
