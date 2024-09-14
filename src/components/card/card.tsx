import { cn } from "~/utils/cn"

export interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface ICardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface ICardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface ICardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface ICardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface ICardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...forwardedProps }: ICardProps) {
  return (
    <div
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      {...forwardedProps}
    />
  )
}

export function CardHeader({ className, ...forwardedProps }: ICardHeaderProps) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...forwardedProps} />
}

export function CardTitle({ className, ...forwardedProps }: ICardTitleProps) {
  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h3
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...forwardedProps}
    />
  )
}

export function CardDescription({ className, ...forwardedProps }: ICardDescriptionProps) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...forwardedProps} />
}

export function CardContent({ className, ...forwardedProps }: ICardContentProps) {
  return <div className={cn("p-6 pt-0", className)} {...forwardedProps} />
}

export function CardFooter({ className, ...forwardedProps }: ICardFooterProps) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...forwardedProps} />
}
