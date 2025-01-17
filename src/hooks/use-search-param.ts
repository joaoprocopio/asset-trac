import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router"

export type TSeachParamProps = {
  paramKey: string
}

export type TSeachParam<T extends string> = T | undefined

export type TSetSearchParam<T extends string> = (nextSearchParam: TSeachParam<T>) => void

export function useSearchParam<T extends string>({
  paramKey,
}: TSeachParamProps): [TSeachParam<T>, TSetSearchParam<T>] {
  const [searchParams, setSearchParams] = useSearchParams()

  const searchParam = useMemo<TSeachParam<T>>(
    () => (searchParams.get(paramKey) as T) ?? undefined,
    [searchParams, paramKey]
  )

  const setSearchParam = useCallback<TSetSearchParam<T>>(
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
