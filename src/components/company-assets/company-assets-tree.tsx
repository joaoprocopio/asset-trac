import { useQuery } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"
import { useParams } from "react-router"

import { Skeleton } from "~/components/skeleton"
import { cn } from "~/lib/cn"
import {
  assetsFlatTreeOptions,
  assetsGraphOptions,
  assetsOptions,
  locationsOptions,
} from "~/lib/query/query-options"

export function CompanyAssetsTree({ className }: React.HTMLAttributes<HTMLDivElement>) {
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
    estimateSize: () => 24,
  })

  // const [selectedAssetName] = useSearchParam({ paramKey: AssetNameKey })
  // const [selectedAssetStatus] = useSearchParam({ paramKey: AssetStatusKey })
  // const [selectedAssetId, setSelectedAssetId] = useSearchParam({ paramKey: AssetIdKey })

  return (
    <div ref={scrollableRef} className={cn("overflow-y-scroll", className)}>
      <div
        className="relative h-full"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const node = assetsFlatTree.data![virtualRow.index]

          return (
            <div
              key={virtualRow.index}
              className="absolute left-0 top-0 w-full"
              style={{
                height: `${virtualRow.size}px`,
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
