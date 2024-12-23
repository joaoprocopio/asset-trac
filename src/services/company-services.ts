import axios from "axios"

import type { TGraphNode, TGraphNodeId } from "~/lib/graph"
import { Graph } from "~/lib/graph"
import type { TAsset, TAssets, TLocation, TLocations } from "~/schemas/company-schemas"
import { AssetsSchema, CompaniesSchema, LocationsSchema } from "~/schemas/company-schemas"

const httpClient = axios.create({
  baseURL: "https://fake-api.tractian.com",
})

async function getCompanies(signal?: AbortSignal) {
  const response = await httpClient.get("/companies", {
    signal: signal,
  })
  const companies = CompaniesSchema.parse(response.data)

  return companies
}

async function getCompanyLocations(companyId: string, signal?: AbortSignal) {
  const response = await httpClient.get(`/companies/${companyId}/locations`, {
    signal: signal,
  })
  const locations = LocationsSchema.parse(response.data)

  return locations
}

async function getCompanyAssets(companyId: string, signal?: AbortSignal) {
  const response = await httpClient.get(`/companies/${companyId}/assets`, {
    signal: signal,
  })
  const assets = AssetsSchema.parse(response.data)

  return assets
}

async function buildCompanyAssetsGraph(locations: TLocations, assets: TAssets) {
  type TLocationNode = TLocation & { type: "location" }
  type TAssetNode = Omit<TAsset, "locationId"> & { type: "component" | "asset" }

  const graph = new Graph<TLocationNode | TAssetNode>()

  for (const location of locations) {
    const nodeId = location.id
    const parentId = location.parentId

    graph.addNode(nodeId, {
      type: "location",
      id: nodeId,
      name: location.name.toLowerCase(),
      parentId: parentId,
    })

    if (parentId) {
      if (!graph.hasNode(parentId)) {
        graph.addNode(parentId)
      }

      graph.addEdge(parentId, nodeId)
    }
  }

  for (const asset of assets) {
    const nodeId = asset.id
    const parentId = asset.locationId || asset.parentId

    graph.addNode(nodeId, {
      type: asset.sensorId ? "component" : "asset",
      id: nodeId,
      name: asset.name.toLowerCase(),
      parentId: parentId,
      sensorType: asset.sensorType,
      status: asset.status,
      gatewayId: asset.gatewayId,
      sensorId: asset.sensorId,
    })

    if (parentId) {
      if (!graph.hasNode(parentId)) {
        graph.addNode(parentId)
      }

      graph.addEdge(parentId, nodeId)
    }
  }

  return graph
}

async function buildCompanyAssetsTree<Node>(graph: Graph<Node>) {
  type TreeNode<Node> = TGraphNode<Node> & {
    children?: TreeNode<Node>[]
  }

  const roots = new Set(graph.getAllNodes().keys())

  for (const edge of graph.getAllEdges().values()) {
    for (const node of edge) {
      roots.delete(node)
    }
  }

  const tree = []

  function buildSubtree(nodeId: TGraphNodeId) {
    const node = graph.getNode(nodeId) as TreeNode<Node>

    if (graph.hasEdge(nodeId)) {
      const edge = graph.getEdge(nodeId)

      node.children = Array.from(edge!).map(buildSubtree)
    }

    return node
  }

  for (const root of roots) {
    const subTree = buildSubtree(root)

    tree.push(subTree)
  }

  return tree
}

export const CompanyServices = {
  getCompanies,
  getCompanyLocations,
  getCompanyAssets,
  buildCompanyAssetsGraph,
  buildCompanyAssetsTree,
}
