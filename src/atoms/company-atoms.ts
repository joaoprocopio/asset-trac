import { atom } from "jotai"
import { atomWithReset } from "jotai/utils"

import { atomWithHash } from "~/atoms/utils"
import { CompanySchemas } from "~/schemas"

export const selectedCompanyAtom = atomWithReset<CompanySchemas.TCompany | undefined>(undefined)

export const selectedAssetAtom = atom<CompanySchemas.TLocation | CompanySchemas.TAsset>()

export const selectedCompanyIdAtom = atomWithHash("ci", "")

export const selectedAssetNameAtom = atomWithHash("an", "")

export const selectedAssetStatusAtom = atomWithHash("as", "")

export const selectedAssetIdAtom = atomWithHash("ai", "")
