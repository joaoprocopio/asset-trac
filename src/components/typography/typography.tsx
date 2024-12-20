import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { forwardRef } from "react"

import { cn } from "~/lib/cn"

export interface ITypographyProps
  extends VariantProps<typeof typographyVariants>,
    React.HTMLAttributes<HTMLHeadingElement> {}

export const Typography = forwardRef<HTMLParagraphElement, ITypographyProps>(
  ({ className, variant, affects, ...props }: ITypographyProps, ref) => {
    const Comp = variant || "p"

    return (
      <Comp
        ref={ref}
        className={cn(typographyVariants({ variant, affects, className }))}
        {...props}
      />
    )
  }
)
Typography.displayName = "Typography"

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
