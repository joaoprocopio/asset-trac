import "./card.css"

import clsx from "clsx"

export function Card({ className, ...forwardedProps }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("card", className)} {...forwardedProps} />
}

export function CardHeader({ className, ...forwardedProps }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("card-header", className)} {...forwardedProps} />
}

export function CardTitle({
  className,
  ...forwardedProps
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h3 className={clsx("card-title", className)} {...forwardedProps} />
  )
}

export function CardDescription({
  className,
  ...forwardedProps
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={clsx("card-description", className)} {...forwardedProps} />
}

export function CardContent({
  className,
  ...forwardedProps
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("card-content", className)} {...forwardedProps} />
}

export function CardFooter({ className, ...forwardedProps }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("card-footer", className)} {...forwardedProps} />
}
