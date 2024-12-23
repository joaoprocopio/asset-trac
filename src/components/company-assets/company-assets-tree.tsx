import { useQuery } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"
import { BoxIcon, CodepenIcon, InfoIcon, MapPinIcon, ZapIcon } from "lucide-react"
import { useRef } from "react"
import { useParams } from "react-router"

import { buttonVariants } from "~/components/button"
import { Skeleton } from "~/components/skeleton"
import { AssetSensorType, AssetStatus } from "~/constants/company-constants"
import { cn } from "~/lib/cn"
import {
  assetsFlatTreeOptions,
  assetsGraphOptions,
  assetsOptions,
  locationsOptions,
} from "~/lib/query/query-options"
import { array } from "~/lib/utils"

const NODE_HEIGHT = 32 as const

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
    overscan: 5,
    getScrollElement: () => scrollableRef.current,
    estimateSize: () => NODE_HEIGHT,
  })

  // const [selectedAssetName] = useSearchParam({ paramKey: AssetNameKey })
  // const [selectedAssetStatus] = useSearchParam({ paramKey: AssetStatusKey })
  // const [selectedAssetId, setSelectedAssetId] = useSearchParam({ paramKey: AssetIdKey })

  if (assetsFlatTree.isPending || assetsFlatTree.isFetching) {
    return (
      <div {...props}>
        <div className="space-y-px pr-6">
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
        className="relative h-full"
        style={{
          height: rowVirtualizer.getTotalSize(),
        }}>
        {assetsFlatTree.isSuccess &&
          rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const data = assetsFlatTree.data![virtualRow.index]

            const classes = {
              "fill-destructive text-destructive": data.status === AssetStatus.Alert,
              "fill-success text-success": data.status === AssetStatus.Operating,
            }

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
                    "mb-1": virtualRow.index < assetsFlatTree.data.length,
                  })}>
                  {/* Indent */}
                  {array(data.level).map((_, index) => (
                    <div key={index} className="w-8" />
                  ))}

                  <button
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "px-0 pr-2.5 font-normal data-[selected=true]:bg-muted",
                    })}
                    // data-selected={data.id === selectedAssetId}
                    // onClick={() => handleSelect(data.id)}
                  >
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

                    <span className="first-letter:uppercase">{data.name}</span>
                  </button>

                  {/* End icon */}
                  {data.sensorType === AssetSensorType.Energy && (
                    <div className="w-8">
                      <ZapIcon className={cn("h-4 w-full", classes)} />
                    </div>
                  )}
                  {data.sensorType === AssetSensorType.Vibration && (
                    <div className="w-8">
                      <InfoIcon className={cn("h-3 w-full", classes)} />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
