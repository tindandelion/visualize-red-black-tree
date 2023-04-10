import { MovableNode, moveNodes } from '../move-nodes'
import { VisualizationTransition } from '../transitions'

describe('Node movement animations', () => {
  it('creates animations for each node', () => {
    const startTree: MovableNode = {
      value: 'D',
      position: { x: 100, y: 100 },
      left: { value: 'C', position: { x: 50, y: 200 } },
      right: { value: 'E', position: { x: 150, y: 200 } },
    }

    const endTree: MovableNode = {
      value: 'D',
      position: { x: 120, y: 50 },
      left: {
        value: 'C',
        position: { x: 70, y: 150 },
        left: { value: 'A', position: { x: 50, y: 200 } },
      },
      right: { value: 'E', position: { x: 170, y: 150 } },
    }

    const animations = moveNodes(startTree, endTree)

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
