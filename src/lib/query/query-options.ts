import { QueryClient, queryOptions } from "@tanstack/react-query"

import { CompanyServices } from "~/services/company-services"

export const companiesOptions = () =>
  queryOptions({
    queryFn: (args) => CompanyServices.getCompanies(args.signal),
    queryKey: ["companies"],
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

export const selectedCompanyOptions = (companyId: string, queryClient: QueryClient) =>
  queryOptions({
    queryFn: async () => {
      const companies = await queryClient.ensureQueryData(companiesOptions())
      const company = companies.find((company) => company.id === companyId)!

      return company
    },
    queryKey: ["company", companyId],
  })
