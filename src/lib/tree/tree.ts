import type { Graph, TGraphNode, TGraphNodeId } from "~/lib/graph"

export type TFlatNode<Node> = TGraphNode<Node> & {
  level: number
}

export function buildFlatTree<Node>(graph: Graph<Node>): TFlatNode<Node>[] {
  const flatTree: TFlatNode<Node>[] = []
  const visited = new Set<TGraphNodeId>()

  function traverse(nodeId: TGraphNodeId, level: number): void {
    if (visited.has(nodeId)) {
      return undefined
    }
    visited.add(nodeId)

    const node = graph.getNode(nodeId)! as TFlatNode<Node>
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
    traverse(root, 0)
  }

  return flatTree
}
