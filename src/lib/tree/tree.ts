import type { Graph, TGraphNode, TGraphNodeId } from "~/lib/graph"

export type TFlatTreeNode<Node> = TGraphNode<Node> & {
  level: number
}

export type TFlatTree<Node> = TFlatTreeNode<Node>[]

export function buildFlatTree<Node>(graph: Graph<Node>): TFlatTree<Node> {
  const flatTree: TFlatTree<Node> = []
  const visited = new Set<TGraphNodeId>()

  function traverse(nodeId: TGraphNodeId, level: number = 0): void {
    visited.add(nodeId)

    const node = graph.getNode(nodeId)! as TFlatTreeNode<Node>
    node.level = level
    flatTree.push(node)

    if (graph.hasEdge(nodeId)) {
      const edge = graph.getEdge(nodeId)!

      for (const edgeNodeId of edge.values()) {
        const edgeNode = graph.getNode(edgeNodeId)

        if (!visited.has(edgeNodeId) && edgeNode?.parentId === nodeId) {
          traverse(edgeNodeId, level + 1)
        }
      }
    }
  }

  for (const root of graph.getAllRoots()) {
    traverse(root)
  }

  return flatTree
}

export function buildFilteredFlatTree<Node>(
  graph: Graph<Node>,
  predicate: (node: Node) => boolean
): TFlatTree<Node> {
  const filteredNodes = graph.filterNodes(predicate)
  const flatTree: TFlatTree<Node> = []
  const visited = new Set<TGraphNodeId>()

  function findNearestFilteredAncestor(nodeId: TGraphNodeId): TGraphNodeId | null {
    let currentNode = graph.getNode(nodeId)

    while (currentNode?.parentId) {
      if (filteredNodes.has(currentNode.parentId)) {
        return currentNode.parentId
      }
      currentNode = graph.getNode(currentNode.parentId)
    }

    return null
  }

  function calculateEffectiveLevel(nodeId: TGraphNodeId): number {
    let level = 0
    let currentNodeId = nodeId

    while (true) {
      const nearestFilteredAncestor = findNearestFilteredAncestor(currentNodeId)
      if (!nearestFilteredAncestor) break
      level++
      currentNodeId = nearestFilteredAncestor
    }

    return level
  }

  function traverse(nodeId: TGraphNodeId): void {
    if (visited.has(nodeId)) return
    visited.add(nodeId)

    const node = graph.getNode(nodeId)
    if (!node) return

    if (filteredNodes.has(nodeId)) {
      const flatNode = { ...node, level: calculateEffectiveLevel(nodeId) } as TFlatTreeNode<Node>
      flatTree.push(flatNode)
    }

    if (graph.hasEdge(nodeId)) {
      const edge = graph.getEdge(nodeId)!

      for (const childId of edge.values()) {
        const childNode = graph.getNode(childId)
        if (childNode?.parentId === nodeId) {
          traverse(childId)
        }
      }
    }
  }

  // Start traversal from all roots
  for (const root of graph.getAllRoots()) {
    traverse(root)
  }

  return flatTree
}
