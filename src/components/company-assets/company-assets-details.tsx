import { InboxIcon, RadioIcon, RouterIcon } from "lucide-react"

import { Typography } from "~/components/typography"
import { cn } from "~/lib/cn"

export function CompanyAssetsDetails({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  let selectedAsset

  return (
    <div className={cn("grid grid-rows-[4rem_1fr]", className)} {...props}>
      {!selectedAsset && (
        <div className="row-span-2 space-y-1.5 self-center text-center">
          <InboxIcon className="h-14 w-full" />
          <Typography variant="h3">Empty</Typography>
          <Typography className="mx-auto" affects="muted">
            Select any location, asset or component
          </Typography>
        </div>
      )}

      {selectedAsset && (
        <>
          <header className="flex items-center border-b bg-background px-6">
            <Typography className="align-middle first-letter:uppercase" variant="h3">
              {selectedAsset.name}
            </Typography>
          </header>

          <div>
            <div className="grid grid-cols-2 gap-y-6 p-6">
              {!(
                selectedAsset.status ||
                selectedAsset.gatewayId ||
                selectedAsset.sensorId ||
                selectedAsset.sensorType
              ) && (
                <div className="col-span-2 space-y-0.5 text-center">
                  <Typography variant="h3">Details not available</Typography>
                  <Typography variant="p" affects="muted">
                    There is no detailed information available for your selection
                  </Typography>
                </div>
              )}

              {selectedAsset.status && (
                <div className="col-span-2 space-y-0.5">
                  <Typography variant="h5">Status</Typography>

                  <Typography affects="muted" className="flex items-center gap-2">
                    <span className="first-letter:uppercase">{selectedAsset.status}</span>
                  </Typography>
                </div>
              )}

              {selectedAsset.sensorId && (
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

              {selectedAsset.gatewayId && (
                <div className="space-y-0.5">
                  <Typography variant="h5">Gateway</Typography>
                  <Typography affects="muted" className="flex items-center gap-2">
                    <RouterIcon className="inline-block h-4 w-4" />
                    <span>{selectedAsset.gatewayId}</span>
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
