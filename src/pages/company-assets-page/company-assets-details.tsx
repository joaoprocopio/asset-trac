import { InboxIcon, RadioIcon, RouterIcon } from "lucide-react"

import { Skeleton } from "~/components/skeleton"
import { Typography } from "~/components/typography"
import type { CompanySchemas } from "~/schemas"
import { cn } from "~/utils"

export interface ICompanyAssetsDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedAsset?: CompanySchemas.TAsset
}

export function CompanyAssetsDetails({
  selectedAsset,
  className,
  ...props
}: ICompanyAssetsDetailsProps) {
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
            <div className="border-b p-6">
              <div className="flex h-48 w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed bg-muted text-muted-foreground">
                <InboxIcon className="h-12 w-12" />
                <Typography affects="muted" className="font-medium">
                  Upload a image
                </Typography>
              </div>
            </div>

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
                    {selectedAsset.sensorId} ({selectedAsset.sensorType})
                  </Typography>
                </div>
              )}

              {selectedAsset.gatewayId && (
                <div className="space-y-0.5">
                  <Typography variant="h5">Gateway</Typography>
                  <Typography affects="muted" className="flex items-center gap-2">
                    <RouterIcon className="inline-block h-4 w-4" />
                    {selectedAsset.gatewayId}
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

export interface ICompanyAssetsDetailsSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CompanyAssetsDetailsSkeleton({
  className,
  ...props
}: ICompanyAssetsDetailsSkeletonProps) {
  return (
    <div className={cn("grid grid-rows-[4rem_1fr]", className)} {...props}>
      <div className="flex items-center border-b px-6">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="p-6">
        <Skeleton className="h-full" />
      </div>
    </div>
  )
}
