export type GraphNode<N> = N & {
  id: string
  name: string
  parentId: string | null
}

export type TreeNode<N> = GraphNode<N> & {
  children?: TreeNode<N>[]
}

export class Graph<N> {
  nodes = new Map<string, GraphNode<N> | undefined>()
  edges = new Map<string, Set<string>>()

  constructor() {
    // Hack pra permitir recursão do `buildSubtree` sem que o `this` seja redefinido durante as chamadas
    this.buildSubtree = this.buildSubtree.bind(this)
  }

  hasNode(id: string): boolean {
    return this.nodes.has(id)
  }

  getNode(id: string): GraphNode<N> | undefined {
    // Deep clone para não usar a referência/ponteiro original
    return structuredClone(this.nodes.get(id))
  }

  getParent(id: string): GraphNode<N> | undefined {
    const node = this.getNode(id)

    if (!node) {
      return undefined
    }

    if (!node.parentId) {
      return undefined
    }

    return this.getNode(node.parentId)
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

  findNodeRoot(nodeId: string): string | undefined {
    const node = this.getNode(nodeId)

    if (!node) {
      return undefined
    }

    if (!node.parentId) {
      return nodeId
    }

    return this.findNodeRoot(node.parentId)
  }

  filterNodes(predicate: (node: GraphNode<N>) => boolean) {
    const filteredNodes: typeof this.nodes = new Map()
    const nodes = structuredClone(this.nodes)

    for (const [nodeId, node] of nodes) {
      if (!node) {
        continue
      }

      if (!predicate(node)) {
        continue
      }

      filteredNodes.set(nodeId, node)
    }

    return filteredNodes
  }

  buildSubtree(nodeId: string): TreeNode<N> {
    const node = this.getNode(nodeId) as TreeNode<N>
    const children = this.edges.get(nodeId)

    if (node && children) {
      node.children = Array.from(children).map(this.buildSubtree)
    }

    return node
  }

  buildTree() {
    const roots = new Set(this.nodes.keys())

    // Para encontrar as raízes da árvore
    // É necessário remover todos os nós que são filhos de outros nós
    for (const [, children] of this.edges) {
      for (const child of children) {
        roots.delete(child)
      }
    }
    // No fim, `roots` contém apenas os nós que são raízes da árvore
    // Podem ou não conter filhos, mas não são filhos de nenhum outro nó

    const tree = []

    for (const root of roots) {
      const subTree = this.buildSubtree(root)

      tree.push(subTree)
    }

    return tree
  }

  buildBacktracedTree(nodes: typeof this.nodes = structuredClone(this.nodes)) {
    const treeMap: typeof this.nodes = new Map()

    for (const [nodeId, node] of nodes) {
      if (treeMap.has(nodeId)) {
        continue
      }

      if (!node) {
        continue
      }

      if (!node.parentId) {
        // Se não tem parentId, é raiz, então constrói a sub-árvore a partir desse nó
        const subTree = this.buildSubtree(nodeId)
        treeMap.set(nodeId, subTree)

        continue
      }

      const rootNodeId = this.findNodeRoot(node.parentId)

      if (!rootNodeId || treeMap.has(rootNodeId)) {
        continue
      }

      const subTree = this.buildSubtree(rootNodeId)

      treeMap.set(rootNodeId, subTree)
    }

    const tree = Array.from(treeMap.values())

    return tree
  }

  // TODO: corrigir a tipagem
  flattenTreeNodes(tree, level = 0) {
    let flattenedNodes = []

    for (let nodeIndex = 0; nodeIndex < tree.length; nodeIndex++) {
      const node = Object.assign(structuredClone(tree[nodeIndex]), { level })

      flattenedNodes.push(node)

      if (node.children) {
        flattenedNodes = flattenedNodes.concat(this.flattenTreeNodes(node.children, level + 1))
      }

      delete node.children
    }

    return flattenedNodes
  }
}
