import { TreeNodeLinks } from './tidy-layout'

export type LinkColor = 'red' | 'black'

export interface RedBlackNode<T> extends TreeNodeLinks {
  value: T
  color: LinkColor
}

export function isRed<T>(n?: RedBlackNode<T>) {
  return !!n && n.color === 'red'
}

export function insert<T>(
  root: RedBlackNode<T> | undefined,
  value: T
): RedBlackNode<T> {
  const newRoot = performInsertion(root, value)
  newRoot.color = 'black'
  return newRoot
}

function performInsertion<T>(
  root: RedBlackNode<T> | undefined,
  value: T
): RedBlackNode<T> {
  if (!root) return { value, color: 'red' }

  if (root.value > value) root.left = performInsertion(root.left, value)
  else root.right = performInsertion(root.right, value)

  if (isRed(root.right) && !isRed(root.left)) root = rotateLeft(root)
  if (isRed(root.left) && isRed(root.left?.left)) root = rotateRight(root)
  if (isRed(root.left) && isRed(root.right)) root = flipColors(root)

  return root
}

function rotateLeft<T>(h: RedBlackNode<T>): RedBlackNode<T> {
  if (!h.right || !isRed(h.right)) throw new Error('Unable to rotate left')

  const x = h.right
  h.right = x.left
  x.left = h
  x.color = h.color
  h.color = 'red'
  return x
}

function rotateRight<T>(h: RedBlackNode<T>): RedBlackNode<T> {
  if (!h.left || !isRed(h.left)) throw new Error('Unable to rotate right')

  const x = h.left
  h.left = x.right
  x.right = h
  x.color = h.color
  h.color = 'red'
  return x
}

function flipColors<T>(h: RedBlackNode<T>): RedBlackNode<T> {
  if (!h.left || !h.right)
    throw new Error('No children to flip colors of ' + h.value)
  const canFlip = !isRed(h) && isRed(h.left) && isRed(h.right)
  if (!canFlip) throw new Error('Unable to flip colors of ' + h.value)

  h.color = 'red'
  h.left.color = 'black'
  h.right.color = 'black'
  return h
}
