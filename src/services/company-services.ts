import axios from "axios"

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
    graph.addNode(location.id, {
      type: "location",
      id: location.id,
      name: location.name.toLowerCase(),
      parentId: location.parentId,
    })

    if (location.parentId) {
      if (!graph.hasNode(location.parentId)) {
        graph.addNode(location.parentId)
      }

      graph.addEdge(location.parentId, location.id)
    }
  }

  for (const asset of assets) {
    graph.addNode(asset.id, {
      type: asset.sensorId ? "component" : "asset",
      id: asset.id,
      name: asset.name.toLowerCase(),
      parentId: asset.locationId || asset.parentId,
      sensorType: asset.sensorType,
      status: asset.status,
      gatewayId: asset.gatewayId,
      sensorId: asset.sensorId,
    })

    if (asset.parentId) {
      if (!graph.hasNode(asset.parentId)) {
        graph.addNode(asset.parentId)
      }

      graph.addEdge(asset.parentId, asset.id)
    }
  }

  return graph
}

export const CompanyServices = {
  getCompanies,
  getCompanyLocations,
  getCompanyAssets,
  buildCompanyAssetsGraph,
}
