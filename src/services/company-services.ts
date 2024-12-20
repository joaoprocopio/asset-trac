import axios from "axios"

import { AssetsSchema, CompaniesSchema, LocationsSchema } from "~/schemas/company-schemas"

const httpClient = axios.create({
  baseURL: "https://fake-api.tractian.com",
})

async function getCompanies() {
  const response = await httpClient.get("/companies")
  const companies = CompaniesSchema.parse(response.data)

  return companies
}
const GetCompaniesKey = "companies" as const

async function getCompanyLocations(companyId: string) {
  const response = await httpClient.get(`/companies/${companyId}/locations`)
  const locations = LocationsSchema.parse(response.data)

  return locations
}
const GetCompanyLocationsKey = "company-locations" as const

async function getCompanyAssets(companyId: string) {
  const response = await httpClient.get(`/companies/${companyId}/assets`)
  const assets = AssetsSchema.parse(response.data)

  return assets
}
const GetCompanyAssetsKey = "company-assets" as const

export const CompanyServices = {
  getCompanies,
  GetCompaniesKey,
  getCompanyLocations,
  GetCompanyLocationsKey,
  getCompanyAssets,
  GetCompanyAssetsKey,
}
