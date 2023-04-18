import { TreeNode } from '../red-black-tree-construction'
import { Point } from '../visualization/tree-visualization'
import { IntervalTransition } from './base-transitions'

export interface RotatableNode extends TreeNode<RotatableNode> {
  position: Point
  isDisconnected: boolean
}

type RotationDirection = 'left' | 'right'

export class RotateTransition extends IntervalTransition {
  public static readonly interval = 1000

  private readonly child: RotatableNode
  private readonly childToDisconnect: RotatableNode | undefined

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
  }

  protected doUpdate(): void {
    this.disconnectAffectedNodes()
  }

  private disconnectAffectedNodes() {
    this.node.isDisconnected = true
    if (this.childToDisconnect) this.childToDisconnect.isDisconnected = true
  }
}
