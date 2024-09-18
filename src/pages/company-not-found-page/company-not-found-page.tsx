import { SearchXIcon } from "lucide-react"

import { Card, CardDescription, CardHeader, CardTitle } from "~/components/card"

export function CompanyNotFoundPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <SearchXIcon className="h-14 w-full" />
        <CardTitle>404</CardTitle>
        <CardDescription>This page could not be found</CardDescription>
      </CardHeader>
    </Card>
  )
}
