import { useEffect, useRef } from "react"

import { useDebouncedFn } from "./use-debounced-fn"

const defaultDeps: React.DependencyList = []

export const useDebouncedEffect = (
  fn: React.EffectCallback,
  deps = defaultDeps,
  wait = 500
): void => {
  const isFirstRender = useRef(true)
  const render = useDebouncedFn(fn, wait)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    render()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
