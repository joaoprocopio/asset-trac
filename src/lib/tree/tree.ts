import type { Graph, TGraphNode, TGraphNodeId } from "~/lib/graph"

export type TFlatTreeNode<Node> = TGraphNode<Node> & {
  level: number
}

export type TFlatTree<Node> = TFlatTreeNode<Node>[]

export function buildFlatTree<Node>(graph: Graph<Node>): TFlatTree<Node> {
  const flatTree: TFlatTree<Node> = []
  const visited = new Set<TGraphNodeId>()

  function traverse(nodeId: TGraphNodeId, level: number = 0): void {
    if (visited.has(nodeId)) {
      return undefined
    }

    visited.add(nodeId)

    const node = graph.getNode(nodeId)! as TFlatTreeNode<Node>
    node.level = level
    flatTree.push(node)

    if (!graph.hasEdge(nodeId)) {
      return undefined
    }

    const edge = graph.getEdge(nodeId)!

    for (const edgeNodeId of edge.values()) {
      const edgeNode = graph.getNode(edgeNodeId)

      if (visited.has(edgeNodeId) && edgeNode?.parentId !== nodeId) {
        continue
      }

      traverse(edgeNodeId, level + 1)
    }
  }

  for (const rootNodeId of graph.getAllRoots()) {
    if (visited.has(rootNodeId)) {
      continue
    }

    traverse(rootNodeId)
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
  const requiredParents = new Set<TGraphNodeId>()

  for (const node of filteredNodes.values()) {
    let currentId = node?.parentId ?? null
    while (currentId) {
      requiredParents.add(currentId)
      currentId = graph.getNode(currentId)?.parentId ?? null
    }
  }

  function traverse(nodeId: TGraphNodeId, level: number = 0): void {
    if (visited.has(nodeId)) return
    visited.add(nodeId)

    const node = graph.getNode(nodeId) as TFlatTreeNode<Node>
    if (!node) return

    if (filteredNodes.has(nodeId) || requiredParents.has(nodeId)) {
      node.level = level
      flatTree.push(node)
    }

    if (graph.hasEdge(nodeId)) {
      const edge = graph.getEdge(nodeId)!

      for (const childId of edge.values()) {
        if (
          graph.getNode(childId)?.parentId === nodeId &&
          (filteredNodes.has(childId) || requiredParents.has(childId))
        ) {
          traverse(childId, level + 1)
        }
      }
    }
  }

  for (const root of graph.getAllRoots()) {
    if (filteredNodes.has(root) || requiredParents.has(root)) {
      traverse(root)
    }
  }

  return flatTree
}
