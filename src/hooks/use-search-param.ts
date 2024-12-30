import type { URLSearchParamsInit } from "react-router"
import { useSearchParams } from "react-router"

export type TSeachParamProps = {
  paramKey: string
  paramsDefaultInit?: URLSearchParamsInit
}

export type TSeachParam<T extends string> = T | (string & {}) | undefined

export type TSetSearchParam = <T extends string>(nextSearchParam: TSeachParam<T>) => void

export function useSearchParam<T extends string>({
  paramKey,
  paramsDefaultInit,
}: TSeachParamProps): [TSeachParam<T>, TSetSearchParam] {
  const [searchParams, setSearchParams] = useSearchParams(paramsDefaultInit)

  const searchParam: TSeachParam<T> = searchParams.get(paramKey) ?? undefined

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
