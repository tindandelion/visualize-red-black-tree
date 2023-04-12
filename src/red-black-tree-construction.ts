export type LinkColor = 'red' | 'black'
export type MutationKind =
  | 'insert'
  | 'rotate-left'
  | 'rotate-right'
  | 'flip-colors'
  | 'blacken-root'
  | 'unknown'

export interface RedBlackNode {
  readonly value: string
  readonly color: LinkColor
  readonly left?: RedBlackNode
  readonly right?: RedBlackNode
}

export interface Mutation {
  kind: MutationKind
  result: RedBlackNode
  node?: RedBlackNode
}

export function isRed(n?: RedBlackNode) {
  return !!n && n.color === 'red'
}

export function* insert(
  value: string,
  root?: RedBlackNode
): Generator<Mutation> {
  let finalResult: RedBlackNode | undefined = undefined

  for (const mutation of _insert(value, root)) {
    yield mutation
    finalResult = mutation.result
  }

  if (finalResult && isRed(finalResult)) {
    yield { kind: 'blacken-root', result: { ...finalResult, color: 'black' } }
  }
}

function* _insert(value: string, root?: RedBlackNode): Generator<Mutation> {
  if (!root) {
    yield { kind: 'insert', result: { value, color: 'red' } }
    return
  }

  if (root.value > value) {
    for (const mutation of _insert(value, root.left)) {
      root = { ...root, left: mutation.result }
      yield { ...mutation, result: root }
    }
  } else {
    for (const mutation of _insert(value, root.right)) {
      root = { ...root, right: mutation.result }
      yield { ...mutation, result: root }
    }
  }

  if (isRed(root.right) && !isRed(root.left)) {
    const node = root
    root = rotateLeft(root)
    yield { kind: 'rotate-left', node, result: root }
  }
  if (isRed(root.left) && isRed(root.left?.left)) {
    const node = root
    root = rotateRight(root)
    yield { kind: 'rotate-right', node, result: root }
  }
  if (isRed(root.left) && isRed(root.right)) {
    const node = root
    root = flipColors(root)
    yield { kind: 'flip-colors', node, result: root }
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
