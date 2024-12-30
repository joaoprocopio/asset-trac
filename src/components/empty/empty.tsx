import { Typography } from "~/components/typography"
import { cn } from "~/lib/cn"

export type TEmptyProps = {
  className?: string
  title: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export function Empty(props: TEmptyProps) {
  return (
    <div className={cn("space-y-1.5 text-center", props.className)}>
      <props.icon className="h-14 w-full" />

      <Typography variant="h3">{props.title}</Typography>
      <Typography className="mx-auto" affects="muted">
        {props.description}
      </Typography>
    </div>
  )
}
