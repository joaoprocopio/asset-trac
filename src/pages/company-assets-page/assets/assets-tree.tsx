import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { useAtomValue } from "jotai"
import {
  BoxIcon,
  ChevronDownIcon,
  CircleIcon,
  CodepenIcon,
  MapPinIcon,
  ZapIcon,
} from "lucide-react"
import { useLayoutEffect, useMemo, useRef, useState } from "react"

import { CompanyAtoms } from "~/atoms"
import { Skeleton } from "~/components/skeleton"
import { Tree } from "~/components/tree"
import { CompanyConstants } from "~/constants"
import { CompanySchemas } from "~/schemas"
import { CompanyServices } from "~/services"

// TODO: fazer a filtragem https://ant.design/components/tree#tree-demo-search
export interface IAssetsTree extends React.HTMLAttributes<HTMLDivElement> {
  selectedAssetId?: string
  handleChangeSelectedAssetId: (assetIds: string[]) => void
}

export function AssetsTree({
  selectedAssetId,
  handleChangeSelectedAssetId,
  ...props
}: IAssetsTree) {
  const [mounted, setMounted] = useState<boolean>(false)

  const treeWrapperRef = useRef<HTMLDivElement>(null)

  const company = useAtomValue(CompanyAtoms.selectedCompanyAtom)

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

  useLayoutEffect(() => setMounted(true), [])

  return (
    <div ref={treeWrapperRef} {...props}>
      {!!(!tree && locations.isLoading && assets.isLoading) && <AssetsTreeSkeleton />}

      {!!(tree && mounted && locations.isSuccess && assets.isSuccess) && (
        <Tree
          className="!border-0"
          fieldNames={{
            key: "id",
            children: "children",
            title: "name",
          }}
          defaultExpandAll={false}
          defaultSelectedKeys={[selectedAssetId || ""]}
          showLine={true}
          virtual={true}
          showIcon={true}
          selectable={true}
          height={treeWrapperRef.current!.offsetHeight - 48}
          itemHeight={28}
          switcherIcon={AssetsTreeNodeSwitcherIcon}
          icon={AssetsTreeNodeIcon}
          titleRender={AssetsTreeNodeTitle}
          treeData={tree}
          onSelect={(selectedKeys) => handleChangeSelectedAssetId(selectedKeys as string[])}
        />
      )}
    </div>
  )
}

function AssetsTreeSkeleton() {
  return (
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
  )
}

function AssetsTreeNodeSwitcherIcon(props) {
  return (
    <ChevronDownIcon
      className={clsx("h-full w-4 transition-all", {
        "-rotate-90": props.expanded,
      })}
    />
  )
}

function AssetsTreeNodeIcon(props) {
  switch (props.data.type) {
    case "location":
      return <MapPinIcon className="mx-auto h-full w-4" />
    case "asset":
      return <BoxIcon className="mx-auto h-full w-4" />
    case "component":
      return <CodepenIcon className="mx-auto h-full w-4" />
  }
}

function AssetsTreeNodeTitle(props) {
  if (!(props.status && props.sensorType)) return props.name

  let Icon
  let className = "ml-2 inline-block w-3 h-4"
  const isAlert = props.status === CompanyConstants.AssetStatus.Alert
  const isOperating = props.status === CompanyConstants.AssetStatus.Operating
  const isEnergyType = props.sensorType === CompanyConstants.AssetSensorType.Energy
  const isVibrationType = props.sensorType === CompanyConstants.AssetSensorType.Vibration

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

  return (
    <>
      {props.name} <Icon className={className} />
    </>
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
