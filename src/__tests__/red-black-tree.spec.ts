import { insert, isRed, RedBlackNode } from '../red-black-tree'

function toString(node?: RedBlackNode): string {
  if (!node) return ''
  else {
    const nodeValue = (isRed(node) ? '!' : '') + node.value
    return nodeValue + toString(node.left) + toString(node.right)
  }
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
      expect(toString(inserted)).toEqual('EB!AS!R')
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
      expect(toString(inserted)).toEqual('EC!AS!R')
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
      expect(toString(inserted)).toEqual('R!EC!AHS')
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
      expect(toString(inserted)).toEqual('MEC!AHRPS')
    })
  })
})
