import { useQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { RESET } from "jotai/utils"
import { useLoaderData, useParams } from "react-router"

import { Card, CardContent } from "~/components/card"
import { CompanyAssetsDetails } from "~/components/company-assets/company-assets-details"
import { CompanyAssetsDetailsSkeleton } from "~/components/company-assets/company-assets-details-skeleton"
import { CompanyAssetsFilter } from "~/components/company-assets/company-assets-filter"
import { CompanyAssetsHeader } from "~/components/company-assets/company-assets-header"
import { CompanyAssetsTree } from "~/components/company-assets/company-assets-tree"
import { CompanyAssetsTreeSkeleton } from "~/components/company-assets/company-assets-tree-skeleton"
import { queryClient } from "~/lib/query/query-client"
import { assetsOptions, locationsOptions, selectedCompanyOptions } from "~/lib/query/query-options"
import type { DeepAwaited } from "~/lib/utils"
import { selectedAssetNameAtom, selectedAssetStatusAtom } from "~/stores/company-store"

import type { Route } from "./+types/_company.$companyId"

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
  const companyId = args.params.companyId

  return {
    locations: await queryClient.ensureQueryData(locationsOptions(companyId)),
    assets: await queryClient.ensureQueryData(assetsOptions(companyId)),
    company: await queryClient.ensureQueryData(selectedCompanyOptions(companyId, queryClient)),
  }
}

export default function CompanyAssetsPage() {
  const params = useParams()
  const loaderData = useLoaderData() as DeepAwaited<ReturnType<typeof clientLoader>>

  const [selectedAssetName, setSelectedAssetName] = useAtom(selectedAssetNameAtom)
  const [selectedAssetStatus, setSelectedAssetStatus] = useAtom(selectedAssetStatusAtom)

  const locations = useQuery({
    ...locationsOptions(params.companyId!),
    initialData: () => loaderData.locations,
  })
  const assets = useQuery({
    ...assetsOptions(params.companyId!),
    initialData: () => loaderData.assets,
  })

  const handleChangeSelectedAssetName = (nextAssetQuery: string | typeof RESET) => {
    setSelectedAssetName(nextAssetQuery)
  }

  const handleChangeSelectedAssetStatus = (nextAssetStatus: string | typeof RESET) => {
    setSelectedAssetStatus(nextAssetStatus)
  }

  return (
    <Card className="flex h-full flex-col">
      <CompanyAssetsHeader className="border-b px-6 py-4" />

      <CardContent className="grid flex-grow grid-cols-2 overflow-hidden p-0">
        <div className="grid grid-rows-[4rem_1fr] border-r">
          <CompanyAssetsFilter
            className="flex items-center gap-6 border-b px-6"
            selectedAssetName={selectedAssetName}
            selectedAssetStatus={selectedAssetStatus}
            handleChangeSelectedAssetName={handleChangeSelectedAssetName}
            handleChangeSelectedAssetStatus={handleChangeSelectedAssetStatus}
          />

          {locations.isSuccess && assets.isSuccess ? (
            <CompanyAssetsTree className="pl-6" locations={locations.data} assets={assets.data} />
          ) : (
            <CompanyAssetsTreeSkeleton />
          )}
        </div>

        {locations.isSuccess && assets.isSuccess ? (
          // TODO: passar o asset
          <CompanyAssetsDetails />
        ) : (
          <CompanyAssetsDetailsSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
