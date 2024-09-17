import { CompanySchemas } from "~/schemas"
import { httpClient } from "~/services/clients"

export async function getCompanies() {
  const response = await httpClient.get("/companies")
  const companies = CompanySchemas.CompaniesSchema.parse(response.data)

  return companies
}
export const GetCompaniesKey = "companies" as const

export async function getCompanyLocations(companyId: string) {
  const response = await httpClient.get(`/companies/${companyId}/locations`)
  const locations = CompanySchemas.LocationsSchema.parse(response.data)

  return locations
}
export const GetCompanyLocationsKey = "company-locations" as const

export async function getCompanyAssets(companyId: string) {
  const response = await httpClient.get(`/companies/${companyId}/assets`)
  const assets = CompanySchemas.AssetsSchema.parse(response.data)

  return assets
}
export const GetCompanyAssetsKey = "company-assets" as const
