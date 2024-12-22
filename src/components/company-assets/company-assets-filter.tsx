import { InfoIcon, SearchIcon, ZapIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "~/components/button"
import { Input } from "~/components/input"
import type { TAssetStatus } from "~/constants/company-constants"
import { AssetStatus } from "~/constants/company-constants"
import { useDebouncedFn } from "~/hooks/use-debounced-fn"
import { useSearchParam } from "~/hooks/use-search-param"

export function CompanyAssetsFilter(props: React.HTMLAttributes<HTMLDivElement>) {
  const [assetName, setAssetName] = useSearchParam({
    paramKey: "an",
    paramsNavigateOpts: { preventScrollReset: true },
  })
  const [assetStatus, setAssetStatus] = useSearchParam({
    paramKey: "as",
    paramsNavigateOpts: { preventScrollReset: true },
  })

  const [assetNameControlled, setAssetNameControlled] = useState<typeof assetName>(assetName)
  const [assetStatusControlled, setAssetStatusControlled] =
    useState<typeof assetStatus>(assetStatus)

  const setAssetNameDebounced = useDebouncedFn(setAssetName)
  const setAssetStatusDebounced = useDebouncedFn(setAssetStatus)

  const handleChangeAssetName = (nextAssetQuery: typeof assetName) => {
    if (!nextAssetQuery?.length) {
      setAssetNameControlled(undefined)
      setAssetNameDebounced(undefined)

      return undefined
    }

    setAssetNameControlled(nextAssetQuery)

    return setAssetNameDebounced(nextAssetQuery)
  }

  const handleChangeAssetStatus = (nextAssetStatus: typeof assetStatus) => {
    if (assetStatus === nextAssetStatus || assetStatusControlled === nextAssetStatus) {
      setAssetStatusControlled(undefined)
      setAssetStatusDebounced(undefined)

      return undefined
    }

    setAssetStatusControlled(nextAssetStatus)
    return setAssetStatusDebounced(nextAssetStatus as TAssetStatus)
  }

  return (
    <div {...props}>
      <Input
        value={assetNameControlled || ""}
        onChange={(event) => handleChangeAssetName(event.target.value)}
        startIcon={SearchIcon}
        placeholder="Search assets"
      />

      <Button
        className="h-10 gap-2"
        variant={assetStatusControlled === AssetStatus.Operating ? "default" : "outline"}
        onClick={() => handleChangeAssetStatus(AssetStatus.Operating)}>
        <ZapIcon className="h-5 w-5" />
        Operating
      </Button>

      <Button
        className="h-10 gap-2"
        variant={assetStatusControlled === AssetStatus.Alert ? "default" : "outline"}
        onClick={() => handleChangeAssetStatus(AssetStatus.Alert)}>
        <InfoIcon className="h-5 w-5" />
        Critical
      </Button>
    </div>
  )
}
