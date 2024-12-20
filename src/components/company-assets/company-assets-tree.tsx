import clsx from "clsx"
import { useAtom, useSetAtom } from "jotai"
import { RESET } from "jotai/utils"
import { BoxIcon, CodepenIcon, InfoIcon, MapPinIcon, ZapIcon } from "lucide-react"
import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { Virtuoso } from "react-virtuoso"

import { CompanyAtoms } from "~/atoms"
import { buttonVariants } from "~/components/button"
import { Skeleton } from "~/components/skeleton"
import { Typography } from "~/components/typography"
import { CompanyConstants } from "~/constants"
import { Graph } from "~/lib/graph"
import type { CompanySchemas } from "~/schemas"
import { cn } from "~/utils"

export interface ICompanyAssetsTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  locations: CompanySchemas.TLocations
  assets: CompanySchemas.TAssets
}

export function CompanyAssetsTree({ locations, assets, ...props }: ICompanyAssetsTreeProps) {
  const [mounted, setMounted] = useState<boolean>(false)

  const [selectedAssetName] = useAtom(CompanyAtoms.selectedAssetNameAtom)
  const [selectedAssetStatus] = useAtom(CompanyAtoms.selectedAssetStatusAtom)
  const [selectedAssetId, setSelectedAssetId] = useAtom(CompanyAtoms.selectedAssetIdAtom)
  const setSelectedAsset = useSetAtom(CompanyAtoms.selectedAssetAtom)

  const graph = useMemo(() => {
    const nextGraph = buildGraph(locations, assets)

    return nextGraph
  }, [locations, assets])

  const flattenedNodes = useMemo(() => {
    const shouldMatchName = !!selectedAssetName
    const shouldMatchStatus = !!selectedAssetStatus

    let filteredNodes

    if (!(shouldMatchName || shouldMatchStatus)) {
      filteredNodes = structuredClone(graph.nodes)
    } else {
      filteredNodes = graph.filterNodes((node) => {
        const matchName = () => node.name.indexOf(selectedAssetName) >= 0
        const matchStatus = () => node.type !== "location" && node.status === selectedAssetStatus

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
    }

    const filteredTree = graph.buildBacktracedTree(filteredNodes)
    const flattenedNodes = graph.flattenTreeNodes(filteredTree)

    return flattenedNodes
  }, [selectedAssetStatus, selectedAssetName, graph])

  const handleSelect = useCallback(
    (selectedNodeId: string) => {
      if (!selectedNodeId) {
        setSelectedAssetId(RESET)
        setSelectedAsset(RESET)
        return
      }

      setSelectedAssetId(selectedNodeId)

      const asset = graph.getNode(selectedNodeId)

      if (!asset) {
        setSelectedAssetId(RESET)
        setSelectedAsset(RESET)
        return
      }

      setSelectedAsset(asset as CompanySchemas.TAsset | CompanySchemas.TLocation)
    },
    [graph, setSelectedAsset, setSelectedAssetId]
  )

  useEffect(() => {
    if (!selectedAssetId) return
    if (mounted) return

    handleSelect(selectedAssetId)
  }, [mounted, selectedAssetId, handleSelect])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div {...props}>
      {!!(mounted && graph && !flattenedNodes.length) && (
        <Typography className="mt-10 pr-6 text-center" variant="h5">
          No results for this search
        </Typography>
      )}

      {!(mounted && graph && flattenedNodes) && <CompanyAssetsTreeSkeleton />}

      {!!(mounted && graph && flattenedNodes.length) && (
        <Suspense fallback={<CompanyAssetsTreeSkeleton />}>
          <Virtuoso
            totalCount={flattenedNodes.length + 2}
            itemContent={(index) => {
              if (index === 0 || index === flattenedNodes.length + 1) {
                return <div className="h-6 w-full bg-background" />
              }

              const data = flattenedNodes[index - 1]
              let title = data.name

              const classes = {
                "fill-destructive text-destructive":
                  data.status === CompanyConstants.AssetStatus.Alert,
                "fill-success text-success": data.status === CompanyConstants.AssetStatus.Operating,
              }

              if (selectedAssetName) {
                const index = data.name.indexOf(selectedAssetName)
                const beforeStr = data.name.substring(0, index)
                const afterStr = data.name.slice(index + selectedAssetName.length)

                if (index > -1) {
                  title = (
                    <>
                      {beforeStr}
                      <span className="font-bold">{selectedAssetName}</span>
                      {afterStr}
                    </>
                  )
                }
              }

              return (
                <div
                  className={clsx("flex items-center", {
                    "mb-1": index < flattenedNodes.length,
                  })}>
                  {/* Indent */}
                  {Array.from({ length: data.level }).map((_, index) => (
                    <div key={index} className="w-8" />
                  ))}

                  <button
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "px-0 pr-2.5 font-normal data-[selected=true]:bg-muted",
                    })}
                    data-selected={data.id === selectedAssetId}
                    onClick={() => handleSelect(data.id)}>
                    {data.type === "location" && (
                      <div className="w-8">
                        <MapPinIcon className="h-4 w-full" />
                      </div>
                    )}
                    {data.type === "asset" && (
                      <div className="w-8">
                        <BoxIcon className="h-4 w-full" />
                      </div>
                    )}
                    {data.type === "component" && (
                      <div className="w-8">
                        <CodepenIcon className="h-4 w-full" />
                      </div>
                    )}

                    <span className="first-letter:uppercase">{title}</span>
                  </button>

                  {/* End icon */}
                  {data.sensorType === CompanyConstants.AssetSensorType.Energy && (
                    <div className="w-8">
                      <ZapIcon className={cn("h-4 w-full", classes)} />
                    </div>
                  )}
                  {data.sensorType === CompanyConstants.AssetSensorType.Vibration && (
                    <div className="w-8">
                      <InfoIcon className={cn("h-3 w-full", classes)} />
                    </div>
                  )}
                </div>
              )
            }}
          />
        </Suspense>
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
    <div className={cn("space-y-px p-6", className)} {...props}>
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

function buildGraph(locations: CompanySchemas.TLocations, assets: CompanySchemas.TAssets) {
  const graph = new Graph<
    | (CompanySchemas.TLocation & { type: "location" })
    | (CompanySchemas.TAsset & { type: "component" | "asset" })
  >()

  for (const location of locations) {
    graph.setNode(location.id, {
      type: "location",
      id: location.id,
      name: location.name.toLowerCase(),
      parentId: location.parentId,
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
      type: asset.sensorId ? "component" : "asset",
      id: asset.id,
      name: asset.name.toLowerCase(),
      parentId: asset.parentId,
      sensorType: asset.sensorType,
      status: asset.status,
      gatewayId: asset.gatewayId,
      sensorId: asset.sensorId,
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
