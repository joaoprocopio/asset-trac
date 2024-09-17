import { useQuery } from "@tanstack/react-query"
import { useAtomValue } from "jotai"
import { useMemo } from "react"

import AlertIcon from "~/assets/icons/alert-icon.svg?react"
import OperatingIcon from "~/assets/icons/operating-icon.svg?react"
import SearchIcon from "~/assets/icons/search-icon.svg?react"
import { CompanyAtoms } from "~/atoms"
import { Button } from "~/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/card"
import { Input } from "~/components/input"
import { Separator } from "~/components/separator"
import { Skeleton } from "~/components/skeleton"
import type { ITreeNode } from "~/components/tree"
import { Tree } from "~/components/tree"
import { Typography } from "~/components/typography"
import { CompanyConstants } from "~/constants"
import { RESET_SEARCH_PARAM, useSearchParam } from "~/hooks/use-search-param"
import type { CompanySchemas } from "~/schemas"
import { CompanyServices } from "~/services"

export function CompanyAssetsPage() {
  const [filterStatus, setFilterStatus] = useSearchParam<CompanyConstants.TAssetStatus>({
    paramKey: "status",
  })
  const company = useAtomValue(CompanyAtoms.companyAtom)

  const locations = useQuery({
    queryFn: () => CompanyServices.getCompanyLocations(company!.id),
    queryKey: [CompanyServices.GetCompanyLocationsKey, company?.id],
    enabled: typeof company?.id === "string",
  })

  const assets = useQuery({
    queryFn: () => CompanyServices.getCompanyAssets(company!.id),
    queryKey: [CompanyServices.GetCompanyAssetsKey, company?.id],
    enabled: typeof company?.id === "string",
  })

  // TODO: mover essa função pra um worker
  const assetsTree = useMemo(() => {
    if (!(locations.isSuccess && assets.isSuccess)) return undefined

    return buildAssetsTree(locations.data, assets.data)
  }, [locations.data, assets.data, locations.isSuccess, assets.isSuccess])

  const handleChangeFilterStatus = (nextValue: CompanyConstants.TAssetStatus) => {
    if (filterStatus === nextValue) {
      return setFilterStatus(RESET_SEARCH_PARAM)
    }

    return setFilterStatus(nextValue)
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="inline-flex items-end gap-1">
          Assets
          {company ? (
            <Typography className="font-normal" affects="muted">
              / {company.name} Unit
            </Typography>
          ) : (
            <Skeleton className="mb-0.5 h-4 w-20" />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="grid flex-grow basis-px grid-cols-[1fr_1px_1fr] overflow-hidden p-0">
        <div className="mb-6 overflow-y-auto">
          <div className="sticky top-0 flex gap-6 bg-background p-6 pt-2">
            <Input startIcon={SearchIcon} placeholder="Search assets" />

            <div className="flex gap-4">
              <Button
                className="h-10 gap-2"
                variant={
                  filterStatus === CompanyConstants.AssetStatus.Operating ? "default" : "outline"
                }
                onClick={() => handleChangeFilterStatus(CompanyConstants.AssetStatus.Operating)}>
                <OperatingIcon className="h-5 w-5" />
                Operating
              </Button>

              <Button
                className="h-10 gap-2"
                variant={
                  filterStatus === CompanyConstants.AssetStatus.Alert ? "default" : "outline"
                }
                onClick={() => handleChangeFilterStatus(CompanyConstants.AssetStatus.Alert)}>
                <AlertIcon className="h-5 w-5" />
                Critical
              </Button>
            </div>
          </div>

          <div className="p-6 pt-0">
            <Tree tree={assetsTree} />
          </div>
        </div>

        <Separator className="mb-6 h-auto overflow-hidden" orientation="vertical" />

        <div className="mb-6 overflow-y-auto p-6 pt-2">
          <Typography variant="h3">MOTORS H12D - Stage 3</Typography>
        </div>
      </CardContent>
    </Card>
  )
}

function buildAssetsTree(locations: CompanySchemas.TLocations, assets: CompanySchemas.TAssets) {
  const treeMemo: Record<string, ITreeNode> = {}

  function buildTree(parentId: string | null) {
    for (let locationIndex = 0; locations.length > locationIndex; locationIndex++) {
      const location = locations[locationIndex]

      if (!treeMemo[location.id]) {
        treeMemo[location.id] = {
          id: location.id,
          name: location.name,
        }
      }

      if (location.parentId === parentId) {
        treeMemo[location.id].children = []

        for (let assetIndex = 0; assets.length > assetIndex; assetIndex++) {
          const asset = assets[assetIndex]

          if (asset.locationId === location.id) {
            treeMemo[location.id].children!.push({
              id: asset.id,
              name: asset.name,
            })
          }
        }

        buildTree(location.id)
      }
    }
  }

  buildTree(null)

  const tree = Object.values(treeMemo)

  return tree
}
