import type { Graph, TGraphNode, TGraphNodeId, TGraphNodeMap } from "~/lib/graph"

export type TFlatNode<Node> = TGraphNode<Node> & {
  level: number
}

export function findRootNodes<Node>(graph: Graph<Node>): Set<TGraphNodeId> {
  const nodes: TGraphNodeMap<Node> = graph.getAllNodes()
  const roots: Set<TGraphNodeId> = new Set()

  for (const [nodeId, nodeAttributes] of nodes) {
    if (nodeAttributes && nodeAttributes.parentId == null) {
      roots.add(nodeId)
    }
  }

  return roots
}

export function buildFlatTree<Node>(graph: Graph<Node>): TFlatNode<Node>[] {
  const flatTree: TFlatNode<Node>[] = []
  const visited = new Set<TGraphNodeId>()

  function traverse(nodeId: TGraphNodeId, level: number): void {
    if (visited.has(nodeId)) return
    visited.add(nodeId)

    const node = graph.getNode(nodeId)
    if (!node) return

    flatTree.push({ ...node, level })

    if (graph.hasEdge(nodeId)) {
      const edge = graph.getEdge(nodeId)!
      const edgeIterator = edge.values()

      for (const childId of edgeIterator) {
        const childNode = graph.getNode(childId)
        if (!visited.has(childId) && childNode?.parentId === nodeId) {
          traverse(childId, level + 1)
        }
      }
    }
  }

  const rootNodes = findRootNodes(graph)

  for (const root of rootNodes) {
    traverse(root, 0)
  }

  return flatTree
}
