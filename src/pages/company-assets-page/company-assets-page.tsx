import { useAtomValue } from "jotai"

import { CompanyAtoms } from "~/atoms"
import { Card, CardContent } from "~/components/card"
import { Separator } from "~/components/separator"
import { CompanyConstants } from "~/constants"
import { RESET_SEARCH_PARAM, useSearchParam } from "~/hooks/use-search-param"

import { AssetsDetails, AssetsFilter, AssetsHeader, AssetsTree } from "./assets"

export function CompanyAssetsPage() {
  const selectedCompany = useAtomValue(CompanyAtoms.selectedCompanyAtom)

  const [selectedAssetName, setSelectedAssetName] = useSearchParam<string>({
    paramKey: "an",
  })
  const [selectedAssetStatus, setSelectedAssetStatus] =
    useSearchParam<CompanyConstants.TAssetStatus>({
      paramKey: "as",
    })
  const [selectedAssetId, setSelectedAssetId] = useSearchParam<string>({
    paramKey: "ai",
  })

  const handleChangeSelectedAssetName = (nextAssetQuery: string) => {
    const normalizedQuery = nextAssetQuery.trim().toLowerCase()

    if (!normalizedQuery.length) {
      return setSelectedAssetName(RESET_SEARCH_PARAM)
    }

    return setSelectedAssetName(normalizedQuery)
  }

  const handleChangeSelectedAssetStatus = (nextAssetStatus: CompanyConstants.TAssetStatus) => {
    if (selectedAssetStatus === nextAssetStatus) {
      return setSelectedAssetStatus(RESET_SEARCH_PARAM)
    }

    return setSelectedAssetStatus(nextAssetStatus)
  }

  const handleChangeSelectedAssetId = (assetIds: string[]) => {
    const nextAssetId = assetIds[0]

    if (!nextAssetId || nextAssetId === selectedAssetId) {
      return setSelectedAssetId(RESET_SEARCH_PARAM)
    }

    return setSelectedAssetId(nextAssetId)
  }

  return (
    <Card className="flex h-full flex-col">
      <AssetsHeader className="border-b" selectedCompany={selectedCompany} />

      <CardContent className="grid flex-grow basis-px grid-cols-[1fr_1px_1fr] overflow-hidden p-0">
        <div className="flex flex-col">
          <AssetsFilter
            className="sticky inset-0 z-10 flex gap-6 border-b bg-background px-6 py-4"
            selectedAssetName={selectedAssetName}
            selectedAssetStatus={selectedAssetStatus}
            handleChangeSelectedAssetName={handleChangeSelectedAssetName}
            handleChangeSelectedAssetStatus={handleChangeSelectedAssetStatus}
          />

          <AssetsTree
            className="flex-grow basis-px p-6 pr-0"
            selectedAssetId={selectedAssetId}
            handleChangeSelectedAssetId={handleChangeSelectedAssetId}
          />
        </div>

        <Separator className="h-auto overflow-hidden" orientation="vertical" />

        <AssetsDetails
          className="flex flex-col overflow-y-scroll px-6 pb-6 pt-4"
          selectedAssetId={selectedAssetId}
        />
      </CardContent>
    </Card>
  )
}
