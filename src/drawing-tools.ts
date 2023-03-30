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

export class TreeDrawer {
  private readonly nodePositioner: TightNodePositioner

  constructor(
    private readonly canvas: p5,
    private readonly layout: TreeLayout,
    private readonly root: TreeNode
  ) {
    this.nodePositioner = new TightNodePositioner(
      { dx: this.canvas.width, dy: this.canvas.height },
      { dx: this.layout.maxX + 1, dy: this.layout.maxY + 1 }
    )
  }

  draw() {
    this.drawSubTree(this.root)
  }

  private drawTreeNode(
    node: TreeNode,
    nodeCenter: Point,
    parentCenter?: Point
  ) {
    this.preserveSettings(() => {
      this.canvas.stroke('#586e75')
      if (parentCenter) this.connectNodes(nodeCenter, parentCenter, isRed(node))
      this.drawNodeOutline(nodeCenter)
      this.drawText(node.value, nodeCenter)
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

  private drawSubTree(node: TreeNode, parentCenter?: Point) {
    const nodeCenter = this.nodePositioner.placeOnCanvas(
      this.layout.getNodePosition(node)
    )
    if (node.left) this.drawSubTree(node.left, nodeCenter)
    if (node.right) this.drawSubTree(node.right, nodeCenter)
    this.drawTreeNode(node, nodeCenter, parentCenter)
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
