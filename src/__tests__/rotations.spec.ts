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

  it('rotates nodes left', () => {
    const root: RotatableNode = {
      position: { x: 100, y: 100 },
      isDisconnected: false,
      right: { isDisconnected: false, position: { x: 150, y: 200 } },
    }

    const transition = new RotateTransition(root, 'left')

    transition.update(0)
    transition.update(RotateTransition.interval / 2)
    transition.update(RotateTransition.interval)

    expect(root.position).toEqual({ x: 50, y: 200 })
    expect(root.right?.position).toEqual({ x: 100, y: 100 })
  })

  it('rotates nodes right', () => {
    const root: RotatableNode = {
      position: { x: 100, y: 100 },
      isDisconnected: false,
      left: { isDisconnected: false, position: { x: 50, y: 200 } },
    }

    const transition = new RotateTransition(root, 'right')

    transition.update(0)
    transition.update(RotateTransition.interval / 2)
    transition.update(RotateTransition.interval)

    expect(root.position).toEqual({ x: 150, y: 200 })
    expect(root.left?.position).toEqual({ x: 100, y: 100 })
  })
})
