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

export interface Mutation<NodeType> {
  kind: MutationKind
  result: NodeType
  node?: NodeType
}
