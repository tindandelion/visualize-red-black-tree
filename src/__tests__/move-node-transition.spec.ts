import {
  MoveNodeTransition,
  PositionedNode,
} from '../transitions/move-transition'

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
