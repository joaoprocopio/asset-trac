import { useQuery } from "@tanstack/react-query"
import { useAtom, useAtomValue } from "jotai"
import { useEffect, useMemo } from "react"

import { CompanyAtoms } from "~/atoms"
import { Card, CardContent } from "~/components/card"
import { Separator } from "~/components/separator"
import { CompanyConstants } from "~/constants"
import { Graph } from "~/datastructures"
import { RESET_SEARCH_PARAM, useSearchParam } from "~/hooks/use-search-param"
import { CompanySchemas } from "~/schemas"
import { CompanyServices } from "~/services"

import { AssetsDetails, AssetsFilter, AssetsHeader, AssetsTree } from "./assets"

export function CompanyAssetsPage() {
  const selectedCompany = useAtomValue(CompanyAtoms.selectedCompanyAtom)
  const [selectedAsset, setSelectedAsset] = useAtom(CompanyAtoms.selectedAssetAtom)

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

  const graph = useMemo(() => {
    if (!(locationsQuery.isSuccess && assetsQuery.isSuccess)) return undefined

    const graph = buildGraph(locationsQuery.data, assetsQuery.data)

    return graph
  }, [locationsQuery.data, assetsQuery.data, locationsQuery.isSuccess, assetsQuery.isSuccess])

  const tree = useMemo(() => {
    if (!graph) return undefined

    const tree = buildTree(graph)

    return tree
  }, [graph])

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

  useEffect(() => {
    if (!graph) return
    if (selectedAsset?.id === selectedAssetId) return
    const nextAsset = graph.getNode(selectedAssetId)

    setSelectedAsset(nextAsset)
  }, [graph, selectedAsset, selectedAssetId, setSelectedAsset])

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
            tree={tree}
            selectedAssetId={selectedAssetId}
            handleChangeSelectedAssetId={handleChangeSelectedAssetId}
          />
        </div>

        <Separator className="h-auto overflow-hidden" orientation="vertical" />

        <AssetsDetails className="flex flex-col overflow-auto" selectedAsset={selectedAsset} />
      </CardContent>
    </Card>
  )
}

function buildGraph(locations: CompanySchemas.TLocations, assets: CompanySchemas.TAssets) {
  const graph = new Graph()

  for (let locationIndex = 0; locationIndex < locations.length; locationIndex++) {
    const location = locations[locationIndex]

    graph.setNode(location.id, {
      ...location,
      type: "location",
    })

    if (location.parentId) {
      if (!graph.hasNode(location.parentId)) {
        graph.setNode(location.parentId)
      }

      graph.setEdge(location.parentId, location.id)
    }
  }

  for (let assetsIndex = 0; assetsIndex < assets.length; assetsIndex++) {
    const asset = assets[assetsIndex]

    graph.setNode(asset.id, {
      ...asset,
      type: asset.sensorId ? "component" : "asset",
    })

    if (asset.parentId) {
      if (!graph.hasNode(asset.parentId)) {
        graph.setNode(asset.parentId)
      }

      graph.setEdge(asset.parentId, asset.id)
    }
  }

  return graph
}

function buildTree(graph: Graph) {
  const roots = new Set(graph.nodes.keys())

  for (const [, children] of graph.edges) {
    for (const child of children) {
      roots.delete(child)
    }
  }

  const tree = []

  function buildSubtree(nodeId: string) {
    const node = graph.getNode(nodeId)
    const children = graph.edges.get(nodeId)

    if (children) {
      node!.children = Array.from(children).map(buildSubtree)
    }

    return node
  }

  for (const root of roots) {
    const subTree = buildSubtree(root)

    tree.push(subTree)
  }

  return tree
}
