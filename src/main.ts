import './style.css'
import P5 from 'p5'
import { TreeDrawer } from './drawing-tools'
import { tidyLayout } from './tidy-layout'
import { insert, RedBlackNode } from './red-black-tree'

const element = document.querySelector<HTMLDivElement>('#app')!

function interval(millis: number, action: () => void) {
  let lastInvoked = 0
  return (timeElapsed: number) => {
    if (lastInvoked + millis < timeElapsed) {
      action()
      lastInvoked = timeElapsed
    }
  }
}

const sketch = (p5: P5) => {
  let tree: RedBlackNode<string>

  const clearCanvas = () => p5.background('#fdf6e3')

  const drawer = interval(1000, () => {
    const letter = String.fromCharCode(Math.floor(Math.random() * 26) + 65)
    tree = insert(tree, letter)
    clearCanvas()
    new TreeDrawer(p5, tidyLayout(tree), tree).draw()
  })

  p5.setup = () => {
    p5.createCanvas(element.clientWidth, element.clientHeight)
    clearCanvas()
  }

  p5.draw = () => {
    return drawer(p5.millis())
  }
}

new P5(sketch, element)
