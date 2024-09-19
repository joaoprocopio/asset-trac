import { useAtom, useSetAtom } from "jotai"
import { RESET } from "jotai/utils"
import {
  BoxIcon,
  ChevronDownIcon,
  CircleIcon,
  CodepenIcon,
  MapPinIcon,
  ZapIcon,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { CompanyAtoms } from "~/atoms"
import { Skeleton } from "~/components/skeleton"
import { Tree } from "~/components/tree"
import { Typography } from "~/components/typography"
import { CompanyConstants } from "~/constants"
import { Graph } from "~/datastructures"
import type { CompanySchemas } from "~/schemas"
import { cn } from "~/utils"

export interface ICompanyAssetsTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  locations: CompanySchemas.TLocations
  assets: CompanySchemas.TAssets
}

export function CompanyAssetsTree({ locations, assets, ...props }: ICompanyAssetsTreeProps) {
  const treeWrapperRef = useRef<HTMLDivElement>(null)

  const [mounted, setMounted] = useState<boolean>(false)

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)

  const [selectedAssetName] = useAtom(CompanyAtoms.selectedAssetNameAtom)
  const [selectedAssetStatus] = useAtom(CompanyAtoms.selectedAssetStatusAtom)
  const [selectedAssetId, setSelectedAssetId] = useAtom(CompanyAtoms.selectedAssetIdAtom)

  const defaultSelectedKeys = useMemo(() => [selectedAssetId || ""], [selectedAssetId])
  const graph = useMemo(() => buildGraph(locations, assets), [locations, assets])
  const tree = useMemo(() => graph.buildTree(), [graph])
  const filteredTree = useMemo(() => {
    if (!selectedAssetStatus && !selectedAssetName) return tree

    const filteredNodes = graph.filterNodes((node) => {
      const shouldMatchName = !!selectedAssetName
      const shouldMatchStatus = !!selectedAssetStatus

      const matchName = () => node.name.toLowerCase().indexOf(selectedAssetName.toLowerCase()) >= 0
      const matchStatus = () => node.status === selectedAssetStatus

      if (shouldMatchStatus && shouldMatchName) {
        return matchStatus() && matchName()
      }
      if (shouldMatchName) {
        return matchName()
      }
      if (shouldMatchStatus) {
        return matchStatus()
      }
      return false
    })

    const filteredTree = graph.buildBacktracedTree(filteredNodes)
    const nextExpandedKeys = Array.from(filteredNodes.values()).map((node) => node.id)

    setExpandedKeys(nextExpandedKeys)
    setAutoExpandParent(true)

    return filteredTree
  }, [graph, tree, selectedAssetStatus, selectedAssetName])

  const setSelectedAsset = useSetAtom(CompanyAtoms.selectedAssetAtom)

  const handleSelect = useCallback(
    ([selectedNodeId]: React.Key[]) => {
      if (!selectedNodeId) {
        setSelectedAssetId(RESET)
        setSelectedAsset(RESET)
        return
      }

      setSelectedAssetId(selectedNodeId as string)

      const asset = graph.getNode(selectedNodeId as string)

      if (!asset) {
        setSelectedAssetId(RESET)
        setSelectedAsset(RESET)
        return
      }

      setSelectedAsset(asset as CompanySchemas.TAsset | CompanySchemas.TLocation)
    },
    [graph, setSelectedAsset, setSelectedAssetId]
  )

  const handleExpand = useCallback((newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys)
    setAutoExpandParent(false)
  }, [])

  useEffect(() => {
    if (!defaultSelectedKeys[0]?.length) return
    if (mounted) return

    handleSelect(defaultSelectedKeys)
  }, [mounted, defaultSelectedKeys, handleSelect])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div ref={treeWrapperRef} {...props}>
      {!!(mounted && graph && !filteredTree.length) && (
        <Typography className="mt-10 pr-6 text-center" variant="h5">
          No results for this search
        </Typography>
      )}

      {!!(mounted && graph && filteredTree.length) && (
        <Tree
          className="!border-0"
          fieldNames={{
            key: "id",
            children: "children",
            title: "name",
          }}
          treeData={filteredTree}
          defaultSelectedKeys={defaultSelectedKeys}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          showLine={true}
          showIcon={true}
          height={treeWrapperRef.current!.offsetHeight - 48}
          itemHeight={28}
          icon={CompanyAssetsTreeNodeIcon}
          switcherIcon={CompanyAssetsTreeNodeSwitcherIcon}
          titleRender={(props) => (
            <CompanyAssetsTreeNodeTitle {...props} searchValue={selectedAssetName} />
          )}
          onSelect={handleSelect}
          onExpand={handleExpand}
        />
      )}

      {!(mounted && graph && filteredTree) && <CompanyAssetsTreeSkeleton className="pr-6" />}
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
  const classes = cn("ml-2 inline-block h-4 w-3", {
    "fill-destructive text-destructive": props.status === CompanyConstants.AssetStatus.Alert,
    "fill-success text-success": props.status === CompanyConstants.AssetStatus.Operating,
  })

  const index = props.name.indexOf(props.searchValue)
  const beforeStr = props.name.substring(0, index)
  const afterStr = props.name.slice(index + props.searchValue.length)

  const title =
    index > -1 ? (
      <span key={props.id}>
        {beforeStr}
        <span className="font-bold">{props.searchValue}</span>
        {afterStr}
      </span>
    ) : (
      <span key={props.id}>{props.name}</span>
    )

  return (
    <>
      {title}

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
      name: location.name.toLowerCase(),
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
      name: asset.name.toLowerCase(),
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
