import { RedBlackNode, isRed, insert } from '../red-black-tree-iterations'

function toString(nodes: RedBlackNode[]): string[] {
  function nodeToString(node?: RedBlackNode): string {
    if (!node) return ''
    else {
      const nodeValue = (isRed(node) ? '!' : '') + node.value
      return nodeValue + nodeToString(node.left) + nodeToString(node.right)
    }
  }

  return nodes.map((n) => nodeToString(n))
}

describe('Red-black tree construction', () => {
  it('inserts a node without rotations', () => {
    const root: RedBlackNode = { value: 'H', color: 'black' }

    const mutations = [...insert('F', root)]
    expect(toString(mutations)).toEqual(['H!F'])
  })

  it('inserts a node with a single rotation', () => {
    const root: RedBlackNode = { value: 'H', color: 'black' }

    const mutations = [...insert('K', root)]
    expect(toString(mutations)).toEqual(['H!K', 'K!H'])
  })

  it('inserts a node with a rotation and a flip', () => {
    const root: RedBlackNode = {
      value: 'H',
      color: 'black',
      left: { value: 'F', color: 'red' },
    }

    const mutations = [...insert('B', root)]
    expect(toString(mutations)).toEqual(['H!F!B', 'FBH'])
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

    const mutations = [...insert('B', root)]
    expect(toString(mutations)).toEqual(['KH!F!B', 'K!FBH'])
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

    const mutations = [...insert('P', tree)]
    expect(toString(mutations)).toEqual([
      'R!EC!AM!H!PS',
      'R!EC!A!MHPS',
      'R!M!EC!AHPS',
      'MEC!AHRPS',
    ])
  })
})
