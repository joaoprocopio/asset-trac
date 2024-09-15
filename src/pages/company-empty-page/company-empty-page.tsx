import InboxIcon from "~/assets/icons/inbox-icon.svg?react"
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/card"

export function CompanyEmptyPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <InboxIcon className="size-14 w-full" />

        <CardTitle>Unit not found</CardTitle>
        <CardDescription>Select any available unit to monitor your assets</CardDescription>
      </CardHeader>
    </Card>
  )
}
