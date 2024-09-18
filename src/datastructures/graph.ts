export class Graph {
  nodes = new Map<string, Record<string, unknown>>()
  edges = new Map<string, Set<string>>()

  hasNode(id: string): boolean {
    return this.nodes.has(id)
  }

  getNode(id: string): Record<string, unknown> | undefined {
    return this.nodes.get(id)
  }

  setNode(id: string, attributes?: Record<string, unknown>): void {
    this.nodes.set(id, attributes ?? {})
  }

  setEdge(parentId: string, childId: string): void {
    if (!this.edges.has(parentId)) {
      this.edges.set(parentId, new Set())
    }

    this.edges.get(parentId)!.add(childId)
  }
}
