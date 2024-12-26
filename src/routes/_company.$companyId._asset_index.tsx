import { InboxIcon } from "lucide-react"

import { Typography } from "~/components/typography"

export default function AssetEmptyPage() {
  return (
    <div className="grid grid-rows-[4rem_1fr]">
      <div className="row-span-2 space-y-1.5 self-center text-center">
        <InboxIcon className="h-14 w-full" />

        <Typography variant="h3">Empty</Typography>
        <Typography className="mx-auto" affects="muted">
          Select any location, asset or component
        </Typography>
      </div>
    </div>
  )
}
