import { atomWithReset } from "jotai/utils"

import { atomWithHash } from "~/atoms/utils"
import { CompanySchemas } from "~/schemas"

export const selectedCompanyAtom = atomWithReset<CompanySchemas.TCompany | undefined>(undefined)

export const selectedAssetAtom = atomWithReset<
  CompanySchemas.TLocation | CompanySchemas.TAsset | undefined
>(undefined)

export const selectedCompanyIdAtom = atomWithHash("ci", "")

export const selectedAssetNameAtom = atomWithHash("an", "")

export const selectedAssetStatusAtom = atomWithHash("as", "")

export const selectedAssetIdAtom = atomWithHash("ai", "")
