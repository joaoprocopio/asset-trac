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

async function getCompanyLocations(companyId: string) {
  const response = await httpClient.get(`/companies/${companyId}/locations`)
  const locations = LocationsSchema.parse(response.data)

  return locations
}

async function getCompanyAssets(companyId: string) {
  const response = await httpClient.get(`/companies/${companyId}/assets`)
  const assets = AssetsSchema.parse(response.data)

  return assets
}

export const CompanyServices = {
  getCompanies,
  getCompanyLocations,
  getCompanyAssets,
}
