import type { Graph, TGraphNode, TGraphNodeId, TGraphNodeMap } from "~/lib/graph"

export type TTreeNode<Node> = TGraphNode<Node> & {
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

export function buildTree<Node>(
  nodeId: TGraphNodeId,
  graph: Graph<Node>,
  visited: Set<TGraphNodeId> = new Set()
) {
  visited.add(nodeId)

  const node: TTreeNode<Node> = graph.getNode(nodeId) as TTreeNode<Node>

  if (graph.hasEdge(nodeId)) {
    const edge = graph.getEdge(nodeId)!

    for (const childId of edge.values()) {
      const childNode = graph.getNode(childId)

      if (!visited.has(childId) && childNode?.parentId === nodeId) {
        if (!node.children) {
          node.children = []
        }

        node.children.push(buildTree(childId, graph, visited))
      }
    }
  }

  return node
}
