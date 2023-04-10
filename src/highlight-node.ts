import { IntervalTransition } from './transitions'

type Highlightable = {
  backgroundColor: string
}

export class HighlightNode extends IntervalTransition {
  private static readonly interval = 1000
  private static readonly highlightColor = '#dc322f'

  private readonly originalBackground: string

  constructor(private readonly node: Highlightable) {
    super(HighlightNode.interval)
    this.originalBackground = node.backgroundColor
  }

  protected doUpdate(): void {
    const currentBackground = this.isFinished
      ? this.originalBackground
      : HighlightNode.highlightColor

    this.node.backgroundColor = currentBackground
  }
}
