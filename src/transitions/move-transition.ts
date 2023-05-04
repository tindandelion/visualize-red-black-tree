import { TreeNode } from '../tree-impl/red-black-tree'
import { Point } from '../visualization/tree-visualization'
import { IntervalTransition } from './base-transitions'

export interface _PositionedNode<Child extends _PositionedNode<Child>>
  extends TreeNode<Child> {
  value: string
  position: Point
}

export type PositionedNode = _PositionedNode<PositionedNode>

export class MoveNodeTransition extends IntervalTransition {
  static readonly interval = 1000
  private readonly startPosition: Point

  constructor(
    private readonly node: PositionedNode,
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
