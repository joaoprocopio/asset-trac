import { InboxIcon } from "lucide-react"

import { Typography } from "~/components/typography"

export default function AssetEmpty() {
  return (
    <div className="row-span-2 space-y-1.5 self-center text-center">
      <InboxIcon className="h-14 w-full" />

      <Typography variant="h3">No asset selected</Typography>
      <Typography className="mx-auto" affects="muted">
        Select any location, asset or component
      </Typography>
    </div>
  )
}
