import { createBrowserRouter } from "react-router-dom"

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => {
      const { AppLayout } = await import("~/layouts/app-layout")

      return { Component: AppLayout }
    },
    children: [
      {
        path: "",
        lazy: async () => {
          const { CompanyEmptyPage: CompanyAssetsPage } = await import("~/pages/company-empty-page")

          return { Component: CompanyAssetsPage }
        },
      },
      {
        path: "/:companyId",
        lazy: async () => {
          const { CompanyAssetsPage } = await import("~/pages/company-assets-page")

          return { Component: CompanyAssetsPage }
        },
      },
      {
        path: "*",
        lazy: async () => {
          const { CompanyNotFoundPage } = await import("~/pages/company-not-found-page")

          return { Component: CompanyNotFoundPage }
        },
      },
    ],
  },
])
