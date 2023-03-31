import p5 from 'p5'
import { isRed, RedBlackNode } from './red-black-tree'
import { NodePosition, TreeLayout } from './tidy-layout'

export type Point = { x: number; y: number }
export type Dimension = { dx: number; dy: number }

export type TreeNode = RedBlackNode<string>

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

  private placeOnCanvasCenterAligned(relPt: Point): Point {
    const totalTreeWidth = this.treeSize.dx * this.nodeSpacingX
    const offsetX = (this.canvasSize.dx - totalTreeWidth) / 2

    const totalTreeHeight = this.treeSize.dy * this.nodeSpacingY
    const offsetY = (this.canvasSize.dy - totalTreeHeight) / 2

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
    readonly node: TreeNode,
    readonly position: Point,
    readonly left?: VisualNode,
    readonly right?: VisualNode
  ) {}
}

export class VisualTree {
  readonly visualRoot: VisualNode | undefined

  constructor(
    private readonly canvas: p5,
    private readonly layout: TreeLayout,
    root: TreeNode
  ) {
    const nodePositioner = new TightNodePositioner(
      { dx: this.canvas.width, dy: this.canvas.height },
      { dx: this.layout.maxX + 1, dy: this.layout.maxY + 1 }
    )
    this.visualRoot = this.buildVisualTree(root, nodePositioner)
  }

  draw() {
    if (this.visualRoot) this.drawSubTree(this.visualRoot)
  }

  private buildVisualTree(
    node: TreeNode | undefined,
    positioner: TightNodePositioner
  ): VisualNode | undefined {
    if (!node) return undefined

    const left = this.buildVisualTree(node.left, positioner)
    const right = this.buildVisualTree(node.right, positioner)
    const position = positioner.placeOnCanvas(this.layout.getNodePosition(node))
    return new VisualNode(node, position, left, right)
  }

  private drawTreeNode(visual: VisualNode, parentCenter?: Point) {
    this.preserveSettings(() => {
      this.canvas.stroke('#586e75')
      if (parentCenter)
        this.connectNodes(visual.position, parentCenter, isRed(visual.node))
      this.drawNodeOutline(visual.position)
      this.drawText(visual.node.value, visual.position)
    })
  }

  private connectNodes(nodeCenter: Point, parentCenter: Point, isRed: boolean) {
    this.preserveSettings(() => {
      if (isRed) {
        this.canvas.stroke('#dc322f')
        this.canvas.strokeWeight(5)
      }
      this.canvas.line(
        nodeCenter.x,
        nodeCenter.y,
        parentCenter.x,
        parentCenter.y
      )
    })
  }

  private drawNodeOutline(nodeCenter: Point) {
    this.preserveSettings(() => {
      this.canvas.fill('#eee8d5')
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
