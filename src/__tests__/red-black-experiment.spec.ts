import { RedBlackNode, isRed, insert } from '../red-black-tree-iterations'

function toString(node?: RedBlackNode): string {
  if (!node) return ''
  else {
    const nodeValue = (isRed(node) ? '!' : '') + node.value
    return nodeValue + toString(node.left) + toString(node.right)
  }
}

describe('Red-black tree construction', () => {
  it('inserts a node without rotations', () => {
    const root: RedBlackNode = { value: 'H', color: 'black' }

    const [inserted, rotated] = insert('F', root)
    expect(toString(inserted)).toEqual('H!F')
    expect(rotated).toBeUndefined()
  })

  it('inserts a node with a single rotation', () => {
    const root: RedBlackNode = { value: 'H', color: 'black' }

    const [inserted, rotated] = insert('K', root)
    expect(toString(inserted)).toEqual('H!K')
    expect(toString(rotated)).toEqual('K!H')
  })

  it('inserts a node with a rotation and a flip', () => {
    const root: RedBlackNode = {
      value: 'H',
      color: 'black',
      left: { value: 'F', color: 'red' },
    }

    const [inserted, rotated] = insert('B', root)
    expect(toString(inserted)).toEqual('H!F!B')
    expect(toString(rotated)).toEqual('FBH')
  })

  it('applies rotations on deeper levels', () => {
    const root: RedBlackNode = {
      value: 'K',
      color: 'black',
      left: {
        value: 'H',
        color: 'black',
        left: { value: 'F', color: 'red' },
      },
    }

    const [inserted, rotated] = insert('B', root)
    expect(toString(inserted)).toEqual('KH!F!B')
    expect(toString(rotated)).toEqual('K!FBH')
  })

  it('inserts into a complex tree ', () => {
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

    const [inserted, rotated] = insert('P', tree)
    expect(toString(inserted)).toEqual('R!EC!AM!H!PS')
    expect(toString(rotated)).toEqual('MEC!AHRPS')
  })
})
