import { InboxIcon, RadioIcon, RouterIcon, UploadCloudIcon, XIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "~/components/button"
import { Skeleton } from "~/components/skeleton"
import { Typography } from "~/components/typography"
import { cn } from "~/lib/cn"
import type { CompanySchemas } from "~/schemas"

export interface ICompanyAssetsDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedAsset?: CompanySchemas.TAsset
}

export function CompanyAssetsDetails({
  selectedAsset,
  className,
  ...props
}: ICompanyAssetsDetailsProps) {
  const [picture, setPicture] = useState<Blob | MediaSource>()

  const handleChangePicture = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    const file = event.target.files.item(0)

    if (!file) return

    setPicture(file)
  }

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
            <div className="h-80 border-b">
              {!picture && (
                <div className="h-full p-6">
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted text-muted-foreground">
                    <input
                      className="absolute left-0 h-px w-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)] [clip:rect(0_0_0_0)]"
                      type="file"
                      accept="image/jpg, image/jpeg, image/png, image/webp"
                      onChange={handleChangePicture}
                    />

                    <UploadCloudIcon className="h-12 w-12" />

                    <p className="mb-2 text-sm"></p>

                    <Typography variant="h5">Click to upload</Typography>

                    <Typography className="text-xs">JPG, JPEG, PNG or WEBP</Typography>
                  </label>
                </div>
              )}

              {picture && (
                <div className="relative h-full p-6">
                  <img
                    className="h-full w-full rounded-lg border object-cover"
                    src={URL.createObjectURL(picture)}
                  />

                  <Button
                    className="absolute right-10 top-10 rounded-full"
                    variant="outline"
                    size="icon"
                    onClick={() => setPicture(undefined)}>
                    <XIcon />
                  </Button>
                </div>
              )}
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

export interface ICompanyAssetsDetailsSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CompanyAssetsDetailsSkeleton({
  className,
  ...props
}: ICompanyAssetsDetailsSkeletonProps) {
  return (
    <div className={cn("grid grid-rows-[4rem_20rem_1fr]", className)} {...props}>
      <div className="flex items-center border-b px-6">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="border-b p-6">
        <Skeleton className="h-full" />
      </div>

      <div className="space-y-6 p-6">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
    </div>
  )
}
