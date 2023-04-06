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
  const result = _insert(value, root)
  yield result.root
  if (result.rotation) yield { ...result.rotation(), color: 'black' }
}

type Result = {
  root: RedBlackNode
  rotation?: () => RedBlackNode
}

type TransformFn = (() => RedBlackNode) | undefined

function _insert(value: string, root?: RedBlackNode): Result {
  if (!root) return { root: { value, color: 'red' }, rotation: undefined }

  let leftRotation: TransformFn
  let rightRotation: TransformFn

  if (root.value > value) {
    const result = _insert(value, root.left)
    root = { ...root, left: result.root }
    leftRotation = result.rotation
  } else {
    const result = _insert(value, root.right)
    root = { ...root, right: result.root }
    rightRotation = result.rotation
  }

  const needsRotation =
    leftRotation ||
    rightRotation ||
    isRed(root.right) ||
    (isRed(root.left) && isRed(root.left?.left))
  if (!needsRotation) return { root, rotation: undefined }
  else {
    let r = root
    const rotation = () => {
      if (leftRotation) r = { ...r, left: leftRotation() }
      if (rightRotation) r = { ...r, right: rightRotation() }

      if (isRed(r.right) && !isRed(r.left)) r = rotateLeft(r)
      if (isRed(r.left) && isRed(r.left?.left)) r = rotateRight(r)
      if (isRed(r.left) && isRed(r.right)) r = flipColors(r)
      return r
    }
    return { root, rotation }
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
