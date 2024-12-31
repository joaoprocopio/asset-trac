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

export namespace CompanyServices {
  const httpClient = axios.create({
    baseURL: "https://fake-api.tractian.com",
  })

  export async function getCompanies(signal: AbortSignal): Promise<TCompanies> {
    const response = await httpClient.get("/companies", {
      signal: signal,
    })
    const companies = CompaniesSchema.parse(response.data)

    return companies
  }

  export async function getCompanyLocations(
    companyId: string,
    signal: AbortSignal
  ): Promise<TLocations> {
    const response = await httpClient.get(`/companies/${companyId}/locations`, {
      signal: signal,
    })
    const locations = LocationsSchema.parse(response.data)

    return locations
  }

  export async function getCompanyAssets(companyId: string, signal: AbortSignal): Promise<TAssets> {
    const response = await httpClient.get(`/companies/${companyId}/assets`, {
      signal: signal,
    })
    const assets = AssetsSchema.parse(response.data)

    return assets
  }

  export async function buildCompanyAssetsGraph(
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
        name: location.name,
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
        name: asset.name,
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

  export type TCompanyAssetsFlatTreeFilter =
    | {
        name?: string
        status?: TAssetStatus
      }
    | undefined

  export async function buildCompanyAssetsFlatTree<Node extends TLocationNode | TAssetNode>(
    graph: Graph<Node>,
    filter: TCompanyAssetsFlatTreeFilter
  ): Promise<TFlatTree<Node>> {
    let flatTree: TFlatTree<Node>

    if (filter?.name || filter?.status) {
      const canMatchName: boolean = Boolean(filter.name)
      const canMatchStatus: boolean = Boolean(filter.status)

      flatTree = buildFilteredFlatTree(graph, (node) => {
        const filterCase: number = (canMatchName ? 1 : 0) | (canMatchStatus ? 2 : 0)

        const nameMatch: boolean = canMatchName
          ? node.name.toLowerCase().indexOf(filter.name!.toLowerCase()) >= 0
          : false
        const statusMatch: boolean =
          canMatchStatus && node.type !== "location" ? node.status === filter.status! : false

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
    } else {
      flatTree = buildFlatTree(graph)
    }

    return flatTree
  }
}
