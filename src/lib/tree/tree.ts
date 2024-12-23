import type { Graph, TGraphNode, TGraphNodeId, TGraphNodeMap } from "~/lib/graph"

type TTreeNode<Node> = TGraphNode<Node> & {
  children?: TTreeNode<Node>[]
}

export function findRootNodes<Node>(graph: Graph<Node>): Set<TGraphNodeId> {
  const nodes: TGraphNodeMap<Node> = graph.getAllNodes()
  const roots: Set<TGraphNodeId> = new Set()

  for (const [nodeId, nodeAttributes] of nodes) {
    if (roots.has(nodeId)) {
      continue
    }

    if (nodeAttributes && nodeAttributes.parentId == null) {
      roots.add(nodeId)
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
