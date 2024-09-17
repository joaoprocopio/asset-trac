import { z } from "zod"

import { CompanyConstants } from "~/constants"

export type TCompany = z.infer<typeof CompanySchema>
export type TCompanies = z.infer<typeof CompaniesSchema>

export type TLocation = z.infer<typeof LocationSchema>
export type TLocations = z.infer<typeof LocationsSchema>

export type TAsset = z.infer<typeof AssetSchema>
export type TAssets = z.infer<typeof AssetsSchema>

export const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const CompaniesSchema = z.array(CompanySchema)

export const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
})
export const LocationsSchema = z.array(LocationSchema)

export const AssetSchema = z.object({
  id: z.string(),
  name: z.string(),
  gatewayId: z.string().optional(),
  parentId: z.string().nullable(), // locationId e parentId são iguais sempre.
  sensorId: z.string().optional(),
  sensorType: z.nativeEnum(CompanyConstants.AssetSensorType).nullable(),
  status: z.nativeEnum(CompanyConstants.AssetStatus).nullable(),
})

export const AssetsSchema = z.array(AssetSchema)
