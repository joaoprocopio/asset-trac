import { useQuery } from "@tanstack/react-query"
import { useAtom, useAtomValue } from "jotai"
import { RESET } from "jotai/utils"
import { InboxIcon } from "lucide-react"

import { CompanyAtoms } from "~/atoms"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/card"
import { CompanyServices } from "~/services"

import { CompanyAssetsDetails, CompanyAssetsDetailsSkeleton } from "./company-assets-details"
import { CompanyAssetsFilter } from "./company-assets-filter"
import { CompanyAssetsHeader } from "./company-assets-header"
import { CompanyAssetsTree, CompanyAssetsTreeSkeleton } from "./company-assets-tree"

export function CompanyAssetsPage() {
  const selectedCompany = useAtomValue(CompanyAtoms.selectedCompanyAtom)
  const selectedCompanyId = useAtomValue(CompanyAtoms.selectedCompanyIdAtom)

  const [selectedAssetName, setSelectedAssetName] = useAtom(CompanyAtoms.selectedAssetNameAtom)
  const [selectedAssetStatus, setSelectedAssetStatus] = useAtom(
    CompanyAtoms.selectedAssetStatusAtom
  )

  const locationsQuery = useQuery({
    queryFn: () => CompanyServices.getCompanyLocations(selectedCompanyId),
    queryKey: [CompanyServices.GetCompanyLocationsKey, selectedCompanyId],
    enabled: typeof selectedCompanyId === "string",
  })

  const assetsQuery = useQuery({
    queryFn: () => CompanyServices.getCompanyAssets(selectedCompanyId),
    queryKey: [CompanyServices.GetCompanyAssetsKey, selectedCompanyId],
    enabled: typeof selectedCompanyId === "string",
  })

  const handleChangeSelectedAssetName = (nextAssetQuery: string | typeof RESET) => {
    setSelectedAssetName(nextAssetQuery)
  }

  const handleChangeSelectedAssetStatus = (nextAssetStatus: string | typeof RESET) => {
    setSelectedAssetStatus(nextAssetStatus)
  }

  if (!selectedCompanyId) {
    return (
      <Card>
        <CardHeader className="text-center">
          <InboxIcon className="h-14 w-full" />
          <CardTitle>Unit not found</CardTitle>
          <CardDescription>Select any available unit to monitor your assets</CardDescription>
        </CardHeader>
      </Card>
    )
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
          <CompanyAssetsDetails />
        ) : (
          <CompanyAssetsDetailsSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
