import { forwardRef } from "react"

import { cn } from "~/utils/cn"

export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...forwardedProps }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      {...forwardedProps}
    />
  )
)
Card.displayName = "Card"

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...forwardedProps }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...forwardedProps}
    />
  )
)
CardHeader.displayName = "CardHeader"

export const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...forwardedProps }, forwardedRef) => (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h3
      ref={forwardedRef}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...forwardedProps}
    />
  )
)
CardTitle.displayName = "CardTitle"

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...forwardedProps }, forwardedRef) => (
  <p
    ref={forwardedRef}
    className={cn("text-sm text-muted-foreground", className)}
    {...forwardedProps}
  />
))
CardDescription.displayName = "CardDescription"

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...forwardedProps }, forwardedRef) => (
    <div ref={forwardedRef} className={cn("p-6 pt-0", className)} {...forwardedProps} />
  )
)
CardContent.displayName = "CardContent"

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...forwardedProps }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cn("flex items-center p-6 pt-0", className)}
      {...forwardedProps}
    />
  )
)
CardFooter.displayName = "CardFooter"
