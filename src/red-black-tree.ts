import { TreeNodeLinks } from './tidy-layout'

export type LinkColor = 'red' | 'black'

export interface RedBlackNode extends TreeNodeLinks {
  value: string
  color: LinkColor
}

export function isRed(n?: RedBlackNode) {
  return !!n && n.color === 'red'
}

export function insert(
  root: RedBlackNode | undefined,
  value: string
): RedBlackNode {
  const newRoot = performInsertion(root, value)
  newRoot.color = 'black'
  return newRoot
}

function performInsertion(
  root: RedBlackNode | undefined,
  value: string
): RedBlackNode {
  if (!root) return { value, color: 'red' }

  if (root.value > value) root.left = performInsertion(root.left, value)
  else root.right = performInsertion(root.right, value)

  if (isRed(root.right) && !isRed(root.left)) root = rotateLeft(root)
  if (isRed(root.left) && isRed(root.left?.left)) root = rotateRight(root)
  if (isRed(root.left) && isRed(root.right)) root = flipColors(root)

  return root
}

function rotateLeft(h: RedBlackNode): RedBlackNode {
  if (!h.right || !isRed(h.right)) throw new Error('Unable to rotate left')

  const x = h.right
  h.right = x.left
  x.left = h
  x.color = h.color
  h.color = 'red'
  return x
}

function rotateRight(h: RedBlackNode): RedBlackNode {
  if (!h.left || !isRed(h.left)) throw new Error('Unable to rotate right')

  const x = h.left
  h.left = x.right
  x.right = h
  x.color = h.color
  h.color = 'red'
  return x
}

function flipColors(h: RedBlackNode): RedBlackNode {
  if (!h.left || !h.right)
    throw new Error('No children to flip colors of ' + h.value)
  const canFlip = !isRed(h) && isRed(h.left) && isRed(h.right)
  if (!canFlip) throw new Error('Unable to flip colors of ' + h.value)

  h.color = 'red'
  h.left.color = 'black'
  h.right.color = 'black'
  return h
}
