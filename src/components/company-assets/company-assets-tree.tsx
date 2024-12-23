import { useQuery } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"
import { useParams } from "react-router"

import { Skeleton } from "~/components/skeleton"
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
          {array(15).map((_, index) => (
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
            const node = assetsFlatTree.data![virtualRow.index]

            return (
              <div
                key={virtualRow.index}
                className="absolute left-0 top-0 w-full"
                style={{
                  height: virtualRow.size,
                  transform: `translateY(${virtualRow.start}px)`,
                }}>
                {node.name}
              </div>
            )
          })}
      </div>
    </div>
  )
}
