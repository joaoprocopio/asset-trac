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

    const node = graph.getNode(nodeId) as TFlatTreeNode<Node> | undefined

    if (!node) {
      return undefined
    }

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
  const visited: Set<TGraphNodeId> = new Set()
  const requiredParents: Set<TGraphNodeId> = new Set()

  for (const node of filteredNodes.values()) {
    let currNodeId = node?.parentId

    while (currNodeId) {
      requiredParents.add(currNodeId)
      currNodeId = graph.getNode(currNodeId)?.parentId
    }
  }

  function traverse(nodeId: TGraphNodeId, level: number = 0): void {
    if (visited.has(nodeId)) {
      return undefined
    }

    visited.add(nodeId)

    const node = graph.getNode(nodeId) as TFlatTreeNode<Node> | undefined

    if (!node) {
      return undefined
    }

    if (filteredNodes.has(nodeId) || requiredParents.has(nodeId)) {
      node.level = level
      flatTree.push(node)
    }

    if (!graph.hasEdge(nodeId)) {
      return undefined
    }

    const edge = graph.getEdge(nodeId)!

    for (const edgeNodeId of edge.values()) {
      if (!(filteredNodes.has(edgeNodeId) || requiredParents.has(edgeNodeId))) {
        continue
      }

      const edgeNode = graph.getNode(edgeNodeId)

      if (edgeNode?.parentId !== nodeId) {
        continue
      }

      traverse(edgeNodeId, level + 1)
    }
  }

  for (const root of graph.getAllRoots()) {
    if (!(filteredNodes.has(root) || requiredParents.has(root))) {
      continue
    }

    traverse(root)
  }

  return flatTree
}
