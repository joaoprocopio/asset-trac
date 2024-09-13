import "./button.css"

import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { ComponentProps } from "react"

type ButtonProps<C extends React.ElementType> = React.PropsWithChildren &
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
}: ButtonProps<C>) {
  const Component = component ?? "button"

  return <Component className={buttonVariants({ variant, size, className })} {...forwardedProps} />
}
Button.displayName = "Button"

const buttonVariants = cva("button", {
  variants: {
    variant: {
      default: "variant-default",
    },
    size: {
      default: "size-default",
      sm: "size-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})
