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
