import './style.css'
import P5 from 'p5'

class NodePicture {
  private static readonly RADIUS = 50

  constructor(readonly x: number, readonly y: number, readonly value: any) {}

  draw(canvas: P5) {
    canvas.circle(this.x, this.y, NodePicture.RADIUS)
    canvas.textAlign(canvas.CENTER, canvas.CENTER)
    canvas.textSize(20)
    canvas.text(this.value, this.x, this.y)
  }

  drawConnectionTo(other: NodePicture, canvas: P5) {
    canvas.line(this.x, this.y, other.x, other.y)
  }

  isAtSamePositionAs(other: NodePicture) {
    return this.x === other.x && this.y === other.y
  }
}

const element = document.querySelector<HTMLDivElement>('#app')!

const sketch = (p5: P5) => {
  const duration = 1000

  let root: NodePicture
  let right: NodePicture
  let left: NodePicture

  p5.setup = () => {
    p5.createCanvas(element.clientWidth, element.clientHeight)
    root = new NodePicture(p5.width / 2, 100, 'E')
    right = new NodePicture(root.x + 60, 200, 'S')
    left = new NodePicture(root.x - 60, 200, '')
  }

  p5.draw = () => {
    const timeElapsed = p5.millis()
    if (timeElapsed > duration) return

    const rootRotAngle = -(Math.PI / (2 * duration)) * timeElapsed
    const rightRotAngle = rootRotAngle - (3 * Math.PI) / 2

    const rotCenterX = root.x
    const rotCenterY = right.y

    const radiusX = right.x - root.x
    const radiusY = right.y - root.y
    const scale = radiusX / radiusY

    const newRootX =
      (Math.cos(rootRotAngle) * (root.x - rotCenterX) -
        Math.sin(rootRotAngle) * (root.y - rotCenterY)) *
        scale +
      rotCenterX

    const newRootY =
      Math.sin(rootRotAngle) * (root.x - rotCenterX) +
      Math.cos(rootRotAngle) * (root.y - rotCenterY) +
      rotCenterY

    const rootTemp = new NodePicture(newRootX, newRootY, root.value)
    const newRightX =
      (Math.cos(rightRotAngle) * (root.x - rotCenterX) -
        Math.sin(rightRotAngle) * (root.y - rotCenterY)) *
        scale +
      rotCenterX

    const newRightY =
      Math.sin(rightRotAngle) * (root.x - rotCenterX) +
      Math.cos(rightRotAngle) * (root.y - rotCenterY) +
      rotCenterY
    const rightTemp = new NodePicture(newRightX, newRightY, right.value)

    p5.clear(255, 255, 255, 255)
    p5.circle(rotCenterX, rotCenterY, 10)
    left.draw(p5)
    rightTemp.draw(p5)
    rootTemp.draw(p5)
    root.draw(p5)
  }
}

new P5(sketch, element)
