import { queryOptions } from "@tanstack/react-query"

import { CompanyServices } from "~/services/company-services"

export const getCompaniesQueryOptions = () =>
  queryOptions({
    queryFn: (args) => CompanyServices.getCompanies(args.signal),
    queryKey: ["companies"],
  })

export const getLocationsQueryOptions = (companyId: string) =>
  queryOptions({
    queryFn: (args) => CompanyServices.getCompanyLocations(companyId, args.signal),
    queryKey: ["company-locations", companyId],
  })

export const getAssetsQueryOptions = (companyId: string) =>
  queryOptions({
    queryFn: (args) => CompanyServices.getCompanyAssets(companyId, args.signal),
    queryKey: ["company-assets", companyId],
  })

/* export const getSelectedCompanyQueryOptions = (companyId: string) =>
  queryOptions({
    queryFn: (args) => {
      return
    },
    queryKey: ["company", companyId],
  }) */
