import './style.css'
import P5 from 'p5'
import { TreeDrawer, TreeNode } from './drawing-tools'
import { tidyLayout } from './tidy-layout'
import { insert, RedBlackNode } from './red-black-tree'

const element = document.querySelector<HTMLDivElement>('#app')!

function interval(millis: number, action: () => void) {
  let lastInvoked = 0
  return (timeElapsed: number) => {
    if (lastInvoked + millis < timeElapsed) {
      action()
      lastInvoked = timeElapsed
    }
  }
}

function clearCanvas(p5: P5) {
  p5.background('#fdf6e3')
}

function addNodesSketch(p5: P5) {
  let tree: RedBlackNode<string>

  const drawer = interval(1000, () => {
    const letter = String.fromCharCode(Math.floor(Math.random() * 26) + 65)
    tree = insert(tree, letter)
    clearCanvas(p5)
    new TreeDrawer(p5, tidyLayout(tree), tree).draw()
  })

  p5.setup = () => {
    p5.createCanvas(element.clientWidth, element.clientHeight)
    clearCanvas(p5)
  }

  p5.draw = () => {
    return drawer(p5.millis())
  }
}

function expandTreeSketch(p5: P5) {
  let tree = createTree()
  let animationClip: AnimationClip = new FinishedAnimation()

  p5.setup = () => {
    p5.createCanvas(element.clientWidth, element.clientHeight)

    clearCanvas(p5)
    scheduleAddElement('A')
  }

  p5.draw = () => {
    clearCanvas(p5)
    if (animationClip.isFinished) {
      animationClip = nextAnimationClip(tree)
    }
    animationClip.drawFrame(p5)
  }

  function createTree() {
    let tree = insert(undefined, 'D')
    tree = insert(tree, 'C')
    tree = insert(tree, 'E')
    return tree
  }

  function scheduleAddElement(value: string) {
    setTimeout(() => {
      tree = insert(tree, value)
    }, 1000)
  }

  function nextAnimationClip(tree: TreeNode): AnimationClip {
    return new StaticTreeAnimation(tree)
  }
}

interface AnimationClip {
  readonly isFinished: boolean
  drawFrame(p5: P5): void
}

class FinishedAnimation implements AnimationClip {
  public readonly isFinished: boolean = true

  drawFrame(_p5: P5) {}
}

class StaticTreeAnimation implements AnimationClip {
  private hasBeenDrawn = false
  constructor(private readonly tree: TreeNode) {}

  drawFrame(p5: P5): void {
    new TreeDrawer(p5, tidyLayout(this.tree), this.tree).draw()
  }

  get isFinished() {
    return this.hasBeenDrawn
  }
}

new P5(expandTreeSketch, element)
