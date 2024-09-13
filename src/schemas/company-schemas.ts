import { z } from "zod"

export const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
})
export type TCompany = z.infer<typeof CompanySchema>

export const CompaniesSchema = z.array(CompanySchema)
export type TCompaniesSchema = z.infer<typeof CompaniesSchema>
