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

export type LinkColor = 'red' | 'black'

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
