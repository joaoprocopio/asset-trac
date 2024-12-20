import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import { HydratedRouter } from "react-router/dom"

const queryClient = new QueryClient()

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <HydratedRouter />
      </QueryClientProvider>
    </StrictMode>
  )
})
