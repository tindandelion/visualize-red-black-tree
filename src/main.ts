import './style.css'
import P5 from 'p5'
import { TreeDrawer, TreeNode } from './drawing-tools'
import { tidyLayout } from './tidy-layout'

const element = document.querySelector<HTMLDivElement>('#app')!

const sketch = (p5: P5) => {
  const tree: TreeNode = {
    value: 'E',
    left: {
      value: 'A',
      right: { value: 'C' },
    },
    right: {
      value: 'S',
      left: { value: 'R' },
      right: { value: 'T' },
    },
  }

  const layout = tidyLayout(tree)

  p5.setup = () => {
    p5.createCanvas(element.clientWidth, element.clientHeight)
  }

  p5.draw = () => {
    new TreeDrawer(p5, layout, tree).draw()
  }
}

new P5(sketch, element)
