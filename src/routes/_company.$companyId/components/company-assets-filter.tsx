import { InfoIcon, SearchIcon, ZapIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"

import { Button } from "~/components/button"
import { Input } from "~/components/input"
import type { TAssetStatus } from "~/constants/company-constants"
import { AssetNameKey, AssetStatus, AssetStatusKey } from "~/constants/company-constants"
import { useDebouncedFn } from "~/hooks/use-debounced-fn"
import { useSearchParam } from "~/hooks/use-search-param"

export function CompanyAssetsFilter(props: React.HTMLAttributes<HTMLDivElement>) {
  const location = useLocation()

  const [assetName, setAssetName] = useSearchParam<string>({ paramKey: AssetNameKey })
  const [assetStatus, setAssetStatus] = useSearchParam<TAssetStatus>({
    paramKey: AssetStatusKey,
  })

  const [assetNameControlled, setAssetNameControlled] = useState(assetName)
  const [assetStatusControlled, setAssetStatusControlled] = useState(assetStatus)

  const setAssetNameDebounced = useDebouncedFn(setAssetName)
  const setAssetStatusDebounced = useDebouncedFn(setAssetStatus)

  const handleChangeAssetName = (nextAssetQuery: string) => {
    if (!nextAssetQuery?.length) {
      setAssetNameControlled(undefined)
      setAssetNameDebounced(undefined)

      return undefined
    }

    setAssetNameControlled(nextAssetQuery)
    setAssetNameDebounced(nextAssetQuery)

    return undefined
  }

  const handleChangeAssetStatus = (nextAssetStatus: string) => {
    if (assetStatus === nextAssetStatus || assetStatusControlled === nextAssetStatus) {
      setAssetStatusControlled(undefined)
      setAssetStatusDebounced(undefined)

      return undefined
    }

    setAssetStatusControlled(nextAssetStatus)
    setAssetStatusDebounced(nextAssetStatus)

    return undefined
  }

  useEffect(() => {
    if (!assetName) {
      setAssetNameControlled(undefined)
    }

    if (!assetStatus) {
      setAssetStatusControlled(undefined)
    }
  }, [location.key, assetName, assetStatus])

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
