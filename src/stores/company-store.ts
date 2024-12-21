import { atomWithReset } from "jotai/utils"

import type { TAsset, TLocation } from "~/schemas/company-schemas"

export const selectedAssetAtom = atomWithReset<TLocation | TAsset | undefined>(undefined)

export const selectedAssetNameAtom = atomWithReset<string>("")

export const selectedAssetStatusAtom = atomWithReset<string>("")

export const selectedAssetIdAtom = atomWithReset<string>("")
