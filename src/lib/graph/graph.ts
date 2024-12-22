export type GraphNode<N> = {
  id: string
  name: string
  parentId: string | null
} & N

export interface GraphLike<N> {
  getAllNodes(): Map<string, GraphNode<N> | undefined>
}

export class Graph<N> {
  #nodes = new Map<string, GraphNode<N> | undefined>()
  #edges = new Map<string, Set<string>>()

  getAllNodes() {
    return structuredClone(this.#nodes)
  }

  getAllEdges() {
    return structuredClone(this.#edges)
  }

  addNode(id: string, attributes?: GraphNode<N>): void {
    this.#nodes.set(id, attributes)
  }

  getNode(id: string): GraphNode<N> | undefined {
    const node = this.#nodes.get(id)

    if (!node) {
      return undefined
    }

    return structuredClone(node)
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

  getEdge(id: string): Set<string> | undefined {
    const edge = this.#edges.get(id)

    if (!edge) {
      return undefined
    }

    return structuredClone(edge)
  }

  hasEdge(id: string): boolean {
    return this.#edges.has(id)
  }
}
