import './style.css'
import P5 from 'p5'
import { TreeVisualization } from './tree-visualization'
import { tidyLayout } from './tidy-layout'
import { RedBlackNode, insert } from './red-black-tree'
import {
  VisualizationTransition,
  VisualizationDelay,
  FinishedTransition,
  TransitionSequence,
  ParallelTransition,
} from './transitions'
import { moveNodes } from './move-nodes'

const element = document.querySelector<HTMLDivElement>('#app')!

function clearCanvas(p5: P5) {
  p5.background('#fdf6e3')
}

function expandTreeSketch(p5: P5) {
  let tree: RedBlackNode
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
      tree = insert(tree, randomChar())
      updatedVisualization = visualizeTree(tree)
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
    tree = insert(undefined, randomChar())
    currentVisualization = visualizeTree(tree)
    updatedVisualization = currentVisualization
    transition = FinishedTransition
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
