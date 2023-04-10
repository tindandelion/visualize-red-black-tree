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
import { Mutation, RedBlackNode, insert } from './red-black-tree-construction'
import { HighlightNode } from './highlight-node'

const element = document.querySelector<HTMLDivElement>('#app')!

function clearCanvas(p5: P5) {
  p5.background('#fdf6e3')
}

function expandTreeSketch(p5: P5) {
  let mutations: Mutation[] = []
  let currentMutation: Mutation
  let currentVisualization: TreeVisualization
  let updatedVisualization: TreeVisualization | undefined
  let transition: VisualizationTransition = FinishedTransition

  p5.setup = () => {
    p5.createCanvas(element.clientWidth, element.clientHeight)
    clearCanvas(p5)
    startAnimation()
  }

  p5.draw = () => {
    transition.update(p5.millis())
    clearCanvas(p5)
    currentVisualization.draw()

    if (!transition.isFinished) return

    if (updatedVisualization) {
      currentVisualization = updatedVisualization
      updatedVisualization = undefined
      transition = FinishedTransition
      clearCanvas(p5)
      currentVisualization.draw()
    } else {
      currentMutation = nextMutationToVisualize()
      updatedVisualization = visualizeTree(currentMutation.result)
      if (updatedVisualization.isOversized) startAnimation()
      else
        transition = createTransition(
          currentMutation,
          currentVisualization,
          updatedVisualization
        )
    }
  }

  function startAnimation() {
    mutations = [...insert(randomChar())]
    currentMutation = nextMutationToVisualize()
    currentVisualization = visualizeTree(currentMutation.result)
    updatedVisualization = undefined
    transition = FinishedTransition
  }

  function nextMutationToVisualize() {
    if (mutations.length === 0)
      mutations = [...insert(randomChar(), currentMutation.result)]

    return mutations.shift()!
  }

  function randomChar() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
  }

  function visualizeTree(tree: RedBlackNode): TreeVisualization {
    return new TreeVisualization(p5, tidyLayout(tree), tree)
  }
}

function createTransition(
  mutation: Mutation,
  current: TreeVisualization,
  updated: TreeVisualization
) {
  if (!current.visualRoot || !updated.visualRoot) return FinishedTransition

  let transition: VisualizationTransition = FinishedTransition

  if (mutation.kind === 'insert') {
    const moveTransitions = moveNodes(current.visualRoot, updated.visualRoot)
    transition = new ParallelTransition(moveTransitions)
  } else if (mutation.kind === 'flip-colors') {
    const visual = current.getVisualNode(mutation.node!)
    if (visual) transition = new HighlightNode(visual)
  }

  return new TransitionSequence([new VisualizationDelay(500), transition])
}

new P5(expandTreeSketch, element)
