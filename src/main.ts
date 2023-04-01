import './style.css'
import P5 from 'p5'
import { TreeVisualization, TreeNode } from './tree-visualization'
import { tidyLayout } from './tidy-layout'
import { insert } from './red-black-tree'
import {
  VisualizationTransition,
  VisualizationDelay,
  FinishedTransition,
} from './transitions'

const element = document.querySelector<HTMLDivElement>('#app')!

function clearCanvas(p5: P5) {
  p5.background('#fdf6e3')
}

function expandTreeSketch(p5: P5) {
  let tree: TreeNode = updateSourceTree(true)
  let currentVisualization: TreeVisualization
  let updatedVisualization: TreeVisualization
  let transition: VisualizationTransition = FinishedTransition

  p5.setup = () => {
    p5.createCanvas(element.clientWidth, element.clientHeight)
    clearCanvas(p5)
    updatedVisualization = visualizeTree(tree)
  }

  p5.draw = () => {
    if (transition.isFinished) {
      currentVisualization = updatedVisualization
      tree = updateSourceTree(currentVisualization.isOversized)
      updatedVisualization = visualizeTree(tree)
      transition = createTransition(currentVisualization, updatedVisualization)
    }
    transition.update(p5.millis())
    clearCanvas(p5)
    currentVisualization.draw()
  }

  function updateSourceTree(startOver: boolean) {
    const letter = String.fromCharCode(Math.floor(Math.random() * 26) + 65)
    if (startOver) return insert(undefined, letter)
    else return insert(tree, letter)
  }

  function createTransition(
    current: TreeVisualization,
    updated: TreeVisualization
  ) {
    return new VisualizationDelay()
  }

  function visualizeTree(tree: TreeNode): TreeVisualization {
    return new TreeVisualization(p5, tidyLayout(tree), tree)
  }
}

new P5(expandTreeSketch, element)
