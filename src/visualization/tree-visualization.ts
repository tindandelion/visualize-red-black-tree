import p5 from 'p5'
import {
  LinkColor,
  RedBlackNode,
  RedBlackNode as _RedBlackNode,
  isRed,
} from '../red-black-tree-construction'
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

export class VisualNode implements RedBlackNode<string, VisualNode> {
  private static nextId = 0
  backgroundColor: string = palette.nodeFillColor
  isDisconnected: boolean = false

  public static make(value: string): VisualNode {
    const nodeId = this.nextId++
    return new VisualNode(nodeId, value, 'red', { x: 0, y: 0 })
  }

  constructor(
    readonly id: number,
    readonly value: string,
    readonly color: LinkColor,
    public position: Point,
    readonly left?: VisualNode,
    readonly right?: VisualNode
  ) {}

  draw(canvas: p5, parentCenter?: Point) {
    preserveSettings(canvas, () => {
      canvas.stroke(palette.outlineColor)
      if (parentCenter && !this.isDisconnected)
        preserveSettings(canvas, () =>
          this.connectToParent(canvas, parentCenter)
        )
      preserveSettings(canvas, () => this.drawOutline(canvas))
      this.drawText(canvas)
    })
  }

  private connectToParent(canvas: p5, parentCenter: Point) {
    if (isRed(this)) {
      canvas.stroke(palette.redNodeColor)
      canvas.strokeWeight(3)
    }
    canvas.line(
      this.position.x,
      this.position.y,
      parentCenter.x,
      parentCenter.y
    )
  }

  private drawOutline(canvas: p5) {
    canvas.fill(this.backgroundColor)
    canvas.circle(this.position.x, this.position.y, 40)
  }

  private drawText(canvas: p5) {
    canvas.textAlign('center', 'center')
    canvas.text(this.value, this.position.x, this.position.y)
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
  readonly visualRoot: VisualNode
  private readonly nodePositioner: TightNodePositioner

  constructor(
    private readonly canvas: p5,
    private readonly layout: TreeLayout,
    root: VisualNode
  ) {
    this.nodePositioner = new TightNodePositioner(
      { dx: this.canvas.width, dy: this.canvas.height },
      { dx: this.layout.maxX + 1, dy: this.layout.maxY + 1 }
    )
    this.visualRoot = this.buildVisualTree(root)
  }

  findNodeById(nodeId: number): VisualNode {
    function find(root: VisualNode | undefined): VisualNode | undefined {
      if (!root) return undefined
      if (root.id === nodeId) return root
      return find(root.left) ?? find(root.right)
    }

    const result = find(this.visualRoot)
    if (!result) throw new Error('Node not found by id: ' + nodeId)
    return result
  }

  draw() {
    this.drawSubTree(this.visualRoot)
  }

  get isOversized(): boolean {
    return (
      this.nodePositioner.totalTreeWidth > this.canvas.width ||
      this.nodePositioner.totalTreeHeight > this.canvas.height
    )
  }

  private buildVisualTree(node: VisualNode): VisualNode {
    const left = node.left && this.buildVisualTree(node.left)
    const right = node.right && this.buildVisualTree(node.right)
    const position = this.nodePositioner.placeOnCanvas(
      this.layout.getNodePosition(node)
    )
    return new VisualNode(
      node.id,
      node.value,
      node.color,
      position,
      left,
      right
    )
  }

  private drawSubTree(visual: VisualNode, parentCenter?: Point) {
    if (visual.left) this.drawSubTree(visual.left, visual.position)
    if (visual.right) this.drawSubTree(visual.right, visual.position)
    visual.draw(this.canvas, parentCenter)
  }
}
