import { createBrowserRouter, redirect } from "react-router"

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => {
      const { AppLayout } = await import("~/layouts/app-layout")

      return { Component: AppLayout }
    },
    children: [
      {
        index: true,
        lazy: async () => {
          const { CompanyAssetsPage } = await import("~/pages/company-assets-page")

          return { Component: CompanyAssetsPage }
        },
      },
      {
        path: "*",
        loader: () => {
          throw redirect("/")
        },
      },
    ],
  },
])
