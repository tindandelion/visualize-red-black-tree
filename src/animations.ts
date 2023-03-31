import P5 from 'p5'

export interface AnimationClip {
  readonly isFinished: boolean
  drawFrame(p5: P5): void
}

export class AnimationDelay implements AnimationClip {
  private readonly delay = 1000
  private firstInvocation: number | undefined = undefined
  private currentTime: number | undefined = undefined

  drawFrame(p5: P5): void {
    const timeElapsed = p5.millis()
    if (!this.firstInvocation) this.firstInvocation = timeElapsed
    else this.currentTime = timeElapsed
  }

  get isFinished(): boolean {
    if (this.currentTime && this.firstInvocation)
      return this.firstInvocation + this.delay < this.currentTime
    else return false
  }
}

export class AnimationSequence implements AnimationClip {
  constructor(private animations: AnimationClip[]) {}

  drawFrame(p5: P5): void {
    const currentAnimation = this.animations[0]
    currentAnimation.drawFrame(p5)
    if (currentAnimation.isFinished) this.animations.shift()
  }

  get isFinished() {
    return this.animations.length === 0
  }
}

export const FinishedAnimation: AnimationClip = {
  isFinished: true,
  drawFrame: (p5: P5): void => {},
}
