import { Mutation, RedBlackNode } from './common'

export function* insert<
  ValueType,
  NodeType extends RedBlackNode<ValueType, NodeType>
>(node: NodeType, root?: NodeType): Generator<Mutation<NodeType>> {
  if (!root) {
    yield { kind: 'insert', result: { ...node, color: 'black' } }
    return
  }

  if (root.value > node.value) {
    for (const mutation of insert(node, root.left)) {
      root = { ...root, left: mutation.result }
      yield { ...mutation, result: root }
    }
  } else {
    for (const mutation of insert(node, root.right)) {
      root = { ...root, right: mutation.result }
      yield { ...mutation, result: root }
    }
  }
}
