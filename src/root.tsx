import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"

import tailwindStylesheet from "~/assets/styles/tailwind.css?url"
import { Skeleton } from "~/components/skeleton"

import type { Route } from "./+types/root"
import { Card, CardHeader } from "./components/card"

export const links: Route.LinksFunction = () => [
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    as: "style",
    rel: "stylesheet preload",
    crossOrigin: "anonymous",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
  },
  {
    rel: "shortcut icon",
    type: "image/svg+xml",
    href: "/favicon.svg",
  },
  {
    rel: "stylesheet",
    href: tailwindStylesheet,
  },
]

export const meta: Route.MetaFunction = () => [
  {
    title: "Assets Trac",
  },
  {
    charSet: "utf-8",
  },
  {
    name: "viewport",
    content: "width=device-width, initial-scale=1",
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function HydrateFallback() {
  return (
    <div>
      <header className="fixed inset-0 z-10 h-16 border-b bg-background">
        <div className="container mx-auto flex h-full items-center justify-between px-6">
          <Skeleton className="h-4 w-28" />

          <div className="grid grid-cols-[repeat(3,8rem)] gap-4">
            <>
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
            </>
          </div>
        </div>
      </header>

      <main className="h-full pt-16">
        <div className="container mx-auto h-full px-6 py-8">
          <Card>
            <CardHeader>
              <div className="grid auto-rows-min grid-cols-3 gap-4">
                <Skeleton className="aspect-video" />
                <Skeleton className="aspect-video" />
                <Skeleton className="aspect-video" />

                <Skeleton className="col-span-3 aspect-video" />
              </div>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!"
  let details = "An unexpected error occurred."
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error"
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
