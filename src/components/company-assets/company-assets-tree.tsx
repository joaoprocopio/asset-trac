import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useParams } from "react-router"

import { AssetIdKey, AssetNameKey, AssetStatusKey } from "~/constants/company-constants"
import { useSearchParam } from "~/hooks/use-search-param"
import { Graph } from "~/lib/graph"
import { assetsOptions, locationsOptions } from "~/lib/query/query-options"
import type { TAsset, TAssets, TLocation, TLocations } from "~/schemas/company-schemas"

export function CompanyAssetsTree(props: React.HTMLAttributes<HTMLDivElement>) {
  const params = useParams()

  const locations = useQuery(locationsOptions(params.companyId!))
  const assets = useQuery(assetsOptions(params.companyId!))

  const [selectedAssetName] = useSearchParam({ paramKey: AssetNameKey })
  const [selectedAssetStatus] = useSearchParam({ paramKey: AssetStatusKey })
  const [selectedAssetId, setSelectedAssetId] = useSearchParam({ paramKey: AssetIdKey })

  const graph = useMemo(() => {
    if (!locations.isSuccess || !assets.isSuccess) return undefined

    const nextGraph = buildGraph(locations.data, assets.data)

    return nextGraph
  }, [locations.data, locations.isSuccess, assets.data, assets.isSuccess])

  return <div {...props}>arvore</div>
}

function buildGraph(locations: TLocations, assets: TAssets) {
  type TLocationNode = TLocation & { type: "location" }
  type TAssetNode = Omit<TAsset & { type: "component" | "asset" }, "locationId">

  const graph = new Graph<TLocationNode | TAssetNode>()

  for (const location of locations) {
    graph.addNode(location.id, {
      type: "location",
      id: location.id,
      name: location.name.toLowerCase(),
      parentId: location.parentId,
    })

    if (location.parentId) {
      if (!graph.hasNode(location.parentId)) {
        graph.addNode(location.parentId)
      }

      graph.addEdge(location.parentId, location.id)
    }
  }

  for (const asset of assets) {
    graph.addNode(asset.id, {
      type: asset.sensorId ? "component" : "asset",
      id: asset.id,
      name: asset.name.toLowerCase(),
      parentId: asset.locationId || asset.parentId,
      sensorType: asset.sensorType,
      status: asset.status,
      gatewayId: asset.gatewayId,
      sensorId: asset.sensorId,
    })

    if (asset.parentId) {
      if (!graph.hasNode(asset.parentId)) {
        graph.addNode(asset.parentId)
      }

      graph.addEdge(asset.parentId, asset.id)
    }
  }

  return graph
}
