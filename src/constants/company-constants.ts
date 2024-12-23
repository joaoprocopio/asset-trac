export type TAssetType = (typeof AssetType)[keyof typeof AssetType]
export const AssetType = {
  Location: "location",
  Asset: "asset",
  Component: "component",
} as const

export type TAssetSensorType = (typeof AssetSensorType)[keyof typeof AssetSensorType]
export const AssetSensorType = {
  Vibration: "vibration",
  Energy: "energy",
} as const

export type TAssetStatus = (typeof AssetStatus)[keyof typeof AssetStatus]
export const AssetStatus = {
  Operating: "operating",
  Alert: "alert",
} as const

export const AssetNameKey = "an"

export const AssetStatusKey = "as"

export const AssetIdKey = "ai"
