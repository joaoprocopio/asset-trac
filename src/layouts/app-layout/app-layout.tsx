import "./app-layout.css"

import { useQuery } from "@tanstack/react-query"
import { NavLink, Outlet } from "react-router-dom"

import GoldIcon from "~/assets/icons/gold-icon.svg?react"
import TractianLogo from "~/assets/icons/tractian-logo.svg?react"
import { Button } from "~/components/button"
import { Skeleton } from "~/components/skeleton"
import { CompanyServices } from "~/services"

export function AppLayout() {
  const companies = useQuery({
    queryFn: CompanyServices.getCompanies,
    queryKey: [CompanyServices.GetCompaniesKey],
  })

  return (
    <div className="app-layout">
      <header className="al-header">
        <NavLink to="/">
          <TractianLogo className="alh-logo" />
        </NavLink>

        <div className="alh-menu">
          {companies.isLoading && (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          )}

          {companies.isSuccess &&
            companies.data.map((company) => (
              <NavLink key={company.id} to={company.id}>
                {({ isActive }) => (
                  <Button
                    className="alhm-button"
                    size="sm"
                    variant={isActive ? "primary" : "secondary"}
                    fullWidth>
                    <GoldIcon className="alhmb-icon" />

                    {`${company.name} Unit`}
                  </Button>
                )}
              </NavLink>
            ))}
        </div>
      </header>

      <main className="al-main">
        <Outlet />
      </main>
    </div>
  )
}
