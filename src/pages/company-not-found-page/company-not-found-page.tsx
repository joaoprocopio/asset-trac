import "./company-not-found-page.css"

import { Card, CardDescription, CardHeader, CardTitle } from "~/components/card"

export function CompanyNotFoundPage() {
  return (
    <Card className="company-not-found-page">
      <CardHeader>
        <CardTitle>404</CardTitle>
        <CardDescription>This page could not be found</CardDescription>
      </CardHeader>
    </Card>
  )
}
