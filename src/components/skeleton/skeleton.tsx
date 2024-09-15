import { cn } from "~/utils/cn"

export interface ISkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...forwardedProps }: ISkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted after:content-['']", className)}
      {...forwardedProps}
    />
  )
}
