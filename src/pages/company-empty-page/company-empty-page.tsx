import "./company-empty-page.css"

import InboxIcon from "~/assets/icons/inbox-icon.svg?react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/card"

export function CompanyEmptyPage() {
  return (
    <Card className="company-empty-page">
      <CardHeader>
        <CardTitle>Be welcome!</CardTitle>
        <CardDescription>Select any available unit to monitor your assets.</CardDescription>
      </CardHeader>

      <CardContent className="cep-content">
        <InboxIcon className="cepc-icon" />

        <p>No selected unit.</p>
      </CardContent>
    </Card>
  )
}
