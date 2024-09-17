import { forwardRef } from "react"

import { cn } from "~/utils/cn"

export interface ISkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = forwardRef<HTMLDivElement, ISkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
    )
  }
)
Skeleton.displayName = "Skeleton"
