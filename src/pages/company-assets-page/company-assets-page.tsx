import { useQuery } from "@tanstack/react-query"
import { useAtomValue } from "jotai"
import { useMemo } from "react"

import FilterIcon from "~/assets/icons/filter-icon.svg?react"
import SearchIcon from "~/assets/icons/search-icon.svg?react"
import { CompanyAtoms } from "~/atoms"
import { Button } from "~/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/card"
import { Input } from "~/components/input"
import { Skeleton } from "~/components/skeleton"
import type { ITreeNode } from "~/components/tree"
import { Tree } from "~/components/tree"
import { Typography } from "~/components/typography"
// import { CompanyConstants } from "~/constants"
// import { RESET_SEARCH_PARAM, useSearchParam } from "~/hooks/use-search-param"
import type { CompanySchemas } from "~/schemas"
import { CompanyServices } from "~/services"

export function CompanyAssetsPage() {
  // const [filterStatus, setFilterStatus] = useSearchParam<CompanyConstants.TAssetStatus>({
  //   paramKey: "status",
  // })
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

  const assetsTree = useMemo(() => {
    if (!(locations.isSuccess && assets.isSuccess)) return undefined

    return buildAssetsTree(locations.data, assets.data)
  }, [locations.data, assets.data, locations.isSuccess, assets.isSuccess])

  // const handleChangeFilterStatus = (nextValue: CompanyConstants.TAssetStatus) => {
  //   if (filterStatus === nextValue) {
  //     return setFilterStatus(RESET_SEARCH_PARAM)
  //   }

  //   return setFilterStatus(nextValue)
  // }

  return (
    <Card className="h-full">
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

      <CardContent className="grid grid-cols-2 gap-8">
        <div className="grid grid-rows-[2.5rem_1fr] gap-8">
          <div className="mb-4 grid grid-cols-[1fr_6rem] items-center gap-4">
            <Input startIcon={SearchIcon} placeholder="Search assets" />

            <Button className="h-full gap-2" variant="outline">
              <FilterIcon className="h-5 w-5" />
              Filter
            </Button>
          </div>

          <div className="h-full overflow-auto">
            <Tree tree={assetsTree} />
          </div>
        </div>

        <div>Tree content</div>
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
