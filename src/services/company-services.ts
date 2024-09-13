import { CompaniesSchema } from "~/schemas"
import { httpClient } from "~/services/clients"

export async function getCompanies() {
  const response = await httpClient.get("/companies")
  const companies = CompaniesSchema.parse(response.data)

  return companies
}
export const GetCompaniesKey = "companies" as const
