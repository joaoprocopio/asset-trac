import { z } from "zod"

import type { AssetType } from "~/constants/company-constants"
import { AssetSensorType, AssetStatus } from "~/constants/company-constants"

export type TLocationNode = TLocation & {
  type: (typeof AssetType)["Location"]
}
export type TAssetNode = Omit<TAsset, "locationId"> & {
  type: (typeof AssetType)["Component"] | (typeof AssetType)["Asset"]
}

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
  locationId: z.string().nullable(),
  parentId: z.string().nullable(),
  sensorId: z.string().optional(),
  sensorType: z.nativeEnum(AssetSensorType).nullable(),
  status: z.nativeEnum(AssetStatus).nullable(),
})

export const AssetsSchema = z.array(AssetSchema)
