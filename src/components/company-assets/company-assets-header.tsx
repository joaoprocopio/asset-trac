import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router"

import { CardHeader, CardTitle } from "~/components/card"
import { Skeleton } from "~/components/skeleton"
import { Typography } from "~/components/typography"
import { getSelectedCompanyQueryOptions } from "~/lib/query/query-options"
import type { TCompany } from "~/schemas/company-schemas"

export interface ICompanyAssetsHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedCompany?: TCompany
}

export function CompanyAssetsHeader({ ...props }: ICompanyAssetsHeaderProps) {
  const params = useParams()
  const queryClient = useQueryClient()
  const selectedCompany = useQuery({
    ...getSelectedCompanyQueryOptions(params.companyId!, queryClient),
  })

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
