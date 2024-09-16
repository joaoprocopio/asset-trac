import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

import { cn } from "~/utils/cn"

export interface ITypographyProps
  extends VariantProps<typeof typographyVariants>,
    React.HTMLAttributes<HTMLHeadingElement> {
  as?: React.ElementType
}

export function Typography({
  className,
  variant,
  affects,
  as,
  ...forwardedProps
}: ITypographyProps) {
  const Comp = as || variant || "p"

  return (
    <Comp className={cn(typographyVariants({ variant, affects, className }))} {...forwardedProps} />
  )
}

export const typographyVariants = cva("text-xl", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
    },
    affects: {
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
    },
  },
})
