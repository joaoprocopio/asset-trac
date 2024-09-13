import "./button.css"

import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import clsx from "clsx"
import { ComponentProps } from "react"

export type TButtonProps = React.PropsWithChildren &
  VariantProps<typeof buttonVariants> &
  ComponentProps<React.ReactHTML["button"]> & {
    fullWidth?: boolean
  }

export function Button({
  variant,
  size,
  fullWidth = false,
  className,
  ...forwardedProps
}: TButtonProps) {
  return (
    <button
      className={buttonVariants({
        variant,
        size,
        className: clsx(className, {
          "full-width": fullWidth,
        }),
      })}
      {...forwardedProps}
    />
  )
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
