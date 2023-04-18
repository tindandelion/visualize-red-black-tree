import { MoveNodeTransition } from '../transitions/move-transition'
import {
  IdentifiableNode,
  rearrangeTreeNodes,
} from '../transitions/rearrange-tree'

describe('Tree expansion', () => {
  it('moves a single node', () => {
    const startTree: IdentifiableNode = {
      id: 1,
      value: 'A',
      position: { x: 100, y: 100 },
    }
    const endTree: IdentifiableNode = {
      id: 1,
      value: 'A',
      position: { x: 150, y: 150 },
    }

    const transitions = rearrangeTreeNodes(startTree, endTree)
    expect(transitionsToString(transitions)).toEqual([
      'Move A: (100,100) -> (150,150)',
    ])
  })

  it('moves the node between levels', () => {
    const startTree: IdentifiableNode = {
      id: 1,
      value: 'A',
      position: { x: 100, y: 100 },
    }
    const endTree: IdentifiableNode = {
      id: 2,
      value: 'B',
      position: { x: 100, y: 100 },
      left: { id: 1, value: 'A', position: { x: 125, y: 150 } },
    }

    const transitions = rearrangeTreeNodes(startTree, endTree)
    expect(transitionsToString(transitions)).toEqual([
      'Move A: (100,100) -> (125,150)',
    ])
  })

  it('expands the tree', () => {
    const startTree: IdentifiableNode = {
      id: 1,
      value: 'D',
      position: { x: 100, y: 100 },
      left: {
        id: 2,
        value: 'C',
        position: { x: 75, y: 150 },
        left: { id: 3, value: 'A', position: { x: 50, y: 200 } },
      },
      right: { id: 4, value: 'E', position: { x: 125, y: 150 } },
    }

    const endTree: IdentifiableNode = {
      id: 2,
      value: 'C',
      position: { x: 100, y: 100 },
      left: { id: 3, value: 'A', position: { x: 75, y: 150 } },
      right: {
        id: 1,
        value: 'D',
        position: { x: 125, y: 150 },
        right: { id: 4, value: 'E', position: { x: 150, y: 200 } },
      },
    }

    const transitions = rearrangeTreeNodes(startTree, endTree)
    expect(transitionsToString(transitions)).toEqual([
      'Move D: (100,100) -> (125,150)',
      'Move C: (75,150) -> (100,100)',
      'Move A: (50,200) -> (75,150)',
      'Move E: (125,150) -> (150,200)',
    ])
  })

  function transitionsToString(transitions: MoveNodeTransition[]) {
    return transitions.map((a) => a.toString())
  }
})
