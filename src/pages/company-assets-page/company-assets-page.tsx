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
import type { FieldsSettingsModel } from "~/components/tree"
import { TreeViewComponent as Tree } from "~/components/tree"
import { Typography } from "~/components/typography"
import type { TAssets, TLocations } from "~/schemas"
import { CompanyServices } from "~/services"

export function CompanyAssetsPage() {
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

  const fields = useMemo<FieldsSettingsModel | undefined>(() => {
    const baseFields: FieldsSettingsModel = {
      id: "id",
      text: "name",
      child: "children",
    }

    if (!(locations.isSuccess && assets.isSuccess)) return undefined
    if (!(locations.data?.length && assets.data?.length)) return undefined

    baseFields.dataSource = composeAssetsDataSource(locations.data, assets.data)

    return baseFields
  }, [locations.data, assets.data, locations.isSuccess, assets.isSuccess])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="inline-flex items-end gap-1">
          Assets
          {company ? (
            <Typography className="font-normal" as="span" affects="muted">
              / {company.name} Unit
            </Typography>
          ) : (
            <Skeleton className="mb-0.5 h-4 w-20" as="span" />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2">
        <div>
          <div className="mb-4 flex gap-6">
            <Input startIcon={SearchIcon} placeholder="Search assets" />

            <Button className="flex-shrink-0" size="icon" variant="outline">
              <FilterIcon className="h-6 w-6" />
            </Button>
          </div>

          <Tree fields={fields} />
        </div>
      </CardContent>
    </Card>
  )
}

interface AssetNode {
  id: string
  name: string
  children?: AssetNode[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

// TODO: Isso aqui não tá completamente correto, melhorar
function composeAssetsDataSource(locations: TLocations, assets: TAssets): AssetNode[] {
  const locationMap = new Map<string, AssetNode>()
  const assetMap = new Map<string, AssetNode>()

  // Create a map of locations
  locations.forEach((location) => {
    locationMap.set(location.id, { id: location.id, name: location.name, children: [] })
  })

  // Create a map of assets
  assets.forEach((asset) => {
    assetMap.set(asset.id, { id: asset.id, name: asset.name, children: [] })
  })

  // Helper function to build the tree
  function buildTree(parentId: string | null): AssetNode[] {
    const nodes: AssetNode[] = []

    // Add locations with the given parentId
    locations.forEach((location) => {
      if (location.parentId === parentId) {
        const node = locationMap.get(location.id)!
        node.children = buildTree(location.id)
        nodes.push(node)
      }
    })

    // Add assets with the given parentId
    assets.forEach((asset) => {
      if (asset.parentId === parentId) {
        const node = assetMap.get(asset.id)!
        node.children = buildTree(asset.id)
        nodes.push(node)
      }
    })

    return nodes
  }

  // Start building the tree from the root nodes (parentId is null)
  return buildTree(null)
}
