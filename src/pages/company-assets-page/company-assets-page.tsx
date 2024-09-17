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

  const assetsTree = useMemo(() => {
    if (!(locations.isSuccess && assets.isSuccess)) return undefined

    const graph = buildGraph(locations.data, assets.data)
    const tree = buildTree(graph)

    return tree
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
        </div>

        <Separator className="mb-6 h-auto overflow-hidden" orientation="vertical" />

        <div className="mb-6 overflow-y-auto p-6 pt-2">
          <Typography variant="h3">MOTORS H12D - Stage 3</Typography>
        </div>
      </CardContent>
    </Card>
  )
}

type TTree = {
  id: string
  name: string
  children?: TTree[]
}

type TGraphNode = {
  id: string
  attributes?: Record<string, unknown>
}

class Graph {
  private _nodes = new Map<string, TGraphNode["attributes"]>()
  private _edges = new Map<string, Set<TGraphNode["id"]>>()

  get nodes() {
    return this._nodes
  }

  get edges() {
    return this._edges
  }

  hasNode(id: TGraphNode["id"]): boolean {
    return this._nodes.has(id)
  }

  getNode(id: TGraphNode["id"]): TGraphNode["attributes"] | undefined {
    return this._nodes.get(id)
  }

  setNode(id: TGraphNode["id"], attributes?: TGraphNode["attributes"]): void {
    this._nodes.set(id, attributes)
  }

  setEdge(parentId: TGraphNode["id"], childId: TGraphNode["id"]): void {
    if (!this._edges.has(parentId)) {
      this._edges.set(parentId, new Set())
    }

    this._edges.get(parentId)!.add(childId)
  }
}

function buildGraph(locations: CompanySchemas.TLocations, assets: CompanySchemas.TAssets) {
  const graph = new Graph()

  for (let locationIndex = 0; locationIndex < locations.length; locationIndex++) {
    const location = locations[locationIndex]

    graph.setNode(location.id, location)

    if (location.parentId) {
      if (!graph.hasNode(location.parentId)) {
        graph.setNode(location.parentId)
      }

      graph.setEdge(location.parentId, location.id)
    }
  }

  for (let assetsIndex = 0; assetsIndex < assets.length; assetsIndex++) {
    const asset = assets[assetsIndex]

    graph.setNode(asset.id, asset)

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

  const tree: TTree[] = []

  function buildSubtree(nodeId: string): TTree {
    const node = graph.getNode(nodeId)
    const children = graph.edges.get(nodeId)

    if (children) {
      node!.children = Array.from(children).map(buildSubtree)
    }

    return node as TTree
  }

  for (const root of roots) {
    const subTree = buildSubtree(root)

    tree.push(subTree)
  }

  return tree
}
