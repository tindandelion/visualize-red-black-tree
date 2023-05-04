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

function* generateTree(): Generator<Mutation<VisualNode>> {
  let mutations = insert(VisualNode.make(randomChar()))
  while (true) {
    let tree
    for (const m of mutations) {
      yield m
      tree = m.result
    }
    mutations = insert(VisualNode.make(randomChar()), tree)
  }
}

function* emptyGenerator() {}

class Visualizer {
  private readonly p5: P5
  private mutationGenerator: Generator<Mutation<VisualNode>> = emptyGenerator()
  private currentVisualization?: TreeVisualization
  private nextVisualization?: TreeVisualization
  private transition: VisualizationTransition = FinishedTransition
  private insertionComplete = Promise.resolve()

  constructor(element: HTMLElement) {
    const sketch = (p5: P5) => {
      p5.setup = () => this.setup(element.clientWidth, element.clientHeight)
      p5.draw = () => this.draw()
    }
    this.p5 = new P5(sketch, element)

    new ResizeObserver(([{ contentRect }]) =>
      this.p5.resizeCanvas(contentRect.right, contentRect.bottom)
    ).observe(element)
  }

  private setup(width: number, height: number) {
    this.p5.createCanvas(width, height)
    this.startAnimation()
  }

  private draw() {
    if (!this.currentVisualization) return

    this.updateCurrentVisualization()
    if (!this.transition.isFinished) return

    if (this.nextVisualization) this.finalizeTransition()
    else this.generateNextVisualization()
  }

  private updateCurrentVisualization() {
    this.transition.update(this.p5.millis())
    this.p5.background('#fdf6e3')
    this.currentVisualization!.draw()
  }

  private finalizeTransition() {
    this.currentVisualization = this.nextVisualization
    this.nextVisualization = undefined
    this.transition = FinishedTransition
  }

  private generateNextVisualization() {
    const mutation = this.nextMutation()
    this.nextVisualization = this.visualizeTree(mutation.result)
    if (this.nextVisualization.isOversized) this.startAnimation()
    else
      this.transition = this.createTransition(
        mutation,
        this.currentVisualization!,
        this.nextVisualization
      )
  }

  private startAnimation() {
    this.mutationGenerator = generateTree()
    const currentMutation = this.nextMutation()
    this.currentVisualization = this.visualizeTree(currentMutation.result)
    this.nextVisualization = undefined
    this.transition = FinishedTransition
  }

  private nextMutation() {
    return this.mutationGenerator.next().value
  }

  private visualizeTree(tree: VisualNode): TreeVisualization {
    return new TreeVisualization(this.p5, tidyLayout(tree), tree)
  }

  private createTransition(
    mutation: Mutation<VisualNode>,
    current: TreeVisualization,
    updated: TreeVisualization
  ) {
    const transitions: VisualizationTransition[] = rearrangeTreeNodes(
      current.visualRoot,
      updated.visualRoot
    )

    if (mutation.kind === 'flip-colors') {
      const visual = current.findNodeById(mutation.node!.id)
      transitions.push(
        new HighlightNode(visual, this.lerpHighlightColor.bind(this))
      )
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

  private lerpHighlightColor(startColor: any, amount: number) {
    const dest = this.p5.color('#dc322f')
    const start = this.p5.color(startColor)
    return this.p5.lerpColor(start, dest, amount)
  }
}

function createVisualizer(elementId: string) {
  const element = document.querySelector<HTMLDivElement>(elementId)!
  return new Visualizer(element)
}

createVisualizer('#rb-tree')
createVisualizer('#bin-tree')
