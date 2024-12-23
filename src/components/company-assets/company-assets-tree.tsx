import { useQuery } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"
import { BoxIcon, CodepenIcon, InfoIcon, MapPinIcon, ZapIcon } from "lucide-react"
import { useRef } from "react"
import { useParams } from "react-router"

import { buttonVariants } from "~/components/button"
import { Skeleton } from "~/components/skeleton"
import { AssetSensorType, AssetStatus, AssetType } from "~/constants/company-constants"
import { cn } from "~/lib/cn"
import {
  assetsFlatTreeOptions,
  assetsGraphOptions,
  assetsOptions,
  locationsOptions,
} from "~/lib/query/query-options"
import { array } from "~/lib/utils"

const NODE_PADDING = 4
const NODE_HEIGHT = 32
const PADDED_NODE_HEIGHT = NODE_HEIGHT + NODE_PADDING

export function CompanyAssetsTree(props: React.HTMLAttributes<HTMLDivElement>) {
  const scrollableRef = useRef<HTMLDivElement>(null)

  const params = useParams()

  const locations = useQuery(locationsOptions(params.companyId!))
  const assets = useQuery(assetsOptions(params.companyId!))
  const assetsGraph = useQuery({
    ...assetsGraphOptions(params.companyId!, locations.data!, assets.data!),
    enabled: locations.isSuccess && assets.isSuccess,
  })
  const assetsFlatTree = useQuery({
    ...assetsFlatTreeOptions(params.companyId!, assetsGraph.data!),
    enabled: assetsGraph.isSuccess,
  })

  const rowVirtualizer = useVirtualizer({
    enabled: assetsFlatTree.isSuccess,
    count: assetsFlatTree.data?.length as number,
    getScrollElement: () => scrollableRef.current,
    estimateSize: () => PADDED_NODE_HEIGHT,
  })

  // const [selectedAssetName] = useSearchParam({ paramKey: AssetNameKey })
  // const [selectedAssetStatus] = useSearchParam({ paramKey: AssetStatusKey })
  // const [selectedAssetId, setSelectedAssetId] = useSearchParam({ paramKey: AssetIdKey })

  if (assetsFlatTree.isPending || assetsFlatTree.isFetching) {
    return (
      <div {...props}>
        <div className="my-2 space-y-px pr-6">
          {array(10).map((_, index) => (
            <Skeleton key={index} className="w-full" style={{ height: NODE_HEIGHT }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={scrollableRef} {...props}>
      <div
        className="relative my-2 h-full"
        style={{
          height: rowVirtualizer.getTotalSize(),
        }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const node = assetsFlatTree.data![virtualRow.index]

          return (
            <div
              key={virtualRow.index}
              className="absolute left-0 top-0 w-full"
              style={{
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`,
              }}>
              <div
                className={cn("flex items-center", {
                  "mb-1": virtualRow.index < assetsFlatTree.data!.length,
                })}>
                {renderIndent(node)}

                <button
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "px-0 pr-2.5 font-normal",
                  })}>
                  {renderStartIcon(node)}

                  <span className="first-letter:uppercase">{node.name}</span>
                </button>

                {renderEndIcon(node)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function renderIndent(node) {
  return array(node.level).map((_, index) => <div key={index} className="w-8" />)
}

function renderStartIcon(node) {
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
    default:
      return undefined
  }
}

function renderEndIcon(node) {
  const classes = {
    "fill-destructive text-destructive": node.status === AssetStatus.Alert,
    "fill-success text-success": node.status === AssetStatus.Operating,
  }

  switch (node.sensorType) {
    case AssetSensorType.Energy:
      return (
        <div className="w-8">
          <ZapIcon className={cn("h-4 w-full", classes)} />
        </div>
      )
    case AssetSensorType.Vibration:
      return (
        <div className="w-8">
          <InfoIcon className={cn("h-3 w-full", classes)} />
        </div>
      )
    default:
      return undefined
  }
}
