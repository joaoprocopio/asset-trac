import { queryOptions } from "@tanstack/react-query"

import { Graph } from "~/lib/graph"
import type { TAsset, TAssets, TLocation, TLocations } from "~/schemas/company-schemas"
import { CompanyServices } from "~/services/company-services"

export const companiesOptions = () =>
  queryOptions({
    queryFn: (args) => CompanyServices.getCompanies(args.signal),
    queryKey: ["companies"],
  })

export const selectedCompanyOptions = (companyId: string) =>
  queryOptions({
    ...companiesOptions(),
    queryKey: ["company", companyId],
    select: (companies) => companies.find((company) => company.id === companyId),
  })

export const locationsOptions = (companyId: string) =>
  queryOptions({
    queryFn: (args) => CompanyServices.getCompanyLocations(companyId, args.signal),
    queryKey: ["company-locations", companyId],
  })

export const assetsOptions = (companyId: string) =>
  queryOptions({
    queryFn: (args) => CompanyServices.getCompanyAssets(companyId, args.signal),
    queryKey: ["company-assets", companyId],
  })

export const assetsGraphOptions = (companyId: string, locations: TLocations, assets: TAssets) =>
  queryOptions({
    queryFn: async () => {
      type TLocationNode = TLocation & { type: "location" }
      type TAssetNode = Omit<TAsset & { type: "component" | "asset" }, "locationId">

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
    },
    queryKey: ["graph", companyId],
  })
