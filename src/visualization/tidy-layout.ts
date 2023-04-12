export interface TreeNodeLinks {
  left?: this
  right?: this
}

export type NodePosition = [number, number]

export class TreeLayout {
  readonly maxX: number
  readonly maxY: number
  constructor(
    private readonly nodePositions: Map<TreeNodeLinks, NodePosition>
  ) {
    this.maxX = this.findMaxX()
    this.maxY = this.findMaxY()
  }

  getNodePosition(node: TreeNodeLinks): NodePosition {
    const result = this.nodePositions.get(node)
    if (!result) throw new Error(`Position not found for node[${node}]`)
    return result
  }

  private findMaxX() {
    const xx = [...this.nodePositions.values()].map(([x, _]) => x)
    return Math.max(...xx)
  }

  private findMaxY() {
    const yy = [...this.nodePositions.values()].map(([_, y]) => y)
    return Math.max(...yy)
  }
}

export function tidyLayout(tree: TreeNodeLinks): TreeLayout {
  const nextX = new CoordMap<number>()
  const offsets = new CoordMap<number>()
  const nodePositions = new Map<TreeNodeLinks, NodePosition>()
  const nodeMods = new CoordMap<TreeNodeLinks>()

  const isLeaf = (node: TreeNodeLinks) => !(node.left || node.right)

  function getNodePlace(node: TreeNodeLinks, depth: number) {
    if (isLeaf(node)) {
      return nextX.get(depth)
    } else if (!node.left) {
      const [rightX] = nodePositions.get(node.right!)!
      return rightX - 1
    } else if (!node.right) {
      const [leftX] = nodePositions.get(node.left)!
      return leftX + 1
    } else {
      const [rightX] = nodePositions.get(node.right)!
      const [leftX] = nodePositions.get(node.left)!
      return (leftX + rightX) / 2
    }
  }

  function traverse(node: TreeNodeLinks, depth: number) {
    if (node.left) traverse(node.left, depth + 1)
    if (node.right) traverse(node.right, depth + 1)

    let place = getNodePlace(node, depth)
    const offset = Math.max(offsets.get(depth), nextX.get(depth) - place)
    if (!isLeaf(node)) place += offset

    nodePositions.set(node, [place, depth])
    nextX.set(depth, place + 2)
    offsets.set(depth, offset)
    nodeMods.set(node, offset)
  }

  function addMods(node: TreeNodeLinks, modSum: number) {
    const [x, depth] = nodePositions.get(node)!
    nodePositions.set(node, [x + modSum, depth])

    const offset = nodeMods.get(node)
    if (node.left) addMods(node.left, modSum + offset)
    if (node.right) addMods(node.right, modSum + offset)
  }

  traverse(tree, 0)
  addMods(tree, 0)
  return new TreeLayout(nodePositions)
}

class CoordMap<K> extends Map<K, number> {
  get(key: K): number {
    return super.get(key) ?? 0
  }
}
