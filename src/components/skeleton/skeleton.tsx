import { cn } from "~/utils/cn"

export interface ISkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

export function Skeleton({ className, as, ...forwardedProps }: ISkeletonProps) {
  const Comp = as || "div"

  return (
    <Comp
      className={cn(
        "animate-pulse rounded-md bg-muted",

        className
      )}
      {...forwardedProps}
    />
  )
}
