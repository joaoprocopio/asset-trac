import { useQuery } from "@tanstack/react-query"
import { InboxIcon, RadioIcon, RouterIcon } from "lucide-react"
import { useParams } from "react-router"

import { Typography } from "~/components/typography"
import { AssetIdKey } from "~/constants/company-constants"
import { useSearchParam } from "~/hooks/use-search-param"
import { cn } from "~/lib/cn"
import {
  assetsGraphOptions,
  assetsOptions,
  locationsOptions,
  selectedAssetOptions,
} from "~/lib/query/query-options"

export function CompanyAssetsDetails({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const params = useParams()

  const [selectedAssetId] = useSearchParam({ paramKey: AssetIdKey })

  const locations = useQuery(locationsOptions(params.companyId!))
  const assets = useQuery(assetsOptions(params.companyId!))
  const assetsGraph = useQuery({
    ...assetsGraphOptions(params.companyId!, locations.data!, assets.data!),
    enabled: locations.isSuccess && assets.isSuccess,
  })
  const selectedAsset = useQuery({
    ...selectedAssetOptions(selectedAssetId!, assetsGraph.data!),
    enabled: assetsGraph.isSuccess && typeof selectedAssetId === "string",
  })

  console.log()
  const hasAsset = Boolean(selectedAsset.data)

  if (!hasAsset) {
    return (
      <div className={cn("grid grid-rows-[4rem_1fr]", className)} {...props}>
        <div className="row-span-2 space-y-1.5 self-center text-center">
          <InboxIcon className="h-14 w-full" />

          <Typography variant="h3">Empty</Typography>
          <Typography className="mx-auto" affects="muted">
            Select any location, asset or component
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("grid grid-rows-[4rem_1fr]", className)} {...props}>
      <header className="flex items-center border-b bg-background px-6">
        <Typography className="align-middle first-letter:uppercase" variant="h3">
          {selectedAsset.data!.name}
        </Typography>
      </header>

      <div className="grid h-fit grid-cols-2 gap-y-6 p-6">
        {!(
          selectedAsset.data.status ||
          selectedAsset.data.gatewayId ||
          selectedAsset.data.sensorId ||
          selectedAsset.data.sensorType
        ) && (
          <div className="col-span-2 space-y-0.5 text-center">
            <Typography variant="h3">Details not available</Typography>
            <Typography variant="p" affects="muted">
              There is no detailed information available for your selection
            </Typography>
          </div>
        )}

        {selectedAsset.data.status && (
          <div className="col-span-2 space-y-0.5">
            <Typography variant="h5">Status</Typography>

            <Typography affects="muted" className="flex items-center gap-2">
              <span className="first-letter:uppercase">{selectedAsset.data.status}</span>
            </Typography>
          </div>
        )}

        {selectedAsset.data.sensorId && (
          <div className="space-y-0.5">
            <Typography variant="h5">Sensor</Typography>

            <Typography affects="muted" className="flex items-center gap-2">
              <RadioIcon className="inline-block h-5 w-5" />
              <span>
                {selectedAsset.data.sensorId} ({selectedAsset.data.sensorType})
              </span>
            </Typography>
          </div>
        )}

        {selectedAsset.data.gatewayId && (
          <div className="space-y-0.5">
            <Typography variant="h5">Gateway</Typography>
            <Typography affects="muted" className="flex items-center gap-2">
              <RouterIcon className="inline-block h-4 w-4" />
              <span>{selectedAsset.data.gatewayId}</span>
            </Typography>
          </div>
        )}
      </div>
    </div>
  )
}
