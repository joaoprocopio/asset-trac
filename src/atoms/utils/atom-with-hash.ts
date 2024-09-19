import type { RouterSubscriber } from "@remix-run/router"
import { atomWithStorage } from "jotai/utils"

import { router } from "~/router"

export const atomWithHash = (key: string, initialValue: string) => {
  return atomWithStorage(
    key,
    initialValue,
    {
      subscribe: (key, callback, initialValue) => {
        const handler: RouterSubscriber = () => {
          const hash = getHash()
          const hashValue = hash.get(key)
          callback(hashValue ?? initialValue)
        }
        const unsubscribe = router.subscribe(handler)
        return () => unsubscribe()
      },
      setItem: (key, value) => {
        const hash = getHash()
        if (hash.get(key) === value) return
        hash.set(key, value)
        updateHash(hash)
      },
      removeItem: (key) => {
        const hash = getHash()
        if (!hash.has(key)) return
        hash.delete(key)
        updateHash(hash)
      },
      getItem: (key, initialValue) => {
        const searchParams = getHash()
        return searchParams.get(key) ?? initialValue
      },
    },
    { getOnInit: true }
  )
}

function getHash() {
  const decodedHash = decodeURIComponent(window.location.hash.replace("#", ""))

  return new URLSearchParams(decodedHash)
}

function updateHash(hash: URLSearchParams) {
  router.navigate({ hash: decodeURIComponent(hash.toString()) })
}
