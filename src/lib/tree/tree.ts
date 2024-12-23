import type { Graph, TGraphNode, TGraphNodeId } from "~/lib/graph"

type TTreeNode<Node> = TGraphNode<Node> & {
  children?: TTreeNode<Node>[]
}

export function findRootNodes<Node>(graph: Graph<Node>) {
  const nodes = graph.getAllNodes()
  const edges = graph.getAllEdges()
  const roots = new Set(nodes.keys())

  for (const edge of edges.values()) {
    for (const nodeId of edge) {
      roots.delete(nodeId)
    }
  }

  return roots
}

export function buildTree<Node>(nodeId: TGraphNodeId, graph: Graph<Node>) {
  const node = graph.getNode(nodeId) as TTreeNode<Node>

  if (graph.hasEdge(nodeId)) {
    const edge = graph.getEdge(nodeId)

    node.children = Array.from(edge!).map((nodeId) => buildTree(nodeId, graph))
  }

  return node
}
