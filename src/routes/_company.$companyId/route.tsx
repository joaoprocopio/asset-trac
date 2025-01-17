import { useQuery } from "@tanstack/react-query"
import { Outlet, useParams } from "react-router"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/card"
import { Typography } from "~/components/typography"
import { queryClient } from "~/lib/query/query-client"
import { assetsOptions, companiesOptions, locationsOptions } from "~/lib/query/query-options"
import type { TCompanies } from "~/schemas/company-schemas"

import type { Route } from "./+types/route"
import { CompanyAssetsFilter } from "./components/company-assets-filter"
import { CompanyAssetsTree } from "./components/company-assets-tree"

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
  const companyId = args.params.companyId

  await Promise.all([
    queryClient.prefetchQuery(companiesOptions()),
    queryClient.prefetchQuery(locationsOptions(companyId)),
    queryClient.prefetchQuery(assetsOptions(companyId)),
  ])
}

export default function CompanyDetails() {
  const params = useParams()

  const selectedCompany = useQuery({
    ...companiesOptions(),
    select: findCompanyById(params.companyId!),
  })

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="border-b px-6 py-4">
        <CardTitle className="inline-flex items-end gap-1">
          <span>Assets</span>
          <span>
            {selectedCompany.isSuccess && (
              <Typography className="font-normal" affects="muted">
                / {selectedCompany.data!.name} Unit
              </Typography>
            )}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid flex-grow grid-cols-2 grid-rows-[4rem_1fr] overflow-hidden p-0">
        <CompanyAssetsFilter className="col-span-2 flex items-center gap-6 border-b px-6" />

        <CompanyAssetsTree className="col-span-1 border-r" />

        <Outlet />
      </CardContent>
    </Card>
  )
}

const findCompanyById = (companyId: string) => (companies: TCompanies) =>
  companies.find((company) => company.id === companyId)
