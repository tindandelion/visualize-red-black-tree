import P5 from 'p5'

export type Position = {
  x: number
  y: number
}

export type Dimension = {
  dx: number
  dy: number
}

export class NodePicture {
  private static readonly RADIUS = 50

  constructor(public position: Position, readonly value: any) {}

  draw(canvas: P5) {
    canvas.circle(this.position.x, this.position.y, NodePicture.RADIUS)
    canvas.textAlign(canvas.CENTER, canvas.CENTER)
    canvas.textSize(20)
    canvas.text(this.value, this.position.x, this.position.y)
  }

  drawConnectionTo(other: NodePicture, canvas: P5) {
    canvas.line(
      this.position.x,
      this.position.y,
      other.position.x,
      other.position.y
    )
  }

  isAtSamePositionAs(other: NodePicture) {
    return (
      this.position.x === other.position.x &&
      this.position.y === other.position.y
    )
  }
}

export class RotateLeft {
  private static duration = 1000

  private rotCenter: Position
  private rotRadius: Dimension

  constructor(private root: NodePicture, private right: NodePicture) {
    this.rotCenter = { x: root.position.x, y: right.position.y }
    this.rotRadius = {
      dx: right.position.x - root.position.x,
      dy: right.position.y - root.position.y,
    }
  }

  isInProgress(timeElapsed: number) {
    return timeElapsed < RotateLeft.duration
  }

  step(timeElapsed: number) {
    const rightAngle = -(Math.PI / (2 * RotateLeft.duration)) * timeElapsed
    const rootAngle = rightAngle - Math.PI / 2
    this.root.position = this.positionAtAngle(rootAngle)
    this.right.position = this.positionAtAngle(rightAngle)
  }

  private positionAtAngle(angle: number) {
    return {
      x: this.rotCenter.x + this.rotRadius.dx * Math.cos(angle),
      y: this.rotCenter.y + this.rotRadius.dy * Math.sin(angle),
    }
  }
}
