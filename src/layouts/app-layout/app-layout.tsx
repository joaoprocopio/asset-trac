import { useQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { Package2Icon } from "lucide-react"
import { useEffect } from "react"
import { NavLink, Outlet, useParams } from "react-router-dom"

import TractianLogo from "~/assets/logos/tractian-logo.svg?react"
import { CompanyAtoms } from "~/atoms"
import { buttonVariants } from "~/components/button"
import { Skeleton } from "~/components/skeleton"
import { CompanyServices } from "~/services"

export function AppLayout() {
  const { companyId } = useParams()

  const [, setCompany] = useAtom(CompanyAtoms.selectedCompanyAtom)

  const companies = useQuery({
    queryFn: CompanyServices.getCompanies,
    queryKey: [CompanyServices.GetCompaniesKey],
  })

  useEffect(() => {
    if (!companyId) return
    if (!companies.isSuccess) return

    const nextCompany = companies.data.find((company) => company.id === companyId)

    setCompany(nextCompany)
  }, [companies.data, companies.isSuccess, companyId, setCompany])

  return (
    <div className="grid h-full grid-rows-[3.5rem_1fr]">
      <header className="border-b">
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
                  className={(state) =>
                    buttonVariants({
                      size: "sm",
                      variant: state.isActive ? "default" : "secondary",
                      className: "gap-2",
                    })
                  }>
                  <Package2Icon className="h-4 w-4" />

                  {`${company.name} Unit`}
                </NavLink>
              ))}
          </div>
        </div>
      </header>

      <main className="grid bg-muted">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
