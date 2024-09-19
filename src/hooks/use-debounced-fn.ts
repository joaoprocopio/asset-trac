import { useCallback, useEffect, useRef } from "react"

export const useDebouncedFn = <Fn extends (...args: Parameters<Fn>) => void>(
  fn: Fn,
  wait = 300
): ((...args: Parameters<Fn>) => void) => {
  const rafId = useRef(0)

  const render = useCallback(
    (...args: Parameters<Fn>) => {
      cancelAnimationFrame(rafId.current)

      const timeStart = performance.now()

      const renderFrame = (timeNow: number) => {
        if (timeNow - timeStart < wait) {
          rafId.current = requestAnimationFrame(renderFrame)
          return
        }

        fn(...args)
      }

      rafId.current = requestAnimationFrame(renderFrame)
    },
    [fn, wait]
  )

  useEffect(() => () => cancelAnimationFrame(rafId.current), [])

  return render
}
