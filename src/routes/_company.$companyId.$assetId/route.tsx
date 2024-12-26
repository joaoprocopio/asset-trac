import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"

import { Skeleton } from "~/components/skeleton"
import { Typography } from "~/components/typography"
import { AssetType } from "~/constants/company-constants"
import type { Graph, TGraphNode } from "~/lib/graph"
import { queryClient } from "~/lib/query/query-client"
import { assetsGraphOptions, assetsOptions, locationsOptions } from "~/lib/query/query-options"
import type { TAssetNode, TLocationNode } from "~/schemas/company-schemas"

import type { Route } from "./+types/route"

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
  const companyId = args.params.companyId

  await Promise.all([
    queryClient.prefetchQuery(locationsOptions(companyId)),
    queryClient.prefetchQuery(assetsOptions(companyId)),
  ])
}

export default function AssetDetails() {
  const params = useParams()

  const locations = useQuery(locationsOptions(params.companyId!))
  const assets = useQuery(assetsOptions(params.companyId!))

  const selectedAsset = useQuery({
    ...assetsGraphOptions(params.companyId!, locations.data!, assets.data!),
    enabled: locations.isSuccess && assets.isSuccess && typeof params.assetId === "string",
    select: getAssetNode(params.assetId!),
  })

  const isLoading = selectedAsset.isPending || selectedAsset.isFetching

  return (
    <div>
      <Typography className="border-b px-6 py-4 align-middle first-letter:uppercase" variant="h3">
        {isLoading ? <Skeleton className="h-8 w-36" /> : selectedAsset.data?.name}
      </Typography>

      <AssetDetailsLayout>
        {isLoading ? (
          <AssetDetailsLoading />
        ) : (
          <AssetDetailsSwitch selectedAsset={selectedAsset.data!} />
        )}
      </AssetDetailsLayout>
    </div>
  )
}

function getAssetNode(assetId: string) {
  return function <Node>(graph: Graph<Node>) {
    return graph.getNode(assetId)
  }
}

function AssetDetailsLayout({ children }: React.PropsWithChildren) {
  return <div>{children}</div>
}

function AssetDetailsLoading() {
  return <div>TODO: loading</div>
}

function AssetDetailsSwitch({
  selectedAsset,
}: {
  selectedAsset: TGraphNode<TLocationNode | TAssetNode>
}) {
  // Não acredito que vale a pena usar os hooks do react query aqui, esse componente é puramente exibicional.
  // Gostaria de deixar ele somente com a responsabilidade de exibir corretamente.
  switch (selectedAsset?.type) {
    case AssetType.Asset:
      return AssetType.Asset
    case AssetType.Component:
      return AssetType.Component
    case AssetType.Location:
      return AssetType.Location
  }
}
