import { Package2Icon } from "lucide-react"

import { Card, CardDescription, CardHeader, CardTitle } from "~/components/card"

export default function CompanyEmptyPage() {
  return (
    <Card className="h-full">
      <CardHeader className="h-full items-center justify-center">
        <Package2Icon className="size-14" />
        <CardTitle>No unit selected</CardTitle>
        <CardDescription>Select any available unit to monitor your assets</CardDescription>
      </CardHeader>
    </Card>
  )
}
