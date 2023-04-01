import { Point, VisualNode } from './tree-visualization'

export interface VisualizationTransition {
  readonly isFinished: boolean
  update(timeElapsed: number): void
}

export abstract class IntervalTransition implements VisualizationTransition {
  private startTime?: number
  private lastUpdated?: number

  constructor(public readonly interval: number) {}

  update(timeElapsed: number): void {
    if (this.startTime === undefined) this.startTime = timeElapsed

    this.lastUpdated = timeElapsed
    this.doUpdate()
  }

  get isFinished(): boolean {
    return this.timeDelta >= this.interval
  }

  protected abstract doUpdate(): void

  protected get timeDelta(): number {
    if (this.startTime === undefined || this.lastUpdated === undefined) return 0
    else return this.lastUpdated - this.startTime
  }
}

export class VisualizationDelay extends IntervalTransition {
  private static readonly defaultDelay = 1000

  protected doUpdate(): void {}

  constructor(delay: number = VisualizationDelay.defaultDelay) {
    super(delay)
  }
}

export class MoveNodeTransition extends IntervalTransition {
  static readonly interval = 1000
  private readonly startPosition: Point

  constructor(
    private readonly node: VisualNode,
    private readonly destPosition: Point
  ) {
    super(MoveNodeTransition.interval)
    this.startPosition = { ...node.position }
  }

  protected doUpdate(): void {
    const currentPosition = {
      x:
        this.startPosition.x +
        ((this.destPosition.x - this.startPosition.x) / this.interval) *
          this.timeDelta,
      y:
        this.startPosition.y +
        ((this.destPosition.y - this.startPosition.y) / this.interval) *
          this.timeDelta,
    }
    this.node.position = currentPosition
  }

  toString() {
    return [
      'Move ',
      this.node.value,
      ': ',
      this.pointToString(this.startPosition),
      ' -> ',
      this.pointToString(this.destPosition),
    ].join('')
  }

  private pointToString(pt: Point) {
    return `(${pt.x},${pt.y})`
  }
}

export class TransitionSequence implements VisualizationTransition {
  constructor(private transitions: VisualizationTransition[]) {}

  update(timeElapsed: number): void {
    const current = this.transitions[0]
    current.update(timeElapsed)
    if (current.isFinished) this.transitions.shift()
  }

  get isFinished() {
    return this.transitions.length === 0
  }
}

export class ParallelTransition implements VisualizationTransition {
  constructor(private readonly transitions: VisualizationTransition[]) {}

  update(timeElapsed: number): void {
    this.unfinishedTransitions.forEach((t) => t.update(timeElapsed))
  }

  get isFinished(): boolean {
    return this.unfinishedTransitions.length === 0
  }

  private get unfinishedTransitions(): VisualizationTransition[] {
    return this.transitions.filter((t) => !t.isFinished)
  }
}

export const FinishedTransition: VisualizationTransition = {
  isFinished: true,
  update: (_timeElapsed: number): void => {},
}
