import { insert as insertRedBlack } from './tree-impl/red-black-tree'
import { insert as insertUnbalanced } from './tree-impl/unbalanced-tree'
import './style.css'
import { Visualizer } from './visualization/visualizer'

function randomChar() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
}

const visualizers: Visualizer[] = []

const rbtEl = document.querySelector<HTMLElement>('#rb-tree')!
visualizers.push(new Visualizer(rbtEl, insertRedBlack))

const unbalancedEl = document.querySelector<HTMLElement>('#bin-tree')!
visualizers.push(new Visualizer(unbalancedEl, insertUnbalanced))

while (true) {
  const char = randomChar()
  await Promise.all(visualizers.map((v) => v.insertChar(char)))
}
