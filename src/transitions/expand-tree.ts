import { MoveNodeTransition, PositionedNode } from './move-transition'

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
