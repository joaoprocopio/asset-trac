import { useQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { RESET } from "jotai/utils"
import { useParams } from "react-router"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/card"
import { CompanyAssetsDetails } from "~/components/company-assets/company-assets-details"
import { CompanyAssetsFilter } from "~/components/company-assets/company-assets-filter"
import { CompanyAssetsTree } from "~/components/company-assets/company-assets-tree"
import { Typography } from "~/components/typography"
import { queryClient } from "~/lib/query/query-client"
import { assetsOptions, locationsOptions, selectedCompanyOptions } from "~/lib/query/query-options"
import { selectedAssetNameAtom, selectedAssetStatusAtom } from "~/stores/company-store"

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

  const [selectedAssetName, setSelectedAssetName] = useAtom(selectedAssetNameAtom)
  const [selectedAssetStatus, setSelectedAssetStatus] = useAtom(selectedAssetStatusAtom)

  const locations = useQuery(locationsOptions(params.companyId!))
  const assets = useQuery(assetsOptions(params.companyId!))
  const selectedCompany = useQuery(selectedCompanyOptions(params.companyId!))

  const handleChangeSelectedAssetName = (nextAssetQuery: string | typeof RESET) => {
    setSelectedAssetName(nextAssetQuery)
  }

  const handleChangeSelectedAssetStatus = (nextAssetStatus: string | typeof RESET) => {
    setSelectedAssetStatus(nextAssetStatus)
  }

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
          <CompanyAssetsFilter
            className="flex items-center gap-6 border-b px-6"
            selectedAssetName={selectedAssetName}
            selectedAssetStatus={selectedAssetStatus}
            handleChangeSelectedAssetName={handleChangeSelectedAssetName}
            handleChangeSelectedAssetStatus={handleChangeSelectedAssetStatus}
          />

          {locations.isSuccess && assets.isSuccess && (
            <CompanyAssetsTree className="pl-6" locations={locations.data} assets={assets.data} />
          )}
        </div>

        {locations.isSuccess && assets.isSuccess && <CompanyAssetsDetails />}
      </CardContent>
    </Card>
  )
}
