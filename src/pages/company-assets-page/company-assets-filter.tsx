import { InfoIcon, SearchIcon, ZapIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "~/components/button"
import { Input } from "~/components/input"
import { CompanyConstants } from "~/constants"
import type { TSetSearchParamValue } from "~/hooks"
import { RESET_SEARCH_PARAM, useDebouncedFn } from "~/hooks"

export interface ICompanyAssetsFilterProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedAssetName?: string
  selectedAssetStatus?: CompanyConstants.TAssetStatus
  handleChangeSelectedAssetName: TSetSearchParamValue<string>
  handleChangeSelectedAssetStatus: TSetSearchParamValue<CompanyConstants.TAssetStatus>
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
    const normalizedQuery = nextAssetQuery.trim().toLowerCase()

    if (!normalizedQuery.length) {
      setSelectedAssetNameControlled(undefined)
      return debouncedHandleChangeSelectedAssetName(RESET_SEARCH_PARAM)
    }

    setSelectedAssetNameControlled(normalizedQuery)

    return debouncedHandleChangeSelectedAssetName(normalizedQuery)
  }

  const handleChangeSelectedAssetStatusInput = (
    nextAssetStatus: ICompanyAssetsFilterProps["selectedAssetStatus"]
  ) => {
    if (
      selectedAssetStatus === nextAssetStatus ||
      selectedAssetStatusControlled === nextAssetStatus
    ) {
      setSelectedAssetStatusControlled(undefined)
      return debouncedHandleChangeSelectedAssetStatus(RESET_SEARCH_PARAM)
    }

    setSelectedAssetStatusControlled(nextAssetStatus)
    return debouncedHandleChangeSelectedAssetStatus(
      nextAssetStatus as CompanyConstants.TAssetStatus
    )
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
        variant={
          selectedAssetStatusControlled === CompanyConstants.AssetStatus.Operating
            ? "default"
            : "outline"
        }
        onClick={() =>
          handleChangeSelectedAssetStatusInput(CompanyConstants.AssetStatus.Operating)
        }>
        <ZapIcon className="h-5 w-5" />
        Operating
      </Button>

      <Button
        className="h-10 gap-2"
        variant={
          selectedAssetStatusControlled === CompanyConstants.AssetStatus.Alert
            ? "default"
            : "outline"
        }
        onClick={() => handleChangeSelectedAssetStatusInput(CompanyConstants.AssetStatus.Alert)}>
        <InfoIcon className="h-5 w-5" />
        Critical
      </Button>
    </div>
  )
}
