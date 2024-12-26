import { InfoIcon, SearchIcon, ZapIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"

import { Button } from "~/components/button"
import { Input } from "~/components/input"
import { AssetNameKey, AssetStatus, AssetStatusKey } from "~/constants/company-constants"
import { useDebouncedFn } from "~/hooks/use-debounced-fn"
import { useSearchParam } from "~/hooks/use-search-param"

export function CompanyAssetsFilter(props: React.HTMLAttributes<HTMLDivElement>) {
  const location = useLocation()

  const [assetName, setAssetName] = useSearchParam({ paramKey: AssetNameKey })
  const [assetStatus, setAssetStatus] = useSearchParam({ paramKey: AssetStatusKey })

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
    setAssetNameDebounced(nextAssetQuery)

    return undefined
  }

  const handleChangeAssetStatus = (nextAssetStatus: typeof assetStatus) => {
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
