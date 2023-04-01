export interface VisualizationTransition {
  readonly isFinished: boolean
  update(timeElapsed: number): void
}

export class VisualizationDelay implements VisualizationTransition {
  private readonly delay = 1000
  private startTime: number | undefined = undefined
  private currentTime: number | undefined = undefined

  update(timeElapsed: number): void {
    if (!this.startTime) this.startTime = timeElapsed
    else this.currentTime = timeElapsed
  }

  get isFinished(): boolean {
    if (this.currentTime && this.startTime)
      return this.startTime + this.delay < this.currentTime
    else return false
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

export const FinishedTransition: VisualizationTransition = {
  isFinished: true,
  update: (_timeElapsed: number): void => {},
}
