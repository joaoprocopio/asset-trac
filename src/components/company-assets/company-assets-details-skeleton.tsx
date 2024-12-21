import { Skeleton } from "~/components/skeleton"
import { cn } from "~/lib/cn"

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
