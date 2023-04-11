import {
  PositionedNode,
  VisualizationTransition,
} from '../transitions/base-transitions'
import { MoveNodeTransition, expandTree } from '../transitions/expand-tree'

describe('MoveNodeTransition', () => {
  const startPosition = { x: 100, y: 100 }
  const endPosition = { x: 200, y: 300 }

  it('has a string representation for debugging', () => {
    const node: PositionedNode = { value: 'X', position: startPosition }
    const transition = new MoveNodeTransition(node, endPosition)
    expect(transition.toString()).toEqual('Move X: (100,100) -> (200,300)')
  })

  it('moves the node to dest position', () => {
    const node: PositionedNode = { value: 'X', position: startPosition }
    const transition = new MoveNodeTransition(node, endPosition)

    transition.update(0)
    expect(node.position).toEqual(startPosition)

    transition.update(MoveNodeTransition.interval / 2)
    expect(node.position).toEqual({ x: 150, y: 200 })

    transition.update(MoveNodeTransition.interval)
    expect(node.position).toEqual(endPosition)
  })
})

describe('Expand tree on insertion', () => {
  it('creates animations for each node', () => {
    const startTree: PositionedNode = {
      value: 'D',
      position: { x: 100, y: 100 },
      left: { value: 'C', position: { x: 50, y: 200 } },
      right: { value: 'E', position: { x: 150, y: 200 } },
    }

    const endTree: PositionedNode = {
      value: 'D',
      position: { x: 120, y: 50 },
      left: {
        value: 'C',
        position: { x: 70, y: 150 },
        left: { value: 'A', position: { x: 50, y: 200 } },
      },
      right: { value: 'E', position: { x: 170, y: 150 } },
    }

    const animations = expandTree(startTree, endTree)

    expect(transitionsToString(animations)).toEqual([
      'Move D: (100,100) -> (120,50)',
      'Move C: (50,200) -> (70,150)',
      'Move E: (150,200) -> (170,150)',
    ])
  })

  function transitionsToString(transitions: VisualizationTransition[]) {
    return transitions.map((a) => a.toString())
  }
})
