import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { useAtomValue } from "jotai"
import {
  BoxIcon,
  ChevronDownIcon,
  CircleIcon,
  CodepenIcon,
  InboxIcon,
  InfoIcon,
  MapPinIcon,
  SearchIcon,
  ZapIcon,
} from "lucide-react"
import { useMemo, useRef } from "react"

import { CompanyAtoms } from "~/atoms"
import { Button } from "~/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/card"
import { Input } from "~/components/input"
import { Separator } from "~/components/separator"
import { Skeleton } from "~/components/skeleton"
import { Tree } from "~/components/tree"
import { Typography } from "~/components/typography"
import { CompanyConstants } from "~/constants"
import { useDebouncedFn } from "~/hooks/use-debounce"
import { RESET_SEARCH_PARAM, useSearchParam } from "~/hooks/use-search-param"
import type { CompanySchemas } from "~/schemas"
import { CompanyServices } from "~/services"

// TODO: fazer a filtragem https://ant.design/components/tree#tree-demo-search
export function CompanyAssetsPage() {
  const treeWrapperRef = useRef<HTMLDivElement>(null)

  const [assetStatus, setAssetStatus] = useSearchParam<CompanyConstants.TAssetStatus>({
    paramKey: "s",
  })
  const [assetQuery, setAssetQuery] = useSearchParam<string>({
    paramKey: "q",
  })
  const [nodeId, setNodeId] = useSearchParam<string>({
    paramKey: "a",
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

  const graph = useMemo(() => {
    if (!(locations.isSuccess && assets.isSuccess)) return undefined

    const graph = buildGraph(locations.data, assets.data)

    return graph
  }, [locations.data, assets.data, locations.isSuccess, assets.isSuccess])

  const tree = useMemo(() => {
    if (!graph) return undefined

    const tree = buildTree(graph)

    return tree
  }, [graph])

  // TODO: separar o controlled value e debounced value em componentes
  const handleChangeAssetStatus = useDebouncedFn((nextValue: CompanyConstants.TAssetStatus) => {
    if (assetStatus === nextValue) {
      return setAssetStatus(RESET_SEARCH_PARAM)
    }

    return setAssetStatus(nextValue)
  })

  const handleChangeAssetQuery = useDebouncedFn((event) => {
    if (!event.target.value.length) {
      return setAssetQuery(RESET_SEARCH_PARAM)
    }

    return setAssetQuery(event.target.value.trim().toLowerCase())
  })

  const onSelect = useDebouncedFn((nodeIds) => {
    const [nextNodeId] = nodeIds

    if (!nextNodeId || nextNodeId === nodeId) {
      return setNodeId(RESET_SEARCH_PARAM)
    }

    console.log(graph?.getNode(nextNodeId))

    return setNodeId(nextNodeId)
  })

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="border-b">
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
        <div className="flex flex-col">
          <div className="sticky inset-0 z-10 flex gap-6 border-b bg-background px-6 py-4">
            <Input
              onChange={handleChangeAssetQuery}
              startIcon={SearchIcon}
              placeholder="Search assets"
            />

            <div className="flex gap-4">
              <Button
                className="h-10 gap-2"
                variant={
                  assetStatus === CompanyConstants.AssetStatus.Operating ? "default" : "outline"
                }
                onClick={() => handleChangeAssetStatus(CompanyConstants.AssetStatus.Operating)}>
                <ZapIcon className="h-5 w-5" />
                Operating
              </Button>

              <Button
                className="h-10 gap-2"
                variant={assetStatus === CompanyConstants.AssetStatus.Alert ? "default" : "outline"}
                onClick={() => handleChangeAssetStatus(CompanyConstants.AssetStatus.Alert)}>
                <InfoIcon className="h-5 w-5" />
                Critical
              </Button>
            </div>
          </div>

          <div ref={treeWrapperRef} className="flex-grow basis-px p-6 pr-0">
            {!tree && (
              <div className="space-y-px pr-6">
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
              </div>
            )}

            {!!(tree && treeWrapperRef.current) && (
              <Tree
                className="!border-0"
                fieldNames={{
                  key: "id",
                  children: "children",
                  title: "name",
                }}
                showLine={true}
                defaultExpandAll={true}
                virtual={true}
                showIcon={true}
                height={treeWrapperRef.current.offsetHeight - 48}
                itemHeight={28}
                switcherIcon={(props) => {
                  return (
                    <ChevronDownIcon
                      className={clsx("h-full w-4 transition-all", {
                        "-rotate-90": props.expanded,
                      })}
                    />
                  )
                }}
                icon={(props) => {
                  switch (props!.data!.type) {
                    case "location":
                      return <MapPinIcon className="mx-auto h-full w-4" />
                    case "asset":
                      return <BoxIcon className="mx-auto h-full w-4" />
                    case "component":
                      return <CodepenIcon className="mx-auto h-full w-4" />
                  }
                }}
                titleRender={(props) => {
                  if (!(props.status && props.sensorType)) return props.name

                  let Icon
                  let className = "ml-2 inline-block w-3 h-4"
                  const isAlert = props.status === CompanyConstants.AssetStatus.Alert
                  const isOperating = props.status === CompanyConstants.AssetStatus.Operating
                  const isEnergyType = props.sensorType === CompanyConstants.AssetSensorType.Energy
                  const isVibrationType =
                    props.sensorType === CompanyConstants.AssetSensorType.Vibration

                  if (isEnergyType) {
                    Icon = ZapIcon
                  } else if (isVibrationType) {
                    Icon = CircleIcon
                  }

                  if (isAlert) {
                    className += " fill-destructive text-destructive"
                  } else if (isOperating) {
                    className += " fill-success text-success"
                  }

                  if (!Icon) {
                    debugger
                  }

                  return (
                    <>
                      {props.name} <Icon className={className} />
                    </>
                  )
                }}
                selectable={true}
                treeData={tree}
                onSelect={onSelect}
              />
            )}
          </div>
        </div>

        <Separator className="h-auto overflow-hidden" orientation="vertical" />

        <div className="flex flex-col overflow-y-scroll px-6 pb-6 pt-4">
          {!nodeId && (
            <div className="flex flex-grow basis-px flex-col items-center justify-center text-center">
              <InboxIcon className="h-14 w-14" />

              <Typography variant="h3">Empty</Typography>
              <Typography affects="muted">Select any location or asset</Typography>
            </div>
          )}

          {/* TODO: mostrar o gateway */}
          {/* TODO: mostrar o sensor */}
          {/* TODO: mostrar o sensor type */}
          {/* TODO: mostrar o sensor status */}
          {nodeId && <Typography variant="h3">{nodeId}</Typography>}
        </div>
      </CardContent>
    </Card>
  )
}

class Graph {
  private _nodes = new Map<string, Record<string, unknown>>()
  private _edges = new Map<string, Set<string>>()

  get nodes() {
    return this._nodes
  }

  get edges() {
    return this._edges
  }

  hasNode(id: string): boolean {
    return this._nodes.has(id)
  }

  getNode(id: string): Record<string, unknown> | undefined {
    return this._nodes.get(id)
  }

  setNode(id: string, attributes?: Record<string, unknown>): void {
    this._nodes.set(id, attributes ?? {})
  }

  setEdge(parentId: string, childId: string): void {
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
