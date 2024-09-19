import "~/assets/styles/tailwind.css"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { startTransition, StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import { router } from "~/router"

const queryClient = new QueryClient()

const rootEl = document.getElementById("__react")!
const root = createRoot(rootEl)

startTransition(() =>
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  )
)
