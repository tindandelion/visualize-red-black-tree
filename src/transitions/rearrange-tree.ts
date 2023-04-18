import { MoveNodeTransition, _PositionedNode } from './move-transition'

export interface IdentifiableNode extends _PositionedNode<IdentifiableNode> {
  id: any
}

export function rearrangeTreeNodes(
  startTree: IdentifiableNode,
  endTree: IdentifiableNode
): MoveNodeTransition[] {
  function recur(acc: MoveNodeTransition[], startNode: IdentifiableNode) {
    const dest = findNodeById(startNode.id, endTree)
    if (dest) acc.push(new MoveNodeTransition(startNode, dest.position))

    if (startNode.left) recur(acc, startNode.left)
    if (startNode.right) recur(acc, startNode.right)
    return acc
  }

  return recur([], startTree)
}

function findNodeById(
  id: any,
  root?: IdentifiableNode
): IdentifiableNode | undefined {
  if (!root) return undefined
  if (root.id === id) return root
  return findNodeById(id, root.left) ?? findNodeById(id, root.right)
}
