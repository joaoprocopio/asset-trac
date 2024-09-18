import { CardHeader, CardTitle } from "~/components/card"
import { Skeleton } from "~/components/skeleton"
import { Typography } from "~/components/typography"
import type { CompanySchemas } from "~/schemas"

export interface ICompanyAssetsHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedCompany?: CompanySchemas.TCompany
}

export function CompanyAssetsHeader({ selectedCompany, ...props }: ICompanyAssetsHeaderProps) {
  return (
    <CardHeader {...props}>
      <CardTitle className="inline-flex items-end gap-1">
        Assets
        {selectedCompany && (
          <Typography className="font-normal" affects="muted">
            / {selectedCompany.name} Unit
          </Typography>
        )}
        {!selectedCompany && <Skeleton className="mb-0.5 h-4 w-20" />}
      </CardTitle>
    </CardHeader>
  )
}
