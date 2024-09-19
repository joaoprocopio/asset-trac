import { useQuery } from "@tanstack/react-query"
import { useAtom, useAtomValue } from "jotai"
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
    queryFn: () => CompanyServices.getCompanyLocations(selectedCompany!.id),
    queryKey: [CompanyServices.GetCompanyLocationsKey, selectedCompany?.id],
    enabled: typeof selectedCompany?.id === "string",
  })

  const assetsQuery = useQuery({
    queryFn: () => CompanyServices.getCompanyAssets(selectedCompany!.id),
    queryKey: [CompanyServices.GetCompanyAssetsKey, selectedCompany?.id],
    enabled: typeof selectedCompany?.id === "string",
  })

  const handleChangeSelectedAssetName = (nextAssetQuery: string) => {
    setSelectedAssetName(nextAssetQuery)
  }

  const handleChangeSelectedAssetStatus = (nextAssetStatus: string) => {
    setSelectedAssetStatus(nextAssetStatus)
  }

  return selectedCompanyId ? (
    <Card className="flex h-full flex-col">
      <CompanyAssetsHeader className="border-b px-6 py-4" selectedCompany={selectedCompany} />

      <CardContent className="grid flex-grow grid-cols-[1fr_1fr] grid-rows-[4rem_1fr] overflow-hidden p-0">
        <CompanyAssetsFilter
          className="flex items-center gap-4 border-b px-6"
          selectedAssetName={selectedAssetName}
          selectedAssetStatus={selectedAssetStatus}
          handleChangeSelectedAssetName={handleChangeSelectedAssetName}
          handleChangeSelectedAssetStatus={handleChangeSelectedAssetStatus}
        />

        {locationsQuery.isSuccess && assetsQuery.isSuccess ? (
          <CompanyAssetsDetails className="row-span-3 border-l" />
        ) : (
          <CompanyAssetsDetailsSkeleton className="row-span-3 border-l" />
        )}

        {locationsQuery.isSuccess && assetsQuery.isSuccess ? (
          <CompanyAssetsTree
            className="p-6 pr-0"
            locations={locationsQuery.data}
            assets={assetsQuery.data}
          />
        ) : (
          <CompanyAssetsTreeSkeleton className="p-6" />
        )}
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader className="text-center">
        <InboxIcon className="h-14 w-full" />
        <CardTitle>Unit not found</CardTitle>
        <CardDescription>Select any available unit to monitor your assets</CardDescription>
      </CardHeader>
    </Card>
  )
}
