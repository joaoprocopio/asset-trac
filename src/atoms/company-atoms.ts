import { atom } from "jotai"

import type { TCompany } from "~/schemas"

export const companyAtom = atom<TCompany>()
