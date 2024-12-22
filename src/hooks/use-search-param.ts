import type { URLSearchParamsInit } from "react-router"
import { useSearchParams } from "react-router"

type TSeachParamProps = {
  paramKey: string
  paramsDefaultInit?: URLSearchParamsInit
}

type TSeachParam = string | undefined
type TSetSearchParam = (nextSearchParam: TSeachParam) => void

export function useSearchParam({
  paramKey,
  paramsDefaultInit,
}: TSeachParamProps): [TSeachParam, TSetSearchParam] {
  const [searchParams, setSearchParams] = useSearchParams(paramsDefaultInit)

  const searchParam: TSeachParam = searchParams.get(paramKey) ?? undefined

  const setSearchParam: TSetSearchParam = (nextValue) => {
    setSearchParams(
      (prevSearchParams) => {
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
      },
      {
        preventScrollReset: true,
      }
    )
  }

  return [searchParam, setSearchParam]
}
