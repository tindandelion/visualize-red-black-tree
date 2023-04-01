export type LinkColor = 'red' | 'black'

export interface RedBlackNode {
  readonly value: string
  readonly color: LinkColor
  readonly left?: RedBlackNode
  readonly right?: RedBlackNode
}

export function isRed(n?: RedBlackNode) {
  return !!n && n.color === 'red'
}

export function insert(
  root: RedBlackNode | undefined,
  value: string
): RedBlackNode {
  return { ...performInsertion(root, value), color: 'black' }
}

function performInsertion(
  root: RedBlackNode | undefined,
  value: string
): RedBlackNode {
  if (!root) return { value, color: 'red' }

  if (root.value > value)
    root = { ...root, left: performInsertion(root.left, value) }
  else root = { ...root, right: performInsertion(root.right, value) }

  if (isRed(root.right) && !isRed(root.left)) root = rotateLeft(root)
  if (isRed(root.left) && isRed(root.left?.left)) root = rotateRight(root)
  if (isRed(root.left) && isRed(root.right)) root = flipColors(root)

  return root
}

function rotateLeft(node: RedBlackNode): RedBlackNode {
  const rightChild = node.right
  if (!rightChild || !isRed(rightChild))
    throw new Error('Unable to rotate left')

  const leftSubtree = node.left
  const midSubtree = rightChild.left
  const rightSubtree = rightChild.right

  return {
    ...rightChild,
    color: node.color,
    left: {
      ...node,
      color: 'red',
      left: leftSubtree,
      right: midSubtree,
    },
    right: rightSubtree,
  }
}

function rotateRight(node: RedBlackNode): RedBlackNode {
  const leftChild = node.left
  if (!leftChild || !isRed(leftChild)) throw new Error('Unable to rotate right')

  const leftSubtree = leftChild.left
  const midSubtree = leftChild.right
  const rightSubtree = node.right

  return {
    ...leftChild,
    color: node.color,
    left: leftSubtree,
    right: {
      ...node,
      color: 'red',
      left: midSubtree,
      right: rightSubtree,
    },
  }
}

function flipColors(node: RedBlackNode): RedBlackNode {
  if (!node.left || !node.right)
    throw new Error('No children to flip colors of ' + node.value)
  const canFlip = !isRed(node) && isRed(node.left) && isRed(node.right)
  if (!canFlip) throw new Error('Unable to flip colors of ' + node.value)

  return {
    ...node,
    color: 'red',
    left: { ...node.left, color: 'black' },
    right: { ...node.right, color: 'black' },
  }
}
