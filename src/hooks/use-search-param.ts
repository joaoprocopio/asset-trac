import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router"

export type TSeachParamProps = {
  paramKey: string
}

export type TSeachParam<T extends string> = T | (string & {}) | undefined

export type TSetSearchParam<T extends string> = (nextSearchParam: TSeachParam<T>) => void

export function useSearchParam<T extends string>({
  paramKey,
}: TSeachParamProps): [TSeachParam<T>, TSetSearchParam<T>] {
  const [searchParams, setSearchParams] = useSearchParams()

  const searchParam: TSeachParam<T> = useMemo(
    () => searchParams.get(paramKey) ?? undefined,
    [searchParams, paramKey]
  )

  const setSearchParam: TSetSearchParam<T> = useCallback(
    (nextValue) => {
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
    },
    [setSearchParams, paramKey]
  )

  return [searchParam, setSearchParam]
}
