import { Package2Icon } from "lucide-react"

import { Card } from "~/components/card"
import { Empty } from "~/components/empty"

export default function CompanyEmptyPage() {
  return (
    <Card className="flex h-full items-center justify-center p-6">
      <Empty
        icon={Package2Icon}
        title="No unit selected"
        description="Select any available unit to monitor your assets"
      />
    </Card>
  )
}
