import axios from "axios"

import { Graph } from "~/lib/graph"
import { buildTree, findRootNodes } from "~/lib/tree"
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
      graph.addEdge(nodeId, parentId)
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
      graph.addEdge(nodeId, parentId)
    }
  }

  return graph
}

async function buildCompanyAssetsTree<Node>(graph: Graph<Node>) {
  const roots = findRootNodes(graph)

  const tree = []

  for (const root of roots) {
    const subTree = buildTree(root, graph)

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
