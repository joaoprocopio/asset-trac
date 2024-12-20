import { RESET } from "jotai/utils"
import { InfoIcon, SearchIcon, ZapIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "~/components/button"
import { Input } from "~/components/input"
import type { TAssetStatus } from "~/constants/company-constants"
import { AssetStatus } from "~/constants/company-constants"
import { useDebouncedFn } from "~/hooks/use-debounced-fn"

export interface ICompanyAssetsFilterProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedAssetName?: string
  selectedAssetStatus?: string
  handleChangeSelectedAssetName: (nextAssetQuery: string | typeof RESET) => void
  handleChangeSelectedAssetStatus: (nextAssetStatus: string | typeof RESET) => void
}

export function CompanyAssetsFilter({
  selectedAssetName,
  selectedAssetStatus,
  handleChangeSelectedAssetName,
  handleChangeSelectedAssetStatus,
  ...props
}: ICompanyAssetsFilterProps) {
  // Isso pode parecer redundante, mas é necessário para que o valor do input seja controlado
  // E a alteração na URL seja debounced, para evitar mudanças desnecessárias na aplicação
  const [selectedAssetNameControlled, setSelectedAssetNameControlled] =
    useState<ICompanyAssetsFilterProps["selectedAssetName"]>(selectedAssetName)

  const [selectedAssetStatusControlled, setSelectedAssetStatusControlled] =
    useState<ICompanyAssetsFilterProps["selectedAssetStatus"]>(selectedAssetStatus)

  const debouncedHandleChangeSelectedAssetName = useDebouncedFn(handleChangeSelectedAssetName)
  const debouncedHandleChangeSelectedAssetStatus = useDebouncedFn(handleChangeSelectedAssetStatus)

  const handleChangeSelectedAssetNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextAssetQuery = event.target.value

    if (!nextAssetQuery.length) {
      setSelectedAssetNameControlled(undefined)
      return debouncedHandleChangeSelectedAssetName(RESET)
    }

    setSelectedAssetNameControlled(nextAssetQuery)

    return debouncedHandleChangeSelectedAssetName(nextAssetQuery)
  }

  const handleChangeSelectedAssetStatusInput = (
    nextAssetStatus: ICompanyAssetsFilterProps["selectedAssetStatus"]
  ) => {
    if (
      selectedAssetStatus === nextAssetStatus ||
      selectedAssetStatusControlled === nextAssetStatus
    ) {
      setSelectedAssetStatusControlled(undefined)
      return debouncedHandleChangeSelectedAssetStatus(RESET)
    }

    setSelectedAssetStatusControlled(nextAssetStatus)
    return debouncedHandleChangeSelectedAssetStatus(nextAssetStatus as TAssetStatus)
  }

  return (
    <div {...props}>
      <Input
        value={selectedAssetNameControlled || ""}
        onChange={handleChangeSelectedAssetNameInput}
        startIcon={SearchIcon}
        placeholder="Search assets"
      />

      <Button
        className="h-10 gap-2"
        variant={selectedAssetStatusControlled === AssetStatus.Operating ? "default" : "outline"}
        onClick={() => handleChangeSelectedAssetStatusInput(AssetStatus.Operating)}>
        <ZapIcon className="h-5 w-5" />
        Operating
      </Button>

      <Button
        className="h-10 gap-2"
        variant={selectedAssetStatusControlled === AssetStatus.Alert ? "default" : "outline"}
        onClick={() => handleChangeSelectedAssetStatusInput(AssetStatus.Alert)}>
        <InfoIcon className="h-5 w-5" />
        Critical
      </Button>
    </div>
  )
}
