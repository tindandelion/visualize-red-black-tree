import { MoveNodeTransition } from './transitions'
import { VisualNode } from './tree-visualization'

export function moveNodes(startTree: VisualNode, endTree: VisualNode) {
  const result: MoveNodeTransition[] = []

  function recur(startNode: VisualNode, endNode: VisualNode) {
    result.push(new MoveNodeTransition(startNode, endNode.position))
    if (startNode.left && endNode.left) recur(startNode.left, endNode.left)
    if (startNode.right && endNode.right) recur(startNode.right, endNode.right)
  }

  recur(startTree, endTree)
  return result
}
