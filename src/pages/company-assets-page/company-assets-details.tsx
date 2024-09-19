import { useAtomValue } from "jotai"
import { InboxIcon } from "lucide-react"

import { CompanyAtoms } from "~/atoms"
import { Skeleton } from "~/components/skeleton"
import { Typography } from "~/components/typography"
import { cn } from "~/utils"

export interface ICompanyAssetsDetailsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CompanyAssetsDetails({ className, ...props }: ICompanyAssetsDetailsProps) {
  const selectedAsset = useAtomValue(CompanyAtoms.selectedAssetAtom)

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

      {/* TODO: mostrar o gateway */}
      {/* TODO: mostrar o sensor */}
      {/* TODO: mostrar o sensor type */}
      {/* TODO: mostrar o sensor status */}
      {selectedAsset && (
        <>
          <header className="flex items-center border-b bg-background px-6">
            <Typography className="align-middle first-letter:uppercase" variant="h3">
              {selectedAsset.name}
            </Typography>
          </header>

          <div className="p-6">
            <pre>{JSON.stringify(selectedAsset, null, 4)}</pre>
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
