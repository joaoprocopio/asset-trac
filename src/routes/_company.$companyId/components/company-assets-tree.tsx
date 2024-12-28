import { useQuery } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"
import { BoxIcon, CodepenIcon, InfoIcon, MapPinIcon, SearchXIcon, ZapIcon } from "lucide-react"
import { useMemo, useRef } from "react"
import { Link, useLocation, useParams } from "react-router"

import { buttonVariants } from "~/components/button"
import { Skeleton } from "~/components/skeleton"
import { Typography } from "~/components/typography"
import {
  AssetNameKey,
  AssetSensorType,
  AssetStatus,
  AssetStatusKey,
  AssetType,
  type TAssetStatus,
} from "~/constants/company-constants"
import { useSearchParam } from "~/hooks/use-search-param"
import { cn } from "~/lib/cn"
import {
  assetsFlatTreeOptions,
  assetsGraphOptions,
  assetsOptions,
  locationsOptions,
} from "~/lib/query/query-options"
import type { TFlatTreeNode } from "~/lib/tree"
import { array } from "~/lib/utils"
import type { TAssetNode, TLocationNode } from "~/schemas/company-schemas"

const OVERSCAN = 5
const NODE_PADDING = 4
const NODE_HEIGHT = 32
const CONTAINER_PADDING = NODE_PADDING * 2
const PADDED_NODE_HEIGHT = NODE_HEIGHT + NODE_PADDING

export function CompanyAssetsTree({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const scrollableRef = useRef<HTMLDivElement>(null)

  const location = useLocation()
  const params = useParams()

  const [selectedAssetName] = useSearchParam({ paramKey: AssetNameKey })
  const [selectedAssetStatus] = useSearchParam<TAssetStatus>({ paramKey: AssetStatusKey })

  const filter = useMemo(
    () => ({
      name: selectedAssetName,
      status: selectedAssetStatus,
    }),
    [selectedAssetName, selectedAssetStatus]
  )

  const locations = useQuery(locationsOptions(params.companyId!))
  const assets = useQuery(assetsOptions(params.companyId!))

  const assetsGraph = useQuery({
    ...assetsGraphOptions(params.companyId!, locations.data!, assets.data!),
    enabled: locations.isSuccess && assets.isSuccess,
  })
  const assetsFlatTree = useQuery({
    ...assetsFlatTreeOptions(params.companyId!, assetsGraph.data!, filter),
    enabled: assetsGraph.isSuccess,
  })

  const rowVirtualizer = useVirtualizer({
    enabled: assetsFlatTree.isSuccess,
    count: assetsFlatTree.data?.length as number,
    overscan: OVERSCAN,
    getScrollElement: () => scrollableRef.current,
    estimateSize: () => PADDED_NODE_HEIGHT,
  })

  if (assetsGraph.isLoading || assetsFlatTree.isLoading) {
    return (
      <div className={cn("overflow-y-scroll", className)} {...props}>
        <div
          className="space-y-1 px-6"
          style={{
            marginTop: CONTAINER_PADDING,
            marginBottom: CONTAINER_PADDING,
          }}>
          {array(10).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" style={{ height: NODE_HEIGHT }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={scrollableRef} className={cn("overflow-y-scroll px-6", className)} {...props}>
      <div
        className="relative w-full"
        style={{
          height: rowVirtualizer.getTotalSize(),
          marginTop: CONTAINER_PADDING,
          marginBottom: CONTAINER_PADDING,
        }}>
        {assetsFlatTree.data?.length ? (
          rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const node = assetsFlatTree.data![virtualRow.index]

            let nodeLabel: React.ReactNode = node.name

            if (selectedAssetName?.length) {
              const matchIndex = node.name.toLowerCase().indexOf(selectedAssetName.toLowerCase())

              if (matchIndex >= 0) {
                const beforeMatchStr = node.name.substring(0, matchIndex)
                const matchStr = node.name.substring(
                  matchIndex,
                  matchIndex + selectedAssetName.length
                )
                const afterMatchStr = node.name.substring(matchIndex + selectedAssetName.length)

                nodeLabel = (
                  <>
                    {beforeMatchStr}
                    <span className="font-bold">{matchStr}</span>
                    {afterMatchStr}
                  </>
                )
              }
            }

            return (
              <div
                key={virtualRow.key}
                className="absolute left-0 top-0 w-full"
                style={{
                  height: PADDED_NODE_HEIGHT,
                  transform: `translateY(${virtualRow.start}px)`,
                }}>
                <div className="flex items-center">
                  <Indent node={node} />

                  <Link
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "px-0 pr-2.5 font-normal data-[selected=true]:bg-muted",
                    })}
                    style={{
                      height: NODE_HEIGHT,
                    }}
                    to={{
                      pathname: node.id,
                      search: location.search,
                    }}
                    data-selected={node.id === params?.assetId}>
                    <StartIcon node={node} />

                    <span>{nodeLabel}</span>
                  </Link>

                  <EndIcon node={node} />
                </div>
              </div>
            )
          })
        ) : (
          <>
            <div className="mt-10 space-y-1.5 text-center">
              <SearchXIcon className="h-14 w-full" />

              <Typography variant="h3">No results found for this search</Typography>

              <Typography className="mx-auto" affects="muted">
                There is no result available for this search
              </Typography>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Indent({ node }: { node: TFlatTreeNode<TLocationNode | TAssetNode> }) {
  return array(node.level).map((_, index) => <div key={index} className="w-8" />)
}

function StartIcon({ node }: { node: TFlatTreeNode<TLocationNode | TAssetNode> }) {
  switch (node.type) {
    case AssetType.Location:
      return (
        <div className="w-8">
          <MapPinIcon className="h-4 w-full" />
        </div>
      )
    case AssetType.Asset:
      return (
        <div className="w-8">
          <BoxIcon className="h-4 w-full" />
        </div>
      )
    case AssetType.Component:
      return (
        <div className="w-8">
          <CodepenIcon className="h-4 w-full" />
        </div>
      )
  }
}

function EndIcon({ node }: { node: TFlatTreeNode<TLocationNode | TAssetNode> }) {
  if (node.type !== AssetType.Component) {
    return undefined
  }

  const colors = {
    "fill-destructive text-destructive": node.status === AssetStatus.Alert,
    "fill-success text-success": node.status === AssetStatus.Operating,
  }

  switch (node.sensorType) {
    case AssetSensorType.Energy:
      return (
        <div className="w-8">
          <ZapIcon className={cn("h-4 w-full", colors)} />
        </div>
      )
    case AssetSensorType.Vibration:
      return (
        <div className="w-8">
          <InfoIcon className={cn("h-3 w-full", colors)} />
        </div>
      )
  }
}
