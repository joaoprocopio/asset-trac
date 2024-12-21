import { useQuery } from "@tanstack/react-query"
import { LoaderCircle, Package2Icon } from "lucide-react"
import { NavLink, Outlet, useLoaderData } from "react-router"

import TractianLogo from "~/assets/logos/tractian-logo.svg?react"
import { buttonVariants } from "~/components/button"
import { Skeleton } from "~/components/skeleton"
import { queryClient } from "~/lib/query/query-client"
import { companiesQueryOptions } from "~/lib/query/query-options"

export const clientLoader = async () => {
  return {
    company: await queryClient.ensureQueryData(companiesQueryOptions()),
  }
}

export default function CompanyLayout() {
  const loaderData = useLoaderData<typeof clientLoader>()
  const companies = useQuery({
    ...companiesQueryOptions(),
    initialData: () => loaderData.company,
  })

  return (
    <div>
      <header className="fixed inset-0 z-10 h-16 border-b bg-background">
        <div className="container mx-auto flex h-full items-center justify-between px-6">
          <NavLink to="/">
            <TractianLogo className="h-4" />
          </NavLink>

          <div className="grid grid-cols-[repeat(3,8rem)] gap-4">
            {companies.isLoading && (
              <>
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
              </>
            )}

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
                  }
                  viewTransition>
                  {(linkProps) => (
                    <>
                      {linkProps.isTransitioning ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Package2Icon className="size-4" />
                      )}

                      <span>{`${company.name} Unit`}</span>
                    </>
                  )}
                </NavLink>
              ))}
          </div>
        </div>
      </header>

      <main className="h-full pt-16">
        <div className="container mx-auto h-full px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
