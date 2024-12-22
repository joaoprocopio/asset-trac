export type GraphNode<N> = N & {
  id: string
  name: string
  parentId: string | null
}

export type GraphEdges = Set<string>

export class Graph<N> {
  #nodes = new Map<string, GraphNode<N> | undefined>()
  #edges = new Map<string, GraphEdges>()

  getAllEdges() {
    return structuredClone(this.#edges)
  }

  addNode(id: string, attributes?: GraphNode<N>): void {
    this.#nodes.set(id, attributes)
  }

  getNode(id: string): GraphNode<N> | undefined {
    return structuredClone(this.#nodes.get(id))
  }

  hasNode(id: string): boolean {
    return this.#nodes.has(id)
  }

  addEdge(parentId: string, childId: string): void {
    if (!this.#edges.has(parentId)) {
      this.#edges.set(parentId, new Set())
    }

    this.#edges.get(parentId)!.add(childId)
  }

  getEdge(id: string): GraphEdges | undefined {
    return structuredClone(this.#edges.get(id))
  }
}
