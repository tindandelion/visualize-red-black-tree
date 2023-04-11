import { Point } from '../tree-visualization'

export type PositionedNode = {
  value: string
  position: Point
  left?: PositionedNode
  right?: PositionedNode
}

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
