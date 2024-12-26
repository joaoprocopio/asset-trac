import type { URLSearchParamsInit } from "react-router"
import { useSearchParams } from "react-router"

type TSeachParamProps = {
  paramKey: string
  paramsDefaultInit?: URLSearchParamsInit
}

type TSetSearchParam = <TSeachParam extends string>(nextSearchParam: TSeachParam) => void

export function useSearchParam<TSeachParam extends string>({
  paramKey,
  paramsDefaultInit,
}: TSeachParamProps): [TSeachParam | undefined, TSetSearchParam] {
  const [searchParams, setSearchParams] = useSearchParams(paramsDefaultInit)

  const searchParam: TSeachParam | undefined =
    (searchParams.get(paramKey) as TSeachParam) ?? undefined

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
