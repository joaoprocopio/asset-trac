import { deepClone } from "~/utils"

export class Graph {
  nodes = new Map<string, Record<string, unknown>>()
  edges = new Map<string, Set<string>>()

  constructor() {
    // Hack pra permitir recursão do `buildSubtree` sem que o `this` seja redefinido durante as chamadas
    this.buildSubtree = this.buildSubtree.bind(this)
  }

  hasNode(id: string): boolean {
    return this.nodes.has(id)
  }

  getNode(id: string): Record<string, unknown> | undefined {
    // `deepClone` para não usar a referência/ponteiro original
    return deepClone(this.nodes.get(id))
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

  buildSubtree(nodeId: string) {
    const node = this.getNode(nodeId)
    const children = this.edges.get(nodeId)

    if (children) {
      node!.children = Array.from(children).map(this.buildSubtree)
    }

    return node
  }

  buildTree() {
    const roots = new Set(this.nodes.keys())

    for (const [, children] of this.edges) {
      for (const child of children) {
        roots.delete(child)
      }
    }

    const tree = []

    for (const root of roots) {
      const subTree = this.buildSubtree(root)

      tree.push(subTree)
    }

    return tree
  }
}
