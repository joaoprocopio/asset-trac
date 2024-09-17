import { useCallback, useEffect, useRef } from "react"

// https://github.com/eavam/use-debouncy/blob/main/src/fn.ts
export const useDebouncedFn = <Fn extends (...args: Parameters<Fn>) => void>(
  fn: Fn,
  wait = 500
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

  // Call cancel animation after umount
  useEffect(() => () => cancelAnimationFrame(rafId.current), [])

  return render
}
