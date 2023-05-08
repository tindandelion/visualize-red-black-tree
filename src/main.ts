import { insert as insertRedBlack } from './tree-impl/red-black-tree'
import { insert as insertUnbalanced } from './tree-impl/unbalanced-tree'
import './style.css'
import { Visualizer } from './visualization/visualizer'

function randomChar() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
}

async function insertChar(vv: Visualizer[], char: string) {
  await Promise.all(vv.map((v) => v.insertChar(char)))
}

function restart(vv: Visualizer[]) {
  vv.forEach((v) => v.startAnimation())
}

function isAnyTreeOversized(vv: Visualizer[]) {
  return vv.some((v) => v.isOversized)
}

;(async () => {
  const rbtEl = document.querySelector<HTMLElement>('#rb-tree')!
  const unbalancedEl = document.querySelector<HTMLElement>('#bin-tree')!
  const visualizers = [
    new Visualizer(rbtEl, insertRedBlack),
    new Visualizer(unbalancedEl, insertUnbalanced),
  ]

  while (true) {
    await insertChar(visualizers, randomChar())
    if (isAnyTreeOversized(visualizers)) restart(visualizers)
  }
})()
