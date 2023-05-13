import P5 from 'p5'
import { TreeVisualization, VisualNode } from './tree-visualization'
import { tidyLayout } from './tidy-layout'
import {
  VisualizationTransition,
  VisualizationDelay,
  FinishedTransition,
  TransitionSequence,
  ParallelTransition,
} from '../transitions/base-transitions'
import { HighlightNode } from '../transitions/highlight-node'
import { RotateTransition } from '../transitions/rotations'
import { rearrangeTreeNodes } from '../transitions/rearrange-tree'
import { Mutation } from '../tree-impl/common'

interface InsertionFunction {
  (nodeToInsert: VisualNode, root?: VisualNode): Generator<Mutation<VisualNode>>
}

export class Visualizer {
  private readonly p5: P5
  private currentVisualization?: TreeVisualization
  private nextVisualization?: TreeVisualization
  private transition: VisualizationTransition = FinishedTransition
  private onInsertionComplete = () => {}
  private mutations: Mutation<VisualNode>[] = []

  constructor(
    element: HTMLElement,
    private readonly inserter: InsertionFunction
  ) {
    const sketch = (p5: P5) => {
      p5.setup = () => this.setup(element.clientWidth, element.clientHeight)
      p5.draw = () => this.draw()
    }
    this.p5 = new P5(sketch, element)
    new ResizeObserver(() =>
      this.p5.resizeCanvas(element.clientWidth, element.clientHeight)
    ).observe(element)
  }

  insertChar(char: string): Promise<void> {
    this.mutations = [
      ...this.inserter(
        VisualNode.make(char),
        this.currentVisualization?.visualRoot
      ),
    ]
    return new Promise<void>((resolve) => {
      this.onInsertionComplete = resolve
    })
  }

  get isOversized() {
    return !!this.currentVisualization?.isOversized
  }

  startAnimation() {
    this.currentVisualization = undefined
    this.nextVisualization = undefined
    this.transition = FinishedTransition
    this.onInsertionComplete()
  }

  private setup(width: number, height: number) {
    const cnv = this.p5.createCanvas(width, height)
    cnv.style('display', 'block')
    this.startAnimation()
  }

  private draw() {
    if (!this.currentVisualization) {
      this.currentVisualization = this.createInitialVisualization()
      if (!this.currentVisualization) return
    }

    this.updateCurrentVisualization()
    if (!this.transition.isFinished) return

    if (this.nextVisualization) this.finalizeTransition()
    else this.generateNextVisualization()
  }

  private createInitialVisualization() {
    const mutation = this.nextMutation()
    return mutation && this.visualizeTree(mutation.result)
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
    if (!mutation) {
      this.onInsertionComplete()
      return
    }
    this.nextVisualization = this.visualizeTree(mutation.result)
    this.transition = this.createTransition(
      mutation,
      this.currentVisualization!,
      this.nextVisualization
    )
  }

  private nextMutation() {
    return this.mutations.shift()
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
