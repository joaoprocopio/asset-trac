import { useSetAtom } from "jotai"
import {
  BoxIcon,
  ChevronDownIcon,
  CircleIcon,
  CodepenIcon,
  MapPinIcon,
  ZapIcon,
} from "lucide-react"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

import { CompanyAtoms } from "~/atoms"
import { Skeleton } from "~/components/skeleton"
import { Tree } from "~/components/tree"
import { CompanyConstants } from "~/constants"
import { Graph } from "~/datastructures"
import type { TSetSearchParamValue } from "~/hooks"
import { RESET_SEARCH_PARAM } from "~/hooks"
import type { CompanySchemas } from "~/schemas"
import { cn } from "~/utils"

// TODO: fazer a filtragem https://ant.design/components/tree#tree-demo-search
export interface ICompanyAssetsTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  locations: CompanySchemas.TLocations
  assets: CompanySchemas.TAssets
  selectedAssetName?: string
  selectedAssetStatus?: CompanyConstants.TAssetStatus
  selectedAssetId?: string
  setSelectedAssetId: TSetSearchParamValue<string>
}

export function CompanyAssetsTree({
  locations,
  assets,
  selectedAssetName,
  selectedAssetStatus,
  selectedAssetId,
  setSelectedAssetId,
  ...props
}: ICompanyAssetsTreeProps) {
  const treeWrapperRef = useRef<HTMLDivElement>(null)

  const [mounted, setMounted] = useState<boolean>(false)

  const defaultSelectedKeys = useMemo(() => [selectedAssetId || ""], [selectedAssetId])
  const graph = useMemo(() => buildGraph(locations, assets), [locations, assets])
  const tree = useMemo(() => graph.buildTree(), [graph])

  const setSelectedAsset = useSetAtom(CompanyAtoms.selectedAssetAtom)

  const handleSelect = useCallback(
    ([selectedNodeId]: React.Key[]) => {
      if (!selectedNodeId) {
        setSelectedAssetId(RESET_SEARCH_PARAM)
        setSelectedAsset(undefined)
        return
      }

      setSelectedAssetId(selectedNodeId as string)

      const asset = graph.getNode(selectedNodeId as string)

      if (!asset) {
        setSelectedAssetId(RESET_SEARCH_PARAM)
        setSelectedAsset(undefined)
        return
      }

      setSelectedAsset(asset as CompanySchemas.TAsset | CompanySchemas.TLocation)
    },
    [graph, setSelectedAsset, setSelectedAssetId]
  )

  useEffect(() => {
    if (mounted) return
    if (!defaultSelectedKeys[0]?.length) return

    handleSelect(defaultSelectedKeys)
  }, [mounted, defaultSelectedKeys, handleSelect])

  useEffect(() => {}, [selectedAssetName])

  useEffect(() => {}, [selectedAssetStatus])

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div ref={treeWrapperRef} {...props}>
      {mounted && graph && tree ? (
        <Tree
          className="!border-0"
          fieldNames={{
            key: "id",
            children: "children",
            title: "name",
          }}
          treeData={tree}
          defaultSelectedKeys={defaultSelectedKeys}
          showLine={true}
          virtual={true}
          showIcon={true}
          selectable={true}
          height={treeWrapperRef.current!.offsetHeight - 48}
          itemHeight={28}
          switcherIcon={CompanyAssetsTreeNodeSwitcherIcon}
          icon={CompanyAssetsTreeNodeIcon}
          titleRender={CompanyAssetsTreeNodeTitle}
          onSelect={handleSelect}
        />
      ) : (
        <CompanyAssetsTreeSkeleton className="pr-6" />
      )}
    </div>
  )
}

export interface ICompanyAssetsTreeSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CompanyAssetsTreeSkeleton({
  className,
  ...props
}: ICompanyAssetsTreeSkeletonProps) {
  return (
    <div className={cn("space-y-px", className)} {...props}>
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

function CompanyAssetsTreeNodeSwitcherIcon(props) {
  return (
    <ChevronDownIcon
      className={cn("h-full w-4", {
        "-rotate-90": props.expanded,
      })}
    />
  )
}

function CompanyAssetsTreeNodeIcon(props) {
  switch (props.data.type) {
    case "location":
      return <MapPinIcon className="mx-auto h-full w-4" />
    case "asset":
      return <BoxIcon className="mx-auto h-full w-4" />
    case "component":
      return <CodepenIcon className="mx-auto h-full w-4" />
  }
}

function CompanyAssetsTreeNodeTitle(props) {
  if (!(props.status && props.sensorId)) return props.name

  const classes = cn("ml-2 inline-block h-4 w-3", {
    "fill-destructive text-destructive": props.status === CompanyConstants.AssetStatus.Alert,
    "fill-success text-success": props.status === CompanyConstants.AssetStatus.Operating,
  })

  return (
    <>
      {props.name}

      {props.sensorType === CompanyConstants.AssetSensorType.Energy && (
        <ZapIcon className={classes} />
      )}
      {props.sensorType === CompanyConstants.AssetSensorType.Vibration && (
        <CircleIcon className={classes} />
      )}
    </>
  )
}

function buildGraph(locations: CompanySchemas.TLocations, assets: CompanySchemas.TAssets) {
  const graph = new Graph()

  for (const location of locations) {
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

  for (const asset of assets) {
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
