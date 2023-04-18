import './style.css'
import P5 from 'p5'
import {
  TreeVisualization,
  VisualNode,
} from './visualization/tree-visualization'
import { tidyLayout } from './visualization/tidy-layout'
import {
  VisualizationTransition,
  VisualizationDelay,
  FinishedTransition,
  TransitionSequence,
  ParallelTransition,
} from './transitions/base-transitions'
import { Mutation, insert } from './red-black-tree-construction'
import { HighlightNode } from './transitions/highlight-node'
import { RotateTransition } from './transitions/rotations'
import { rearrangeTreeNodes } from './transitions/rearrange-tree'

function randomChar() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
}

function expandTreeSketch(p5: P5) {
  let mutationsToVisualize: Mutation<VisualNode>[] = []
  let currentMutation: Mutation<VisualNode>
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

  function startAnimation() {
    mutationsToVisualize = [...insert(VisualNode.make(randomChar()))]
    currentMutation = nextMutationToVisualize()
    currentVisualization = visualizeTree(currentMutation.result)
    nextVisualization = undefined
    transition = FinishedTransition
  }

  function nextMutationToVisualize() {
    if (mutationsToVisualize.length === 0)
      mutationsToVisualize = [
        ...insert(VisualNode.make(randomChar()), currentMutation.result),
      ]

    return mutationsToVisualize.shift()!
  }

  function visualizeTree(tree: VisualNode): TreeVisualization {
    return new TreeVisualization(p5, tidyLayout(tree), tree)
  }

  function nodeHighlightInterpolator(startColor: any, amount: number) {
    const dest = p5.color('#dc322f')
    const start = p5.color(startColor)
    return p5.lerpColor(start, dest, amount)
  }

  function createTransition(
    mutation: Mutation<VisualNode>,
    current: TreeVisualization,
    updated: TreeVisualization
  ) {
    if (!current.visualRoot || !updated.visualRoot) return FinishedTransition

    const transitions: VisualizationTransition[] = rearrangeTreeNodes(
      current.visualRoot,
      updated.visualRoot
    )

    if (mutation.kind === 'flip-colors') {
      const visual = current.findNodeById(mutation.node!.id)
      transitions.push(new HighlightNode(visual, nodeHighlightInterpolator))
    } else if (mutation.kind === 'rotate-left') {
      const visual = current.findNodeById(mutation.node!.id)
      transitions.push(new RotateTransition(visual, 'left'))
    } else if (mutation.kind === 'rotate-right') {
      const visual = current.findNodeById(mutation.node!.id)
      transitions.push(new RotateTransition(visual, 'right'))
    }
    const transition = new ParallelTransition(transitions)
    return new TransitionSequence([new VisualizationDelay(500), transition])
  }
}

const element = document.querySelector<HTMLDivElement>('#app')!
new P5(expandTreeSketch, element)
