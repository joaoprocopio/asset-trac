import { useQuery } from "@tanstack/react-query"
import {
  InboxIcon,
  InfoIcon,
  RadioIcon,
  RouterIcon,
  UploadCloudIcon,
  XIcon,
  ZapIcon,
} from "lucide-react"
import { useParams } from "react-router"

import { Skeleton } from "~/components/skeleton"
import { Typography } from "~/components/typography"
import {
  AssetSensorType,
  AssetStatus,
  AssetType,
  type TAssetSensorType,
  type TAssetStatus,
} from "~/constants/company-constants"
import { cn } from "~/lib/cn"
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
      {!isLoading ? (
        <AssetDetailsTitleSwitch selectedAsset={selectedAsset.data!} />
      ) : (
        <Skeleton className="h-8 w-36" />
      )}

      <div className="grid grid-cols-2 gap-6 px-6 py-4">
        {!isLoading ? (
          <AssetDetailsViewSwitch selectedAsset={selectedAsset.data!} />
        ) : (
          <AssetDetailsLoading />
        )}
      </div>
    </div>
  )
}

function getAssetNode(assetId: string) {
  return function <Node>(graph: Graph<Node>) {
    return graph.getNode(assetId)
  }
}

function AssetDetailsLoading() {
  return (
    <>
      <Skeleton className="col-span-2 h-12" />
      <Skeleton className="h-12" />
      <Skeleton className="h-12" />
    </>
  )
}

function AssetDetailsTitleSwitch({
  selectedAsset,
}: {
  selectedAsset: TGraphNode<TLocationNode | TAssetNode>
}) {
  switch (selectedAsset.type) {
    case AssetType.Asset:
    case AssetType.Location:
      return (
        <Typography className="border-b px-6 py-4 align-middle first-letter:uppercase" variant="h3">
          {selectedAsset.name}
        </Typography>
      )
    case AssetType.Component:
      return (
        <Typography
          className="flex items-center gap-3 border-b px-6 py-4 align-middle"
          variant="h3">
          <span className="first-letter:uppercase">{selectedAsset.name}</span>
          <span>
            <AssetDetailsIconSwitch selectedAsset={selectedAsset} />
          </span>
        </Typography>
      )
  }
}

function AssetDetailsIconSwitch({ selectedAsset }: { selectedAsset: TGraphNode<TAssetNode> }) {
  const colors = {
    "fill-destructive text-destructive": selectedAsset.status === AssetStatus.Alert,
    "fill-success text-success": selectedAsset.status === AssetStatus.Operating,
  }

  switch (selectedAsset.sensorType) {
    case AssetSensorType.Energy:
      return <ZapIcon className={cn("h-4 w-full", colors)} />
    case AssetSensorType.Vibration:
      return <InfoIcon className={cn("h-3 w-full", colors)} />
  }
}

function AssetDetailsViewSwitch({
  selectedAsset,
}: {
  selectedAsset: TGraphNode<TLocationNode | TAssetNode>
}) {
  switch (selectedAsset.type) {
    case AssetType.Asset:
    case AssetType.Location:
      return (
        <div className="col-span-2 space-y-0.5">
          <Typography variant="h4">Details not available</Typography>
          <Typography variant="p" affects="muted">
            There is no detailed information available for your selection
          </Typography>
        </div>
      )
    case AssetType.Component:
      return (
        <>
          {Boolean(selectedAsset.status) && (
            <div className="col-span-2 space-y-0.5">
              <Typography variant="h5">Status</Typography>

              <Typography affects="muted" className="flex items-center gap-2">
                <span className="first-letter:uppercase">{selectedAsset.status}</span>
              </Typography>
            </div>
          )}

          {Boolean(selectedAsset.sensorId && selectedAsset.sensorType) && (
            <div className="space-y-0.5">
              <Typography variant="h5">Sensor</Typography>

              <Typography affects="muted" className="flex items-center gap-2">
                <RadioIcon className="inline-block h-5 w-5" />
                <span>
                  {selectedAsset.sensorId} ({selectedAsset.sensorType})
                </span>
              </Typography>
            </div>
          )}

          {Boolean(selectedAsset.gatewayId) && (
            <div className="space-y-0.5">
              <Typography variant="h5">Gateway</Typography>

              <Typography affects="muted" className="flex items-center gap-2">
                <RouterIcon className="inline-block h-4 w-4" />
                <span>{selectedAsset.gatewayId}</span>
              </Typography>
            </div>
          )}
        </>
      )
  }
}
