import { useQuery } from "@tanstack/react-query"
import { NavLink, Outlet } from "react-router-dom"

import GoldIcon from "~/assets/icons/gold-icon.svg?react"
import TractianLogo from "~/assets/icons/tractian-logo.svg?react"
import { buttonVariants } from "~/components/button"
import { Skeleton } from "~/components/skeleton"
import { CompanyServices } from "~/services"

export function AppLayout() {
  const companies = useQuery({
    queryFn: CompanyServices.getCompanies,
    queryKey: [CompanyServices.GetCompaniesKey],
  })

  return (
    <div className="grid h-full grid-rows-[3.5rem_1fr]">
      <header className="border-b">
        <div className="container mx-auto flex h-full items-center justify-between px-6">
          <NavLink to="/">
            <TractianLogo className="h-4" />
          </NavLink>

          <div className="flex gap-4">
            {companies.isLoading && (
              <>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-32" />
              </>
            )}

            {companies.isSuccess &&
              companies.data.map((company) => (
                <NavLink
                  key={company.id}
                  to={company.id}
                  className={(state) =>
                    buttonVariants({
                      size: "sm",
                      variant: state.isActive ? "default" : "secondary",
                    })
                  }>
                  <GoldIcon className="mr-2 h-5" />

                  {`${company.name} Unit`}
                </NavLink>
              ))}
          </div>
        </div>
      </header>

      <main className="bg-muted">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
