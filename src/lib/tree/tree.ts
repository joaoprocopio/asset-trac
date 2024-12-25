import type { Graph, TGraphNode, TGraphNodeId } from "~/lib/graph"

export type TFlatTreeNode<Node> = TGraphNode<Node> & {
  level: number
}

export function buildFlatTree<Node>(graph: Graph<Node>): TFlatTreeNode<Node>[] {
  const flatTree: TFlatTreeNode<Node>[] = []
  const visited = new Set<TGraphNodeId>()

  function traverse(nodeId: TGraphNodeId, level: number = 0): void {
    if (visited.has(nodeId)) {
      return undefined
    }
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
