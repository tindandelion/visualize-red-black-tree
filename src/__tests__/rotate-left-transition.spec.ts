import { RotatableNode, RotateLeftTransition } from '../transitions/rotate-left'

describe('Left rotation', () => {
  const root: RotatableNode = {
    position: { x: 100, y: 100 },
    isDisconnected: false,
    right: { isDisconnected: false, position: { x: 150, y: 200 } },
  }

  it('marks root as disconnected', () => {
    const transition = new RotateLeftTransition(root)

    transition.update(0)
    expect(root.isDisconnected).toBe(true)
  })

  it('moves nodes to their final destinations', () => {
    const transition = new RotateLeftTransition(root)

    transition.update(0)
    transition.update(RotateLeftTransition.interval / 2)
    transition.update(RotateLeftTransition.interval)

    expect(root.position).toEqual({ x: 50, y: 200 })
    expect(root.right?.position).toEqual({ x: 100, y: 100 })
  })
})
