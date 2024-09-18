import { InfoIcon, SearchIcon, ZapIcon } from "lucide-react"

import { Button } from "~/components/button"
import { Input } from "~/components/input"
import { CompanyConstants } from "~/constants"

export interface ICompanyAssetsFilterProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedAssetName?: string
  selectedAssetStatus?: CompanyConstants.TAssetStatus
  handleChangeSelectedAssetName: (nextAssetQuery: string) => void
  handleChangeSelectedAssetStatus: (nextAssetStatus: CompanyConstants.TAssetStatus) => void
}

export function CompanyAssetsFilter({
  selectedAssetName,
  selectedAssetStatus,
  handleChangeSelectedAssetName,
  handleChangeSelectedAssetStatus,
  ...props
}: ICompanyAssetsFilterProps) {
  return (
    <div {...props}>
      <Input
        value={selectedAssetName || ""}
        onChange={(event) => handleChangeSelectedAssetName(event.target.value)}
        startIcon={SearchIcon}
        placeholder="Search assets"
      />

      <div className="flex gap-4">
        <Button
          className="h-10 gap-2"
          variant={
            selectedAssetStatus === CompanyConstants.AssetStatus.Operating ? "default" : "outline"
          }
          onClick={() => handleChangeSelectedAssetStatus(CompanyConstants.AssetStatus.Operating)}>
          <ZapIcon className="h-5 w-5" />
          Operating
        </Button>

        <Button
          className="h-10 gap-2"
          variant={
            selectedAssetStatus === CompanyConstants.AssetStatus.Alert ? "default" : "outline"
          }
          onClick={() => handleChangeSelectedAssetStatus(CompanyConstants.AssetStatus.Alert)}>
          <InfoIcon className="h-5 w-5" />
          Critical
        </Button>
      </div>
    </div>
  )
}
