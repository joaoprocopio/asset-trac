import { useQuery } from "@tanstack/react-query"
import { Package2Icon } from "lucide-react"
import { NavLink, Outlet } from "react-router"

import TractianLogo from "~/assets/logos/tractian-logo.svg?react"
import { buttonVariants } from "~/components/button"
import { queryClient } from "~/lib/query/query-client"
import { companiesOptions } from "~/lib/query/query-options"

export const clientLoader = async () => {
  await queryClient.prefetchQuery(companiesOptions())
}

export default function Company() {
  const companies = useQuery(companiesOptions())

  return (
    <div className="h-full">
      <header className="fixed inset-0 z-10 h-16 border-b bg-background">
        <div className="container flex h-full items-center justify-between">
          <NavLink to="/">
            <TractianLogo className="h-4" />
          </NavLink>

          <div className="grid grid-cols-[repeat(3,8rem)] gap-4">
            {companies.isSuccess &&
              companies.data.map((company) => (
                <NavLink
                  key={company.id}
                  to={company.id}
                  className={(linkProps) =>
                    buttonVariants({
                      className: "gap-2",
                      size: "sm",
                      variant: linkProps.isActive ? "default" : "secondary",
                    })
                  }>
                  <Package2Icon className="size-4" />

                  <span>{`${company.name} Unit`}</span>
                </NavLink>
              ))}
          </div>
        </div>
      </header>

      <main className="h-full pt-16">
        <div className="container h-full py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
