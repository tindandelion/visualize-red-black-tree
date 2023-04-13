import './style.css'
import P5 from 'p5'
import {
  StringTreeNode,
  TreeVisualization,
} from './visualization/tree-visualization'
import { tidyLayout } from './visualization/tidy-layout'
import {
  VisualizationTransition,
  VisualizationDelay,
  FinishedTransition,
  TransitionSequence,
  ParallelTransition,
} from './transitions/base-transitions'
import { expandTree } from './transitions/expand-tree'
import { Mutation, insert } from './red-black-tree-construction'
import { HighlightNode } from './transitions/highlight-node'
import { RotateTransition } from './transitions/rotations'

function randomChar() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
}

function expandTreeSketch(p5: P5) {
  let mutationsToVisualize: Mutation<StringTreeNode>[] = []
  let currentMutation: Mutation<StringTreeNode>
  let currentVisualization: TreeVisualization
  let nextVisualization: TreeVisualization | undefined
  let transition: VisualizationTransition = FinishedTransition

  p5.setup = () => {
    p5.createCanvas(element.clientWidth, element.clientHeight)
    startAnimation()
  }

  p5.draw = () => {
    transition.update(p5.millis())
    draw(currentVisualization)

    if (!transition.isFinished) return

    if (nextVisualization) {
      currentVisualization = nextVisualization
      nextVisualization = undefined
      transition = FinishedTransition
    } else {
      currentMutation = nextMutationToVisualize()
      nextVisualization = visualizeTree(currentMutation.result)
      if (nextVisualization.isOversized) startAnimation()
      else
        transition = createTransition(
          currentMutation,
          currentVisualization,
          nextVisualization
        )
    }
  }

  function draw(v: TreeVisualization) {
    p5.background('#fdf6e3')
    v.draw()
  }

  function newNode(value: string): StringTreeNode {
    return { value, color: 'red' }
  }

  function startAnimation() {
    mutationsToVisualize = [...insert(newNode(randomChar()))]
    currentMutation = nextMutationToVisualize()
    currentVisualization = visualizeTree(currentMutation.result)
    nextVisualization = undefined
    transition = FinishedTransition
  }

  function nextMutationToVisualize() {
    if (mutationsToVisualize.length === 0)
      mutationsToVisualize = [
        ...insert(newNode(randomChar()), currentMutation.result),
      ]

    return mutationsToVisualize.shift()!
  }

  function visualizeTree(tree: StringTreeNode): TreeVisualization {
    return new TreeVisualization(p5, tidyLayout(tree), tree)
  }

  function nodeHighlightInterpolator(startColor: any, amount: number) {
    const dest = p5.color('#dc322f')
    const start = p5.color(startColor)
    return p5.lerpColor(start, dest, amount)
  }

  function createTransition(
    mutation: Mutation<StringTreeNode>,
    current: TreeVisualization,
    updated: TreeVisualization
  ) {
    if (!current.visualRoot || !updated.visualRoot) return FinishedTransition

    let transition: VisualizationTransition = FinishedTransition
    if (mutation.kind === 'insert') {
      const expandTransitions = expandTree(
        current.visualRoot,
        updated.visualRoot
      )
      transition = new ParallelTransition(expandTransitions)
    } else if (mutation.kind === 'flip-colors') {
      const visual = current.getVisualNode(mutation.node!)
      transition = new HighlightNode(visual, nodeHighlightInterpolator)
    } else if (mutation.kind === 'rotate-left') {
      const visual = current.getVisualNode(mutation.node!)
      transition = new RotateTransition(visual, 'left')
    } else if (mutation.kind === 'rotate-right') {
      const visual = current.getVisualNode(mutation.node!)
      transition = new RotateTransition(visual, 'right')
    }

    return new TransitionSequence([new VisualizationDelay(500), transition])
  }
}

const element = document.querySelector<HTMLDivElement>('#app')!
new P5(expandTreeSketch, element)
