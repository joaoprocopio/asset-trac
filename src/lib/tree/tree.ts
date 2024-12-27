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
  const flatTree: TFlatTree<Node> = []
  const visited = new Set<TGraphNodeId>()
  const requiredNodes = new Set<TGraphNodeId>()

  // First pass: collect filtered nodes and their ancestor nodes
  function collectRequiredNodes(nodeId: TGraphNodeId): void {
    const node = graph.getNode(nodeId)
    if (!node) return

    // If node matches predicate, mark it and collect all its ancestors
    if (predicate(node)) {
      let currentNode = node
      while (currentNode) {
        requiredNodes.add(currentNode.id)
        if (!currentNode.parentId) break
        currentNode = graph.getNode(currentNode.parentId)!
      }
    }

    // Continue traversal
    if (graph.hasEdge(nodeId)) {
      const edge = graph.getEdge(nodeId)!
      for (const childId of edge.values()) {
        const childNode = graph.getNode(childId)
        if (childNode?.parentId === nodeId) {
          collectRequiredNodes(childId)
        }
      }
    }
  }

  // Second pass: build the flat tree with correct levels
  function traverse(nodeId: TGraphNodeId, level: number = 0): void {
    if (visited.has(nodeId)) return
    visited.add(nodeId)

    const node = graph.getNode(nodeId)
    if (!node) return

    // Include the node if it's required (either matches predicate or is a parent)
    if (requiredNodes.has(nodeId)) {
      const flatNode = { ...node, level } as TFlatTreeNode<Node>
      flatTree.push(flatNode)
    }

    // Continue traversal for children
    if (graph.hasEdge(nodeId)) {
      const edge = graph.getEdge(nodeId)!
      for (const childId of edge.values()) {
        const childNode = graph.getNode(childId)
        if (childNode?.parentId === nodeId && requiredNodes.has(childId)) {
          traverse(childId, level + 1)
        }
      }
    }
  }

  // First collect all required nodes (filtered + their ancestors)
  for (const root of graph.getAllRoots()) {
    collectRequiredNodes(root)
  }

  // Then build the flat tree
  for (const root of graph.getAllRoots()) {
    if (requiredNodes.has(root)) {
      traverse(root)
    }
  }

  return flatTree
}
