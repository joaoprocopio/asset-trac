import { atomWithReset } from "jotai/utils"

import { atomWithHash } from "~/atoms/utils"
import type { TAsset, TCompany, TLocation } from "~/schemas/company-schemas"

export const selectedCompanyAtom = atomWithReset<TCompany | undefined>(undefined)

export const selectedAssetAtom = atomWithReset<TLocation | TAsset | undefined>(undefined)

export const selectedCompanyIdAtom = atomWithHash("ci", "")

export const selectedAssetNameAtom = atomWithHash("an", "")

export const selectedAssetStatusAtom = atomWithHash("as", "")

export const selectedAssetIdAtom = atomWithHash("ai", "")
