import {
  isRed,
  Mutation,
  insert,
  LinkColor,
  RedBlackNode,
} from '../red-black-tree-construction'

type StringNode = RedBlackNode<string, StringNode>

function toString(mutations: Mutation<StringNode>[]): string[] {
  function nodeToString(node?: StringNode): string {
    if (!node) return ''
    else {
      const nodeValue = (isRed(node) ? '!' : '') + node.value
      return nodeValue + nodeToString(node.left) + nodeToString(node.right)
    }
  }

  function mutationToString(m: Mutation<StringNode>) {
    let result = m.kind
    if (m.node) result += '(' + m.node.value + ')'
    result += ' ' + nodeToString(m.result)
    return result
  }

  return mutations.map(mutationToString)
}

function newNode(value: string, color: LinkColor = 'red'): StringNode {
  return { value, color }
}

describe('Red-black tree construction', () => {
  it('inserts a node without rotations', () => {
    const root: StringNode = { value: 'H', color: 'black' }

    const mutations = [...insert(newNode('F'), root)]
    expect(toString(mutations)).toEqual(['insert H!F'])
  })

  it('inserts a node with a single left rotation', () => {
    const root: StringNode = { value: 'H', color: 'black' }

    const mutations = [...insert(newNode('K'), root)]
    expect(toString(mutations)).toEqual(['insert H!K', 'rotate-left(H) K!H'])
  })

  it('flips colors and forces root to be black', () => {
    const root: StringNode = {
      value: 'C',
      color: 'black',
      left: { value: 'A', color: 'red' },
    }

    const mutations = [...insert(newNode('F'), root)]
    expect(toString(mutations)).toEqual([
      'insert C!A!F',
      'flip-colors(C) !CAF',
      'blacken-root CAF',
    ])
  })

  it('inserts a node with a rotation and a flip', () => {
    const root: StringNode = {
      value: 'H',
      color: 'black',
      left: { value: 'F', color: 'red' },
    }

    const mutations = [...insert(newNode('B'), root)]
    expect(toString(mutations)).toEqual([
      'insert H!F!B',
      'rotate-right(H) F!B!H',
      'flip-colors(F) !FBH',
      'blacken-root FBH',
    ])
  })

  it('applies rotations on deeper levels', () => {
    const root: StringNode = {
      value: 'K',
      color: 'black',
      left: {
        value: 'H',
        color: 'black',
        left: { value: 'F', color: 'red' },
      },
    }

    const mutations = [...insert(newNode('B'), root)]
    expect(toString(mutations)).toEqual([
      'insert KH!F!B',
      'rotate-right(H) KF!B!H',
      'flip-colors(F) K!FBH',
    ])
  })

  it('inserts into a complex tree ', () => {
    const tree: StringNode = {
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

    const mutations = [...insert(newNode('P'), tree)]
    expect(toString(mutations)).toEqual([
      'insert R!EC!AM!H!PS',
      'flip-colors(M) R!EC!A!MHPS',
      'rotate-left(E) R!M!EC!AHPS',
      'rotate-right(R) M!EC!AH!RPS',
      'flip-colors(M) !MEC!AHRPS',
      'blacken-root MEC!AHRPS',
    ])
  })
})
