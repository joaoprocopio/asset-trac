import { forwardRef } from "react"

import { cn } from "~/utils/cn"

export interface ISkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = forwardRef<HTMLDivElement, ISkeletonProps>(
  ({ className, ...forwardedProps }, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        className={cn("animate-pulse rounded-md bg-muted", className)}
        {...forwardedProps}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"
