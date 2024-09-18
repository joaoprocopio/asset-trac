import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { forwardRef } from "react"

import { cn } from "~/utils"

export interface ILabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

export const Label = forwardRef<HTMLLabelElement, ILabelProps>(({ className, ...props }, ref) => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <label ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = "Label"

export const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)
