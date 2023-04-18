import { RotatableNode, RotateTransition } from '../transitions/rotations'

describe(RotateTransition, () => {
  it('marks nodes as disconnected for right rotation', () => {
    const position = { x: 100, y: 100 }
    const root: RotatableNode = {
      position,
      isDisconnected: false,
      left: {
        isDisconnected: false,
        position,
        left: { isDisconnected: false, position },
        right: { isDisconnected: false, position },
      },
      right: {
        isDisconnected: false,
        position,
      },
    }

    const transition = new RotateTransition(root, 'right')

    transition.update(0)
    expect(root.isDisconnected).toBe(true)
    expect(root.left?.isDisconnected).toBe(false)
    expect(root.right?.isDisconnected).toBe(false)
    expect(root.left?.left?.isDisconnected).toBe(false)
    expect(root.left?.right?.isDisconnected).toBe(true)
  })

  it('marks nodes as disconnected for left rotation', () => {
    const position = { x: 100, y: 100 }
    const root: RotatableNode = {
      position,
      isDisconnected: false,
      left: { isDisconnected: false, position },
      right: {
        isDisconnected: false,
        position,
        left: { isDisconnected: false, position },
        right: { isDisconnected: false, position },
      },
    }

    const transition = new RotateTransition(root, 'left')

    transition.update(0)
    expect(root.isDisconnected).toBe(true)
    expect(root.left?.isDisconnected).toBe(false)
    expect(root.right?.isDisconnected).toBe(false)
    expect(root.right?.left?.isDisconnected).toBe(true)
    expect(root.right?.right?.isDisconnected).toBe(false)
  })
})
