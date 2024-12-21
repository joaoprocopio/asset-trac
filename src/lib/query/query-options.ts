import { queryOptions } from "@tanstack/react-query"

import { CompanyServices } from "~/services/company-services"

export const companiesQueryOptions = () =>
  queryOptions({
    queryFn: CompanyServices.getCompanies,
    queryKey: ["companies"],
  })

export const locationsQueryOptions = (companyId: string) =>
  queryOptions({
    queryFn: () => CompanyServices.getCompanyLocations(companyId),
    queryKey: ["company-locations", companyId],
  })

export const assetsQueryOptions = (companyId: string) =>
  queryOptions({
    queryFn: () => CompanyServices.getCompanyAssets(companyId),
    queryKey: ["company-assets", companyId],
  })
