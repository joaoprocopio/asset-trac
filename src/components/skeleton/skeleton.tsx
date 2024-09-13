import "./skeleton.css"

import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export type TSkeletonProps = React.PropsWithChildren &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
  VariantProps<typeof skeletonVariants>

export function Skeleton({ className, variant, ...forwardedProps }: TSkeletonProps) {
  return <div className={skeletonVariants({ variant, className })} {...forwardedProps} />
}

export const skeletonVariants = cva("skeleton", {
  variants: {
    variant: {
      default: "variant-default",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})
