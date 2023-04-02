import p5 from 'p5'
import { isRed, LinkColor, RedBlackNode } from './red-black-tree'
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

export class VisualNode {
  constructor(
    readonly value: string,
    readonly color: LinkColor,
    public position: Point,
    readonly left?: VisualNode,
    readonly right?: VisualNode
  ) {}
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

  draw() {
    if (this.visualRoot) this.drawSubTree(this.visualRoot)
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
    return new VisualNode(node.value, node.color, position, left, right)
  }

  private drawTreeNode(visual: VisualNode, parentCenter?: Point) {
    this.preserveSettings(() => {
      this.canvas.stroke(palette.outlineColor)
      if (parentCenter) this.connectNodes(visual.position, parentCenter)
      this.drawNodeOutline(visual.position, isRed(visual))
      this.drawText(visual.value, visual.position)
    })
  }

  private connectNodes(nodeCenter: Point, parentCenter: Point) {
    this.canvas.line(nodeCenter.x, nodeCenter.y, parentCenter.x, parentCenter.y)
  }

  private drawNodeOutline(nodeCenter: Point, isRed: boolean) {
    this.preserveSettings(() => {
      if (isRed) {
        this.canvas.stroke(palette.redNodeColor)
        this.canvas.strokeWeight(2)
      }
      this.canvas.fill(palette.nodeFillColor)
      this.canvas.circle(nodeCenter.x, nodeCenter.y, 40)
    })
  }

  private drawText(value: string, nodeCenter: Point) {
    this.canvas.textAlign('center', 'center')
    this.canvas.text(value, nodeCenter.x, nodeCenter.y)
  }

  private drawSubTree(visual: VisualNode, parentCenter?: Point) {
    if (visual.left) this.drawSubTree(visual.left, visual.position)
    if (visual.right) this.drawSubTree(visual.right, visual.position)
    this.drawTreeNode(visual, parentCenter)
  }

  private preserveSettings(action: () => void) {
    this.canvas.push()
    try {
      action()
    } finally {
      this.canvas.pop()
    }
  }
}
