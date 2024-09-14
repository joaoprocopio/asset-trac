import InboxIcon from "~/assets/icons/inbox-icon.svg?react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/card"
import { Typography } from "~/components/typography/typography"

export function CompanyEmptyPage() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Be welcome!</CardTitle>

        <CardDescription>Select any available unit to monitor your assets.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        <InboxIcon className="size-8 text-muted-foreground" />

        <Typography affects="muted">No selected unit.</Typography>
      </CardContent>
    </Card>
  )
}
