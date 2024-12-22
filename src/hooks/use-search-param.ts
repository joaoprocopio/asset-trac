import type { NavigateOptions, URLSearchParamsInit } from "react-router"
import { useSearchParams } from "react-router"

type TSeachParamProps = {
  paramKey: string
  paramsDefaultInit?: URLSearchParamsInit
  paramsNavigateOpts?: NavigateOptions
}

type TSeachParam = string | undefined
type TSetSearchParam = (nextSearchParam: TSeachParam) => void

export function useSearchParam({
  paramKey,
  paramsDefaultInit,
  paramsNavigateOpts,
}: TSeachParamProps): [TSeachParam, TSetSearchParam] {
  const [searchParams, setSearchParams] = useSearchParams(paramsDefaultInit)

  const searchParam: TSeachParam = searchParams.get(paramKey) ?? undefined

  const setSearchParam: TSetSearchParam = (nextValue) => {
    setSearchParams((prevSearchParams) => {
      if (!nextValue) {
        prevSearchParams.delete(paramKey)

        return prevSearchParams
      }

      if (!prevSearchParams.has(paramKey)) {
        prevSearchParams.append(paramKey, nextValue)

        return prevSearchParams
      }

      prevSearchParams.set(paramKey, nextValue)

      return prevSearchParams
    }, paramsNavigateOpts)
  }

  return [searchParam, setSearchParam]
}
