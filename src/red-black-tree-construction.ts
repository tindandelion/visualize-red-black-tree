export type LinkColor = 'red' | 'black'

export type MutationKind =
  | 'insert'
  | 'rotate-left'
  | 'rotate-right'
  | 'flip-colors'
  | 'blacken-root'

export interface TreeNode<Child extends TreeNode<Child>> {
  left?: Child
  right?: Child
}

export interface RedBlackNode<
  ValueType = unknown,
  Child extends RedBlackNode<ValueType, Child> = any
> extends TreeNode<Child> {
  value: ValueType
  color: LinkColor
}

export interface Mutation<NodeType> {
  kind: MutationKind
  result: NodeType
  node?: NodeType
}

export function isRed(n?: RedBlackNode) {
  return !!n && n.color === 'red'
}

export function* insert<
  ValueType,
  NodeType extends RedBlackNode<ValueType, NodeType>
>(nodeToInsert: NodeType, root?: NodeType): Generator<Mutation<NodeType>> {
  let finalResult: NodeType | undefined = undefined

  for (const mutation of _insert(nodeToInsert, root)) {
    yield mutation
    finalResult = mutation.result
  }

  if (finalResult && isRed(finalResult)) {
    yield { kind: 'blacken-root', result: { ...finalResult, color: 'black' } }
  }
}

function* _insert<
  ValueType,
  NodeType extends RedBlackNode<ValueType, NodeType>
>(node: NodeType, root?: NodeType): Generator<Mutation<NodeType>> {
  if (!root) {
    yield { kind: 'insert', result: { ...node, color: 'red' } }
    return
  }

  if (root.value > node.value) {
    for (const mutation of _insert(node, root.left)) {
      root = { ...root, left: mutation.result }
      yield { ...mutation, result: root }
    }
  } else {
    for (const mutation of _insert(node, root.right)) {
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

function rotateLeft<T extends RedBlackNode>(node: T): T {
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

function rotateRight<T extends RedBlackNode>(node: T): T {
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

function flipColors<T extends RedBlackNode>(node: T): T {
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
