import { InboxIcon } from "lucide-react"

import { Typography } from "~/components/typography"
import type { CompanySchemas } from "~/schemas"

export interface ICompanyAssetsDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedAsset?: CompanySchemas.TAsset | CompanySchemas.TLocation
}

export function CompanyAssetsDetails({ selectedAsset, ...props }: ICompanyAssetsDetailsProps) {
  return (
    <div {...props}>
      {!selectedAsset && (
        <div className="flex flex-grow basis-px flex-col items-center justify-center text-center">
          <InboxIcon className="h-14 w-14" />

          <Typography variant="h3">Empty</Typography>
          <Typography affects="muted">Select any location or asset</Typography>
        </div>
      )}

      {/* TODO: mostrar o gateway */}
      {/* TODO: mostrar o sensor */}
      {/* TODO: mostrar o sensor type */}
      {/* TODO: mostrar o sensor status */}
      {selectedAsset && (
        <div>
          <header className="sticky inset-0 border-b bg-background px-4 py-5">
            <Typography variant="h3">{selectedAsset.name}</Typography>
          </header>

          <div className="p-6">
            <pre>{JSON.stringify(selectedAsset, null, 4)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
