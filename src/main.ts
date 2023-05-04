import { insert as insertRedBlack } from './tree-impl/red-black-tree'
import './style.css'
import { Visualizer } from './visualization/visualizer'

function randomChar() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
}

const visualizers = ['#rb-tree', '#bin-tree'].map((elId) => {
  const element = document.querySelector<HTMLDivElement>(elId)!
  return new Visualizer(element, insertRedBlack)
})

while (true) {
  const char = randomChar()
  await Promise.all(visualizers.map((v) => v.insertChar(char)))
}
