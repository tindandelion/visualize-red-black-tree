import { insert as insertRedBlack } from './tree-impl/red-black-tree'
import { insert as insertUnbalanced } from './tree-impl/unbalanced-tree'
import { Visualizer } from './visualization/visualizer'

function shuffle<T>(a: T[]) {
  const n = a.length
  for (let i = 0; i < n; i++) {
    const r = Math.floor(Math.random() * (n - i))
    const tmp = a[i]
    a[i] = a[r]
    a[r] = tmp
  }
}

function shuffledArray(): string[] {
  const chars = [...Array(26).keys()].map((k) => String.fromCharCode(k + 65))
  shuffle(chars)
  return chars
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
  const visualizers = await Promise.all([
    Visualizer.make(rbtEl, insertRedBlack),
    Visualizer.make(unbalancedEl, insertUnbalanced),
  ])

  let chars = shuffledArray()
  while (true) {
    await insertChar(visualizers, chars.pop()!)
    if (isAnyTreeOversized(visualizers) || chars.length === 0) {
      chars = shuffledArray()
      restart(visualizers)
    }
  }
})()
