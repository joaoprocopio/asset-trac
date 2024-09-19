import { atom } from "jotai"

import { atomWithHash } from "~/atoms/utils"
import { CompanySchemas } from "~/schemas"

export const selectedCompanyAtom = atom<CompanySchemas.TCompany>()

export const selectedAssetAtom = atom<CompanySchemas.TLocation | CompanySchemas.TAsset>()

export const selectedAssetNameAtom = atomWithHash("an", "")

export const selectedAssetStatusAtom = atomWithHash("as", "")

export const selectedAssetIdAtom = atomWithHash("ai", "")
