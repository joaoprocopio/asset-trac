import { lazy } from "react"

import { env } from "~/env"

export const ReactQueryDevtools = env.PROD
  ? () => undefined
  : lazy(async () => ({
      default: (await import("@tanstack/react-query-devtools")).ReactQueryDevtools,
    }))
