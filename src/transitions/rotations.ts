import { Point } from '../tree-visualization'
import { IntervalTransition } from './base-transitions'

type Dimension = { dx: number; dy: number }

export type RotatableNode = {
  position: Point
  isDisconnected: boolean
  readonly right?: RotatableNode
}

export class RotateLeftTransition extends IntervalTransition {
  public static readonly interval = 1000

  private readonly right: RotatableNode
  private rotCenter: Point
  private rotRadius: Dimension

  constructor(private readonly node: RotatableNode) {
    super(RotateLeftTransition.interval)
    if (!this.node.right) throw new Error('The node has no right child')
    this.right = this.node.right
    this.rotCenter = { x: this.node.position.x, y: this.right.position.y }
    this.rotRadius = {
      dx: this.right.position.x - this.node.position.x,
      dy: this.right.position.y - this.node.position.y,
    }
  }

  protected doUpdate(): void {
    const rightAngle =
      -(Math.PI / (2 * RotateLeftTransition.interval)) * this.timeDelta
    const rootAngle = rightAngle - Math.PI / 2

    this.node.isDisconnected = true
    this.node.position = this.positionAtAngle(rootAngle)
    this.right.position = this.positionAtAngle(rightAngle)
  }

  private positionAtAngle(angle: number) {
    return {
      x: this.rotCenter.x + this.rotRadius.dx * Math.cos(angle),
      y: this.rotCenter.y + this.rotRadius.dy * Math.sin(angle),
    }
  }
}

export class RotateRightTransition extends IntervalTransition {
  public static readonly interval = 1000

  constructor(private readonly node: RotatableNode) {
    super(RotateRightTransition.interval)
  }

  protected doUpdate(): void {
    this.node.isDisconnected = true
  }
}
