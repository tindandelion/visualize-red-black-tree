import { PositionedNode } from '../transitions/base-transitions'
import { RotateLeftTransition } from '../transitions/rotate-left'

describe('Left rotation', () => {
  it('moves nodes to their final destinations', () => {
    const root: PositionedNode = {
      value: 'C',
      position: { x: 100, y: 100 },
      right: { value: 'F', position: { x: 150, y: 200 } },
    }

    const transition = new RotateLeftTransition(root)

    transition.update(0)
    transition.update(RotateLeftTransition.interval)

    expect(root.position).toEqual({ x: 50, y: 200 })
    // expect(root.right?.position).toEqual({ x: 100, y: 100 })
  })
})
