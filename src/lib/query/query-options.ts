import { queryOptions } from "@tanstack/react-query"

import type { Graph } from "~/lib/graph"
import type { TAssets, TLocations } from "~/schemas/company-schemas"
import { CompanyServices } from "~/services/company-services"

export const companiesOptions = () =>
  queryOptions({
    queryKey: ["companies"],
    queryFn: async (args) => CompanyServices.getCompanies(args.signal),
  })

export const locationsOptions = (companyId: string) =>
  queryOptions({
    queryKey: ["company-locations", companyId],
    queryFn: async (args) => CompanyServices.getCompanyLocations(companyId, args.signal),
  })

export const assetsOptions = (companyId: string) =>
  queryOptions({
    queryKey: ["company-assets", companyId],
    queryFn: async (args) => CompanyServices.getCompanyAssets(companyId, args.signal),
  })

export const assetsGraphOptions = (companyId: string, locations: TLocations, assets: TAssets) =>
  queryOptions({
    queryKey: ["company-assets-graph", companyId],
    queryFn: async () => CompanyServices.buildCompanyAssetsGraph(locations, assets),
  })

export const assetsFlatTreeOptions = <Node>(companyId: string, graph: Graph<Node>) =>
  queryOptions({
    queryKey: ["company-assets-flat-tree", companyId],
    queryFn: async () => CompanyServices.buildCompanyAssetsFlatTree(graph),
  })
