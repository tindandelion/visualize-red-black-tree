import p5 from 'p5'
import { RedBlackNode, isRed } from './red-black-tree-construction'
import { NodePosition, TreeLayout } from './tidy-layout'

export type Point = { x: number; y: number }
export type Dimension = { dx: number; dy: number }

const palette = {
  outlineColor: '#586e75',
  nodeFillColor: '#eee8d5',
  redNodeColor: '#dc322f',
}

export class TightNodePositioner {
  public nodeSpacing: number = 70
  public aspectRatio: number = 0.5

  constructor(
    private readonly canvasSize: Dimension,
    private readonly treeSize: Dimension
  ) {}

  placeOnCanvas([nodeX, nodeY]: NodePosition): Point {
    const x = (nodeX + 0.5) * this.nodeSpacingX
    const y = (nodeY + 0.5) * this.nodeSpacingY
    return this.placeOnCanvasCenterAligned({ x, y })
  }

  get totalTreeWidth() {
    return this.treeSize.dx * this.nodeSpacingX
  }

  get totalTreeHeight() {
    return this.treeSize.dy * this.nodeSpacingY
  }

  private placeOnCanvasCenterAligned(relPt: Point): Point {
    const offsetX = (this.canvasSize.dx - this.totalTreeWidth) / 2
    const offsetY = (this.canvasSize.dy - this.totalTreeHeight) / 2

    return { x: relPt.x + offsetX, y: relPt.y + offsetY }
  }

  private get nodeSpacingX() {
    return this.nodeSpacing * this.aspectRatio
  }

  private get nodeSpacingY() {
    return this.nodeSpacing
  }
}

class VisualNode {
  backgroundColor = palette.nodeFillColor

  isDisconnected: boolean = false

  constructor(
    readonly node: RedBlackNode,
    public position: Point,
    readonly left?: VisualNode,
    readonly right?: VisualNode
  ) {}

  draw(canvas: p5, parentCenter?: Point) {
    preserveSettings(canvas, () => {
      canvas.stroke(palette.outlineColor)
      if (parentCenter && !this.isDisconnected)
        this.connectToParent(canvas, parentCenter)
      preserveSettings(canvas, () => this.drawOutline(canvas))
      this.drawText(canvas)
    })
  }

  get value() {
    return this.node.value
  }

  private connectToParent(canvas: p5, parentCenter: Point) {
    canvas.line(
      this.position.x,
      this.position.y,
      parentCenter.x,
      parentCenter.y
    )
  }

  private drawOutline(canvas: p5) {
    if (isRed(this.node)) {
      canvas.stroke(palette.redNodeColor)
      canvas.strokeWeight(2)
    }
    canvas.fill(this.backgroundColor)
    canvas.circle(this.position.x, this.position.y, 40)
  }

  private drawText(canvas: p5) {
    canvas.textAlign('center', 'center')
    canvas.text(this.node.value, this.position.x, this.position.y)
  }
}

function preserveSettings(canvas: p5, action: () => void) {
  canvas.push()
  try {
    action()
  } finally {
    canvas.pop()
  }
}

export class TreeVisualization {
  readonly visualRoot: VisualNode | undefined
  private readonly nodePositioner: TightNodePositioner

  constructor(
    private readonly canvas: p5,
    private readonly layout: TreeLayout,
    root: RedBlackNode
  ) {
    this.nodePositioner = new TightNodePositioner(
      { dx: this.canvas.width, dy: this.canvas.height },
      { dx: this.layout.maxX + 1, dy: this.layout.maxY + 1 }
    )
    this.visualRoot = this.buildVisualTree(root)
  }

  getVisualNode(node: RedBlackNode): VisualNode {
    function find(
      root: VisualNode | undefined,
      target: RedBlackNode
    ): VisualNode | undefined {
      if (!root) return undefined
      if (root.node == target) return root
      return find(root.left, target) ?? find(root.right, target)
    }

    const result = find(this.visualRoot, node)
    if (!result) throw new Error('Node not found: ' + node.value)
    return result
  }

  draw() {
    if (!this.visualRoot) return
    this.drawSubTree(this.visualRoot)
  }

  get isOversized(): boolean {
    return (
      this.nodePositioner.totalTreeWidth > this.canvas.width ||
      this.nodePositioner.totalTreeHeight > this.canvas.height
    )
  }

  private buildVisualTree(
    node: RedBlackNode | undefined
  ): VisualNode | undefined {
    if (!node) return undefined

    const left = this.buildVisualTree(node.left)
    const right = this.buildVisualTree(node.right)
    const position = this.nodePositioner.placeOnCanvas(
      this.layout.getNodePosition(node)
    )
    return new VisualNode(node, position, left, right)
  }

  private drawSubTree(visual: VisualNode, parentCenter?: Point) {
    if (visual.left) this.drawSubTree(visual.left, visual.position)
    if (visual.right) this.drawSubTree(visual.right, visual.position)
    visual.draw(this.canvas, parentCenter)
  }
}
