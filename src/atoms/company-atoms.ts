import { atom } from "jotai"

import { CompanySchemas } from "~/schemas"

export const selectedCompanyAtom = atom<CompanySchemas.TCompany>()
