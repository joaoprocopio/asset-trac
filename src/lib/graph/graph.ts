export type GraphNode<N> = N & {
  id: string
  name: string
  parentId: string | null
}

export class Graph<N> {
  nodes = new Map<string, GraphNode<N> | undefined>()
  edges = new Map<string, Set<string>>()

  get roots() {
    return new Set(this.nodes.keys())
  }

  hasNode(id: string): boolean {
    return this.nodes.has(id)
  }

  getNode(id: string): GraphNode<N> | undefined {
    return structuredClone(this.nodes.get(id))
  }

  setNode(id: string, attributes?: GraphNode<N>): void {
    this.nodes.set(id, attributes)
  }

  setEdge(parentId: string, childId: string): void {
    if (!this.edges.has(parentId)) {
      this.edges.set(parentId, new Set())
    }

    this.edges.get(parentId)!.add(childId)
  }
}
