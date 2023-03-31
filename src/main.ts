import './style.css'
import P5 from 'p5'
import { VisualTree, TreeNode } from './drawing-tools'
import { tidyLayout } from './tidy-layout'
import { insert } from './red-black-tree'
import {
  AnimationClip,
  AnimationDelay,
  AnimationSequence,
  FinishedAnimation,
} from './animations'

const element = document.querySelector<HTMLDivElement>('#app')!

function clearCanvas(p5: P5) {
  p5.background('#fdf6e3')
}

function expandTreeSketch(p5: P5) {
  let tree: TreeNode
  let visualTree: VisualTree
  let animationClip: AnimationClip = FinishedAnimation

  p5.setup = () => {
    p5.createCanvas(element.clientWidth, element.clientHeight)
    clearCanvas(p5)
  }

  p5.draw = () => {
    if (animationClip.isFinished) {
      animationClip = updateTree()
    }
    animationClip.drawFrame(p5)
  }

  function updateTree() {
    const letter = String.fromCharCode(Math.floor(Math.random() * 26) + 65)
    if (!visualTree || visualTree.isOversized) tree = insert(undefined, letter)
    else tree = insert(tree, letter)
    visualTree = makeVisualTree(tree)
    return nextAnimationClip()
  }

  function nextAnimationClip(): AnimationClip {
    return new AnimationSequence([
      new StaticTreeAnimation(visualTree),
      new AnimationDelay(),
    ])
  }

  function makeVisualTree(tree: TreeNode): VisualTree {
    return new VisualTree(p5, tidyLayout(tree), tree)
  }
}

class StaticTreeAnimation implements AnimationClip {
  private hasBeenDrawn = false
  constructor(private readonly tree: VisualTree) {}

  drawFrame(p5: P5): void {
    clearCanvas(p5)
    this.tree.draw()
    this.hasBeenDrawn = true
  }

  get isFinished() {
    return this.hasBeenDrawn
  }
}

new P5(expandTreeSketch, element)
