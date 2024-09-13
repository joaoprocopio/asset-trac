import "./button.css"

import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { ComponentProps } from "react"

export type TButtonProps = React.PropsWithChildren &
  VariantProps<typeof buttonVariants> &
  ComponentProps<React.ReactHTML["button"]>

export function Button({ variant, size, className, ...forwardedProps }: TButtonProps) {
  return <button className={buttonVariants({ variant, size, className })} {...forwardedProps} />
}

export const buttonVariants = cva("button", {
  variants: {
    variant: {
      primary: "variant-primary",
      secondary: "variant-secondary",
    },
    size: {
      sm: "size-sm",
      md: "size-md",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
})
