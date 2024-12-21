import { useQuery } from "@tanstack/react-query"
import { useAtom, useAtomValue } from "jotai"
import { RESET } from "jotai/utils"

import { Card, CardContent } from "~/components/card"
import {
  CompanyAssetsDetails,
  CompanyAssetsDetailsSkeleton,
} from "~/components/company-assets/company-assets-details"
import { CompanyAssetsFilter } from "~/components/company-assets/company-assets-filter"
import { CompanyAssetsHeader } from "~/components/company-assets/company-assets-header"
import {
  CompanyAssetsTree,
  CompanyAssetsTreeSkeleton,
} from "~/components/company-assets/company-assets-tree"
import type { TAsset } from "~/schemas/company-schemas"
import { CompanyServices } from "~/services/company-services"
import {
  selectedAssetAtom,
  selectedAssetNameAtom,
  selectedAssetStatusAtom,
  selectedCompanyAtom,
  selectedCompanyIdAtom,
} from "~/stores/company-store"

export default function CompanyAssetsPage() {
  const selectedAsset = useAtomValue(selectedAssetAtom)
  const selectedCompany = useAtomValue(selectedCompanyAtom)
  const selectedCompanyId = useAtomValue(selectedCompanyIdAtom)

  const [selectedAssetName, setSelectedAssetName] = useAtom(selectedAssetNameAtom)
  const [selectedAssetStatus, setSelectedAssetStatus] = useAtom(selectedAssetStatusAtom)

  const locationsQuery = useQuery({
    queryFn: () => CompanyServices.getCompanyLocations(selectedCompanyId),
    queryKey: ["company-locations", selectedCompanyId],
    enabled: typeof selectedCompanyId === "string" && selectedCompanyId.length > 0,
  })

  const assetsQuery = useQuery({
    queryFn: () => CompanyServices.getCompanyAssets(selectedCompanyId),
    queryKey: ["company-assets", selectedCompanyId],
    enabled: typeof selectedCompanyId === "string" && selectedCompanyId.length > 0,
  })

  const handleChangeSelectedAssetName = (nextAssetQuery: string | typeof RESET) => {
    setSelectedAssetName(nextAssetQuery)
  }

  const handleChangeSelectedAssetStatus = (nextAssetStatus: string | typeof RESET) => {
    setSelectedAssetStatus(nextAssetStatus)
  }

  if (!selectedCompanyId) {
    return <Card>olha, vc ta na outra pagina, so que aqui n tem nada pra vc</Card>
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
