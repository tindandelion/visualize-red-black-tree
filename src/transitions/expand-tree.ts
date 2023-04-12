import { IntervalTransition, PositionedNode } from './base-transitions'
import { Point } from '../visualization/tree-visualization'

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

export function expandTree(startTree: PositionedNode, endTree: PositionedNode) {
  function recur(
    acc: MoveNodeTransition[],
    startNode: PositionedNode,
    endNode: PositionedNode
  ) {
    acc.push(new MoveNodeTransition(startNode, endNode.position))
    if (startNode.left && endNode.left) recur(acc, startNode.left, endNode.left)
    if (startNode.right && endNode.right)
      recur(acc, startNode.right, endNode.right)
    return acc
  }

  return recur([], startTree, endTree)
}
