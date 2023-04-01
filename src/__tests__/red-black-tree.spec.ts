import { insert, isRed, RedBlackNode } from '../red-black-tree'

function traverse(tree: RedBlackNode) {
  let result = ''

  function visitNode(node: RedBlackNode) {
    result += (isRed(node) ? '!' : '') + node.value
    if (node.left) visitNode(node.left)
    if (node.right) visitNode(node.right)
  }

  visitNode(tree)
  return result
}

describe('Red-black tree construction', () => {
  describe('tree construction', () => {
    it('inserts the node at the bottom as a left node', () => {
      const tree: RedBlackNode = {
        value: 'E',
        color: 'black',
        left: { value: 'B', color: 'black' },
        right: {
          value: 'S',
          color: 'black',
          left: { value: 'R', color: 'red' },
        },
      }

      const inserted = insert(tree, 'A')
      expect(traverse(inserted)).toEqual('EB!AS!R')
    })

    it('inserts the node at the bottom as a right node', () => {
      const tree: RedBlackNode = {
        value: 'E',
        color: 'black',
        left: { value: 'A', color: 'black' },
        right: {
          value: 'S',
          color: 'black',
          left: { value: 'R', color: 'red' },
        },
      }

      const inserted = insert(tree, 'C')
      expect(traverse(inserted)).toEqual('EC!AS!R')
    })

    it('inserts into a 3-node at the bottom', () => {
      const tree: RedBlackNode = {
        value: 'E',
        color: 'black',
        left: {
          value: 'C',
          color: 'black',
          left: { value: 'A', color: 'red' },
        },
        right: {
          value: 'S',
          color: 'black',
          left: { value: 'R', color: 'red' },
        },
      }

      const inserted = insert(tree, 'H')
      expect(traverse(inserted)).toEqual('R!EC!AHS')
    })

    it('passes red links up the tree', () => {
      const tree: RedBlackNode = {
        value: 'R',
        color: 'black',
        left: {
          value: 'E',
          color: 'red',
          left: {
            value: 'C',
            color: 'black',
            left: { value: 'A', color: 'red' },
          },
          right: {
            value: 'M',
            color: 'black',
            left: { value: 'H', color: 'red' },
          },
        },
        right: { value: 'S', color: 'black' },
      }

      const inserted = insert(tree, 'P')
      expect(traverse(inserted)).toEqual('MEC!AHRPS')
    })
  })
})
