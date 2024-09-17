import { useSearchParams } from "react-router-dom"

export type TSearchParamValue<T> = T | undefined
export type TSetSearchParamValue<T> = (nextValue: T | typeof RESET_SEARCH_PARAM) => void

export interface IUseParmProps {
  paramKey: string
}

export const useSearchParam = <T extends string>({
  paramKey,
}: IUseParmProps): [TSearchParamValue<T>, TSetSearchParamValue<T>] => {
  const [searchParams, setSearchParams] = useSearchParams()

  const value = (searchParams.get(paramKey) ?? undefined) as TSearchParamValue<T>

  const setValue: TSetSearchParamValue<T> = (nextValue) => {
    setSearchParams((prevParams) => {
      if (nextValue === RESET_SEARCH_PARAM) {
        prevParams.delete(paramKey)

        return prevParams
      }

      prevParams.set(paramKey, nextValue)

      return prevParams
    })
  }

  return [value, setValue]
}

export const RESET_SEARCH_PARAM: unique symbol = Symbol("RESET")
