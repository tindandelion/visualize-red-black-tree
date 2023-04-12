import { IntervalTransition } from './base-transitions'

type Color = unknown

type Highlightable = {
  backgroundColor: Color
}

export interface ColorInterpolator {
  (startColor: Color, amount: number): Color
}

export class HighlightNode extends IntervalTransition {
  private static readonly interval = 500

  private readonly originalBackground: Color

  constructor(
    private readonly node: Highlightable,
    private readonly interpolator: ColorInterpolator
  ) {
    super(HighlightNode.interval)
    this.originalBackground = node.backgroundColor
  }

  protected doUpdate(): void {
    const currentBackground = this.isFinished
      ? this.originalBackground
      : this.interpolateColor()

    this.node.backgroundColor = currentBackground
  }

  private interpolateColor() {
    return this.interpolator(
      this.originalBackground,
      this.timeDelta / this.interval
    )
  }
}
