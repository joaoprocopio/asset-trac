import "./button.css"

import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { ComponentProps } from "react"

export type TButtonProps<C extends React.ElementType> = React.PropsWithChildren &
  VariantProps<typeof buttonVariants> &
  ComponentProps<C> & {
    component?: C
  }

export function Button<C extends React.ElementType = React.ReactHTML["button"]>({
  variant,
  size,
  component,
  className,
  ...forwardedProps
}: TButtonProps<C>) {
  const Component = component ?? "button"

  return <Component className={buttonVariants({ variant, size, className })} {...forwardedProps} />
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
