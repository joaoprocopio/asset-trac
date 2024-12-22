import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/card"
import { CompanyAssetsFilter } from "~/components/company-assets/company-assets-filter"
import { CompanyAssetsTree } from "~/components/company-assets/company-assets-tree"
import { Typography } from "~/components/typography"
import { queryClient } from "~/lib/query/query-client"
import { assetsOptions, locationsOptions, selectedCompanyOptions } from "~/lib/query/query-options"

import type { Route } from "./+types/_company.$companyId"

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
  const companyId = args.params.companyId

  await Promise.all([
    queryClient.prefetchQuery(locationsOptions(companyId)),
    queryClient.prefetchQuery(assetsOptions(companyId)),
    queryClient.prefetchQuery(selectedCompanyOptions(companyId)),
  ])
}

export default function CompanyAssetsPage() {
  const params = useParams()

  const selectedCompany = useQuery(selectedCompanyOptions(params.companyId!))

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="border-b px-6 py-4">
        <CardTitle className="inline-flex items-end gap-1">
          <span>Assets</span>
          <span>
            {selectedCompany.isSuccess && (
              <Typography className="font-normal" affects="muted">
                / {selectedCompany.data?.name} Unit
              </Typography>
            )}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid flex-grow grid-cols-2 overflow-hidden p-0">
        <div className="grid grid-rows-[4rem_1fr] border-r">
          <CompanyAssetsFilter className="flex items-center gap-6 border-b px-6" />

          <CompanyAssetsTree className="pl-6" />
        </div>

        {/* {locations.isSuccess && assets.isSuccess && <CompanyAssetsDetails />} */}
      </CardContent>
    </Card>
  )
}
