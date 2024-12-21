import { queryOptions, useQuery } from "@tanstack/react-query"
import { useAtom, useAtomValue } from "jotai"
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
import type { TAsset } from "~/schemas/company-schemas"
import { CompanyServices } from "~/services/company-services"
import {
  selectedAssetAtom,
  selectedAssetNameAtom,
  selectedAssetStatusAtom,
  selectedCompanyAtom,
} from "~/stores/company-store"

import type { Info as RouteInfo, Route } from "./+types/_company.$companyId"

const locationsOptions = (companyId: string) =>
  queryOptions({
    queryFn: () => CompanyServices.getCompanyLocations(companyId),
    queryKey: ["company-locations", companyId],
  })

const assetsOptions = (companyId: string) =>
  queryOptions({
    queryFn: () => CompanyServices.getCompanyAssets(companyId),
    queryKey: ["company-assets", companyId],
  })

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
  const companyId = args.params.companyId

  return {
    locations: await queryClient.ensureQueryData(locationsOptions(companyId)),
    assets: await queryClient.ensureQueryData(assetsOptions(companyId)),
  }
}

export default function CompanyAssetsPage() {
  const params = useParams<RouteInfo["params"]>()
  const loaderData = useLoaderData<typeof clientLoader>()

  const selectedAsset = useAtomValue(selectedAssetAtom)
  const selectedCompany = useAtomValue(selectedCompanyAtom)

  const [selectedAssetName, setSelectedAssetName] = useAtom(selectedAssetNameAtom)
  const [selectedAssetStatus, setSelectedAssetStatus] = useAtom(selectedAssetStatusAtom)

  const locationsQuery = useQuery({
    ...locationsOptions(params.companyId!),
    initialData: () => loaderData.locations,
  })
  const assetsQuery = useQuery({
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
      <CompanyAssetsHeader className="border-b px-6 py-4" selectedCompany={selectedCompany} />

      <CardContent className="grid flex-grow grid-cols-2 overflow-hidden p-0">
        <div className="grid grid-rows-[4rem_1fr] border-r">
          <CompanyAssetsFilter
            className="flex items-center gap-6 border-b px-6"
            selectedAssetName={selectedAssetName}
            selectedAssetStatus={selectedAssetStatus}
            handleChangeSelectedAssetName={handleChangeSelectedAssetName}
            handleChangeSelectedAssetStatus={handleChangeSelectedAssetStatus}
          />

          {locationsQuery.isSuccess && assetsQuery.isSuccess ? (
            <CompanyAssetsTree
              className="pl-6"
              locations={locationsQuery.data}
              assets={assetsQuery.data}
            />
          ) : (
            <CompanyAssetsTreeSkeleton />
          )}
        </div>

        {locationsQuery.isSuccess && assetsQuery.isSuccess ? (
          <CompanyAssetsDetails selectedAsset={selectedAsset as TAsset} />
        ) : (
          <CompanyAssetsDetailsSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
