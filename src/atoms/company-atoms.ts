import { atom } from "jotai"

import { CompanySchemas } from "~/schemas"

export const companyAtom = atom<CompanySchemas.TCompany>()
