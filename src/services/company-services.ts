import axios from "axios"

import type { TAssetStatus } from "~/constants/company-constants"
import { AssetType } from "~/constants/company-constants"
import { Graph } from "~/lib/graph"
import type { TFlatTree } from "~/lib/tree"
import { buildFilteredFlatTree, buildFlatTree } from "~/lib/tree"
import type {
  TAssetNode,
  TAssets,
  TCompanies,
  TLocationNode,
  TLocations,
} from "~/schemas/company-schemas"
import { AssetsSchema, CompaniesSchema, LocationsSchema } from "~/schemas/company-schemas"

const httpClient = axios.create({
  baseURL: "https://fake-api.tractian.com",
})

async function getCompanies(signal: AbortSignal): Promise<TCompanies> {
  const response = await httpClient.get("/companies", {
    signal: signal,
  })
  const companies = CompaniesSchema.parse(response.data)

  return companies
}

async function getCompanyLocations(companyId: string, signal: AbortSignal): Promise<TLocations> {
  const response = await httpClient.get(`/companies/${companyId}/locations`, {
    signal: signal,
  })
  const locations = LocationsSchema.parse(response.data)

  return locations
}

async function getCompanyAssets(companyId: string, signal: AbortSignal): Promise<TAssets> {
  const response = await httpClient.get(`/companies/${companyId}/assets`, {
    signal: signal,
  })
  const assets = AssetsSchema.parse(response.data)

  return assets
}

async function buildCompanyAssetsGraph(
  locations: TLocations,
  assets: TAssets
): Promise<Graph<TLocationNode | TAssetNode>> {
  const graph = new Graph<TLocationNode | TAssetNode>()

  for (const location of locations) {
    const nodeId = location.id
    const parentId = location.parentId

    graph.addNode(nodeId, {
      type: AssetType.Location,
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
    } else {
      graph.addRoot(nodeId)
    }
  }

  for (const asset of assets) {
    const nodeId = asset.id
    const parentId = asset.locationId || asset.parentId

    graph.addNode(nodeId, {
      type: asset.sensorId ? AssetType.Component : AssetType.Asset,
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
    } else {
      graph.addRoot(nodeId)
    }
  }

  return graph
}

async function buildCompanyAssetsFlatTree<Node extends TLocationNode | TAssetNode>(
  graph: Graph<Node>,
  filter?: {
    name?: string
    status?: TAssetStatus
  }
): Promise<TFlatTree<Node>> {
  let flatTree: TFlatTree<Node>

  if (filter?.name || filter?.status) {
    const canMatchName: boolean = Boolean(filter.name)
    const canMatchStatus: boolean = Boolean(filter.status)

    buildFilteredFlatTree(graph, (node) => {
      const filterCase: number = (canMatchName ? 1 : 0) | (canMatchStatus ? 2 : 0)

      const nameMatch: boolean = canMatchName ? node.name.indexOf(filter.name!) >= 0 : false
      const statusMatch: boolean =
        canMatchStatus && node.type !== "location" ? node.status === filter.status : false

      switch (filterCase) {
        default:
          return false
        case 1:
          return nameMatch
        case 2:
          return statusMatch
        case 3:
          return nameMatch && statusMatch
      }
    })

    flatTree = buildFlatTree(graph)
  } else {
    flatTree = buildFlatTree(graph)
  }

  return flatTree
}

export const CompanyServices = {
  getCompanies,
  getCompanyLocations,
  getCompanyAssets,
  buildCompanyAssetsGraph,
  buildCompanyAssetsFlatTree,
}
