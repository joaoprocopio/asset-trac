import { queryOptions } from "@tanstack/react-query"

import type { Graph } from "~/lib/graph"
import type { TAssets, TLocations } from "~/schemas/company-schemas"
import { CompanyServices } from "~/services/company-services"

export const companiesOptions = () =>
  queryOptions({
    queryKey: ["companies"],
    queryFn: (args) => CompanyServices.getCompanies(args.signal),
  })

export const selectedCompanyOptions = (companyId: string) =>
  queryOptions({
    ...companiesOptions(),
    queryKey: ["company", companyId],
    select: (companies) => companies.find((company) => company.id === companyId),
  })

export const locationsOptions = (companyId: string) =>
  queryOptions({
    queryKey: ["company-locations", companyId],
    queryFn: (args) => CompanyServices.getCompanyLocations(companyId, args.signal),
  })

export const assetsOptions = (companyId: string) =>
  queryOptions({
    queryKey: ["company-assets", companyId],
    queryFn: (args) => CompanyServices.getCompanyAssets(companyId, args.signal),
  })

export const assetsGraphOptions = (companyId: string, locations: TLocations, assets: TAssets) =>
  queryOptions({
    queryKey: ["company-assets-graph", companyId],
    queryFn: () => CompanyServices.buildCompanyAssetsGraph(locations, assets),
  })

export const assetsTreeOptions = <N>(companyId: string, graph: Graph<N>) =>
  queryOptions({
    queryKey: ["company-assets-tree", companyId],
    queryFn: () => CompanyServices.buildCompanyAssetsTree(graph),
  })
