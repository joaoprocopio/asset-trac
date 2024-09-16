// import { CompanyServices } from "~/services"
// import { useQuery } from "@tanstack/react-query"
import { useAtomValue } from "jotai"

import { CompanyAtoms } from "~/atoms"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/card"
import { Skeleton } from "~/components/skeleton"
import { Typography } from "~/components/typography"

export function CompanyAssetsPage() {
  const company = useAtomValue(CompanyAtoms.companyAtom)

  // const locations = useQuery({
  //   queryFn: () => CompanyServices.getCompanyLocations(company!.id),
  //   queryKey: [CompanyServices.GetCompanyLocationsKey, company?.id],
  //   enabled: typeof company?.id === "string",
  // })

  // const assets = useQuery({
  //   queryFn: () => CompanyServices.getCompanyAssets(company!.id),
  //   queryKey: [CompanyServices.GetCompanyAssetsKey, company?.id],
  //   enabled: typeof company?.id === "string",
  // })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="inline-flex items-end gap-1">
          Assets
          {company ? (
            <Typography className="font-normal" as="span" affects="muted">
              / {company.name} Unit
            </Typography>
          ) : (
            <Skeleton className="mb-0.5 h-4 w-20" as="span" />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent></CardContent>
    </Card>
  )
}
