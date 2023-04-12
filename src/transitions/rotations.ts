import { Point } from '../tree-visualization'
import { IntervalTransition } from './base-transitions'

type Dimension = { dx: number; dy: number }

export type RotatableNode = {
  position: Point
  isDisconnected: boolean
  readonly left?: RotatableNode
  readonly right?: RotatableNode
}

type RotationDirection = 'left' | 'right'

export class RotateTransition extends IntervalTransition {
  public static readonly interval = 1000

  private readonly child: RotatableNode
  private readonly childToDisconnect: RotatableNode | undefined
  private rotCenter: Point
  private rotRadius: Dimension

  constructor(
    private readonly node: RotatableNode,
    direction: RotationDirection
  ) {
    super(RotateTransition.interval)
    if (direction === 'left') {
      if (!this.node.right) throw new Error('The node has no right child')
      this.child = this.node.right
      this.childToDisconnect = this.child.left
    } else {
      if (!this.node.left) throw new Error('The node has no left child')
      this.child = this.node.left
      this.childToDisconnect = this.child.right
    }

    this.rotCenter = { x: this.node.position.x, y: this.child.position.y }
    this.rotRadius = {
      dx: this.child.position.x - this.node.position.x,
      dy: this.child.position.y - this.node.position.y,
    }
  }

  protected doUpdate(): void {
    const rightAngle =
      -(Math.PI / (2 * RotateTransition.interval)) * this.timeDelta
    const rootAngle = rightAngle - Math.PI / 2

    this.disconnectAffectedNodes()
    this.node.position = this.positionAtAngle(rootAngle)
    this.child.position = this.positionAtAngle(rightAngle)
  }

  private disconnectAffectedNodes() {
    this.node.isDisconnected = true
    if (this.childToDisconnect) this.childToDisconnect.isDisconnected = true
  }

  private positionAtAngle(angle: number) {
    return {
      x: this.rotCenter.x + this.rotRadius.dx * Math.cos(angle),
      y: this.rotCenter.y + this.rotRadius.dy * Math.sin(angle),
    }
  }
}
