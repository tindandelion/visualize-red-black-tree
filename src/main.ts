import './style.css'
import P5 from 'p5'
import { NodePicture, RotateLeft } from './rotations'

const element = document.querySelector<HTMLDivElement>('#app')!

const sketch = (p5: P5) => {
  let root: NodePicture
  let right: NodePicture
  let rotateLeft: RotateLeft

  p5.setup = () => {
    p5.createCanvas(element.clientWidth, element.clientHeight)
    root = new NodePicture({ x: p5.width / 2, y: 100 }, 'E')
    right = new NodePicture({ x: root.position.x + 60, y: 200 }, 'S')
    rotateLeft = new RotateLeft(root, right)
  }

  p5.draw = () => {
    const timeElapsed = p5.millis()

    if (rotateLeft.isInProgress(timeElapsed)) rotateLeft.step(timeElapsed)

    p5.clear(255, 255, 255, 255)
    root.draw(p5)
    right.draw(p5)
  }
}

new P5(sketch, element)
