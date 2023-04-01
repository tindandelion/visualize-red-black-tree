import { Point } from '../tree-visualization'

type VisualNode = {
  value: string
  position: Point
  left?: VisualNode
  right?: VisualNode
}

describe('Node movement animations', () => {
  it('creates animations for each node', () => {
    const startTree: VisualNode = {
      value: 'D',
      position: { x: 100, y: 100 },
      left: { value: 'C', position: { x: 50, y: 200 } },
      right: { value: 'E', position: { x: 150, y: 200 } },
    }

    const endTree: VisualNode = {
      value: 'D',
      position: { x: 120, y: 50 },
      left: {
        value: 'C',
        position: { x: 70, y: 150 },
        left: { value: 'A', position: { x: 50, y: 200 } },
      },
      right: { value: 'E', position: { x: 170, y: 150 } },
    }

    const animations = createAnimations(startTree, endTree)

    expect(animationsToString(animations)).toEqual([
      'D:move([100,100]-[120,50])',
      'C:move([50,200]-[70,150])',
      'E:move([150,200]-[170,150])',
    ])
  })

  function createAnimations(startTree: VisualNode, endTree: VisualNode) {
    const result: MoveNodeAnimation[] = []

    function recur(startNode: VisualNode, endNode: VisualNode) {
      result.push(new MoveNodeAnimation(startNode, endNode.position))
      if (startNode.left && endNode.left) recur(startNode.left, endNode.left)
      if (startNode.right && endNode.right)
        recur(startNode.right, endNode.right)
    }

    recur(startTree, endTree)
    return result
  }

  function animationsToString(animations: MoveNodeAnimation[]) {
    return animations.map(
      (a) =>
        `${a.node.value}:move([${a.node.position.x},${a.node.position.y}]-[${a.endPosition.x},${a.endPosition.y}])`
    )
  }
})

class MoveNodeAnimation {
  constructor(
    public readonly node: VisualNode,
    public readonly endPosition: Point
  ) {}
}
