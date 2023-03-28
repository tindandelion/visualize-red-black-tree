import { tidyLayout, TreeNodeLinks } from '../tidy-layout'

interface TreeNode extends TreeNodeLinks {
  value: number
}

describe('Tidy tree layout', () => {
  describe('simple tree structures', () => {
    it('lays out the single node tree', () => {
      const tree: TreeNode = { value: 1 }
      const layout = tidyLayout(tree)
      expect(layout.getNodePosition(tree)).toEqual([0, 0])
    })

    it('lays out a tree with only left child', () => {
      const tree: TreeNode = { value: 1, left: { value: 2 } }
      const layout = tidyLayout(tree)

      expect(layout.getNodePosition(tree.left!)).toEqual([0, 1])
      expect(layout.getNodePosition(tree)).toEqual([1, 0])
    })

    it('lays out a tree with only right child', () => {
      const tree: TreeNode = { value: 1, right: { value: 2 } }
      const layout = tidyLayout(tree)

      expect(layout.getNodePosition(tree.right!)).toEqual([1, 1])
      expect(layout.getNodePosition(tree)).toEqual([0, 0])
    })

    it('lays out a tree with both children', () => {
      const tree: TreeNode = {
        value: 1,
        left: { value: 3 },
        right: { value: 2 },
      }
      const layout = tidyLayout(tree)

      expect(layout.getNodePosition(tree.right!)).toEqual([2, 1])
      expect(layout.getNodePosition(tree.left!)).toEqual([0, 1])
      expect(layout.getNodePosition(tree)).toEqual([1, 0])
    })
  })

  describe('complex structure', () => {
    const leftMost: TreeNode = { value: 4 }
    const rightMost: TreeNode = { value: 7 }
    const tree: TreeNode = {
      value: 1,
      left: {
        value: 2,
        left: leftMost,
        right: { value: 5 },
      },
      right: {
        value: 3,
        left: { value: 6 },
        right: rightMost,
      },
    }

    it('lays out a complex tree', () => {
      const layout = tidyLayout(tree)
      expect(layout.getNodePosition(tree)).toEqual([3, 0])
      expect(layout.getNodePosition(leftMost)).toEqual([0, 2])
      expect(layout.getNodePosition(rightMost)).toEqual([6, 2])
    })

    it('tracks maximum x and y positions', () => {
      const layout = tidyLayout(tree)
      expect(layout.maxX).toEqual(6)
      expect(layout.maxY).toEqual(2)
    })

    it('lays out an unbalanced tree', () => {
      const tree: TreeNode = {
        value: 1,
        left: { value: 2 },
        right: { value: 3, left: { value: 4 }, right: { value: 5 } },
      }
      const layout = tidyLayout(tree)
      expect(layout.getNodePosition(tree)).toEqual([1, 0])
    })
  })
})
