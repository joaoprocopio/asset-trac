import { InboxIcon } from "lucide-react"

import { Empty } from "~/components/empty"

export default function AssetEmpty() {
  return (
    <Empty
      className="self-center"
      icon={InboxIcon}
      title="No asset selected"
      description="Select any location, asset or component"
    />
  )
}
