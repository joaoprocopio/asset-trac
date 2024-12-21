import { atomWithReset } from "jotai/utils"

import type { TAsset, TCompany, TLocation } from "~/schemas/company-schemas"

export const selectedCompanyAtom = atomWithReset<TCompany | undefined>(undefined)

export const selectedAssetAtom = atomWithReset<TLocation | TAsset | undefined>(undefined)

export const selectedCompanyIdAtom = atomWithReset<string>("")

export const selectedAssetNameAtom = atomWithReset<string>("")

export const selectedAssetStatusAtom = atomWithReset<string>("")

export const selectedAssetIdAtom = atomWithReset<string>("")
