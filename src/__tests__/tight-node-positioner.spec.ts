import {
  Dimension,
  TightNodePositioner,
} from '../visualization/tree-visualization'

describe('Tight node positioner', () => {
  const canvasSize: Dimension = { dx: 1000, dy: 800 }

  it('positions the single node in the center of the canvas', () => {
    const treeSize: Dimension = { dx: 1, dy: 1 }

    const positioner = createPositioner(treeSize)
    const nodePosition = positioner.placeOnCanvas([0, 0])
    expect(nodePosition).toEqual({ x: 500, y: 400 })
  })

  it('positions nodes by X axis', () => {
    const treeSize: Dimension = { dx: 3, dy: 1 }

    const positioner = createPositioner(treeSize)
    expect(positioner.placeOnCanvas([0, 0])).toEqual({ x: 400, y: 400 })
    expect(positioner.placeOnCanvas([1, 0])).toEqual({ x: 500, y: 400 })
    expect(positioner.placeOnCanvas([2, 0])).toEqual({ x: 600, y: 400 })
  })

  it('positions nodes by Y axis', () => {
    const treeSize: Dimension = { dx: 1, dy: 3 }

    const positioner = createPositioner(treeSize)
    expect(positioner.placeOnCanvas([0, 0])).toEqual({ x: 500, y: 300 })
    expect(positioner.placeOnCanvas([0, 1])).toEqual({ x: 500, y: 400 })
    expect(positioner.placeOnCanvas([0, 2])).toEqual({ x: 500, y: 500 })
  })

  it('uses horizontal / vertical aspect ratio to scale X axis', () => {
    const treeSize: Dimension = { dx: 3, dy: 1 }

    const positioner = createPositioner(treeSize)
    positioner.aspectRatio = 0.5

    expect(positioner.placeOnCanvas([0, 0])).toEqual({ x: 450, y: 400 })
    expect(positioner.placeOnCanvas([1, 0])).toEqual({ x: 500, y: 400 })
    expect(positioner.placeOnCanvas([2, 0])).toEqual({ x: 550, y: 400 })
  })

  function createPositioner(treeSize: Dimension) {
    const positioner = new TightNodePositioner(canvasSize, treeSize)
    positioner.aspectRatio = 1
    positioner.nodeSpacing = 100
    return positioner
  }
})
