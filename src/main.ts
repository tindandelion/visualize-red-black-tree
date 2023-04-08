import './style.css'
import P5 from 'p5'
import { TreeVisualization } from './tree-visualization'
import { tidyLayout } from './tidy-layout'
import {
  VisualizationTransition,
  VisualizationDelay,
  FinishedTransition,
  TransitionSequence,
  ParallelTransition,
} from './transitions'
import { moveNodes } from './move-nodes'
import { RedBlackNode, insert } from './red-black-tree-iterations'

const element = document.querySelector<HTMLDivElement>('#app')!

function clearCanvas(p5: P5) {
  p5.background('#fdf6e3')
}

function expandTreeSketch(p5: P5) {
  let trees: RedBlackNode[] = []
  let currentTree: RedBlackNode
  let currentVisualization: TreeVisualization
  let updatedVisualization: TreeVisualization
  let transition: VisualizationTransition = FinishedTransition

  p5.setup = () => {
    p5.createCanvas(element.clientWidth, element.clientHeight)
    clearCanvas(p5)
    startAnimation()
  }

  p5.draw = () => {
    if (transition.isFinished) {
      currentVisualization = updatedVisualization
      currentTree = nextTreeToVisualize()
      updatedVisualization = visualizeTree(currentTree)
      if (updatedVisualization.isOversized) startAnimation()
      else
        transition = createTransition(
          currentVisualization,
          updatedVisualization
        )
    }
    transition.update(p5.millis())
    clearCanvas(p5)
    currentVisualization.draw()
  }

  function startAnimation() {
    trees = [...insert(randomChar())].map((m) => m.result)
    currentTree = nextTreeToVisualize()
    currentVisualization = visualizeTree(currentTree)
    updatedVisualization = currentVisualization
    transition = FinishedTransition
  }

  function nextTreeToVisualize(): RedBlackNode {
    if (trees.length === 0)
      trees = [...insert(randomChar(), currentTree)].map((m) => m.result)
    return trees.shift()!
  }

  function randomChar() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
  }

  function createTransition(
    current: TreeVisualization,
    updated: TreeVisualization
  ) {
    if (!current.visualRoot || !updated.visualRoot) return FinishedTransition

    const transitions = moveNodes(current.visualRoot, updated.visualRoot)
    return new TransitionSequence([
      new VisualizationDelay(500),
      new ParallelTransition([...transitions]),
    ])
  }

  function visualizeTree(tree: RedBlackNode): TreeVisualization {
    return new TreeVisualization(p5, tidyLayout(tree), tree)
  }
}

new P5(expandTreeSketch, element)
