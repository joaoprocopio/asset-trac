import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"

import {
  assetsGraphOptions,
  assetsOptions,
  assetsTreeOptions,
  locationsOptions,
} from "~/lib/query/query-options"

export function CompanyAssetsTree(props: React.HTMLAttributes<HTMLDivElement>) {
  const params = useParams()

  const locations = useQuery(locationsOptions(params.companyId!))
  const assets = useQuery(assetsOptions(params.companyId!))
  const assetsGraph = useQuery({
    ...assetsGraphOptions(params.companyId!, locations.data!, assets.data!),
    enabled: locations.isSuccess && assets.isSuccess,
  })
  const assetsTree = useQuery({
    ...assetsTreeOptions(params.companyId!, assetsGraph.data!),
    enabled: assetsGraph.isSuccess,
  })

  // const [selectedAssetName] = useSearchParam({ paramKey: AssetNameKey })
  // const [selectedAssetStatus] = useSearchParam({ paramKey: AssetStatusKey })
  // const [selectedAssetId, setSelectedAssetId] = useSearchParam({ paramKey: AssetIdKey })

  return (
    <div {...props}>
      <div className="h-full overflow-y-scroll">
        {assetsTree.isSuccess && <pre>{JSON.stringify(assetsTree.data, null, 2)}</pre>}
      </div>
    </div>
  )
}
