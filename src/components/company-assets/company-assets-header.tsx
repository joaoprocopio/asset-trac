import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"

import { CardHeader, CardTitle } from "~/components/card"
import { Skeleton } from "~/components/skeleton"
import { Typography } from "~/components/typography"
import { selectedCompanyOptions } from "~/lib/query/query-options"

export function CompanyAssetsHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  const params = useParams()
  const selectedCompany = useQuery(selectedCompanyOptions(params.companyId!))

  return (
    <CardHeader {...props}>
      <CardTitle className="inline-flex items-end gap-1">
        <span>Assets</span>

        <span>{selectedCompany.isLoading && <Skeleton className="mb-0.5 h-4 w-20" />}</span>

        <span>
          {selectedCompany.isSuccess && (
            <Typography className="font-normal" affects="muted">
              / {selectedCompany.data?.name} Unit
            </Typography>
          )}
        </span>
      </CardTitle>
    </CardHeader>
  )
}
