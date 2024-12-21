import { InboxIcon } from "lucide-react"

import { Card, CardDescription, CardHeader, CardTitle } from "~/components/card"

export default function CompanyAssetsPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <InboxIcon className="h-14 w-full" />
        <CardTitle>Unit not found</CardTitle>
        <CardDescription>Select any available unit to monitor your assets</CardDescription>
      </CardHeader>
    </Card>
  )
}
