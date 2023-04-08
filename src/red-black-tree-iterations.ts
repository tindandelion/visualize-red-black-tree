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

export function* insert(
  value: string,
  root?: RedBlackNode
): Generator<RedBlackNode> {
  for (const node of _insert(value, root)) {
    yield { ...node, color: 'black' }
  }
}

function* _insert(value: string, root?: RedBlackNode): Generator<RedBlackNode> {
  if (!root) {
    yield { value, color: 'red' }
    return
  }

  if (root.value > value) {
    for (const left of _insert(value, root.left)) {
      root = { ...root, left }
      yield root
    }
  } else {
    for (const right of _insert(value, root.right)) {
      root = { ...root, right }
      yield root
    }
  }

  const needsRotation =
    isRed(root.right) || (isRed(root.left) && isRed(root.left?.left))

  if (needsRotation) {
    let r = root
    if (isRed(r.right) && !isRed(r.left)) r = rotateLeft(r)
    if (isRed(r.left) && isRed(r.left?.left)) r = rotateRight(r)
    if (isRed(r.left) && isRed(r.right)) r = flipColors(r)
    yield r
  }
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
