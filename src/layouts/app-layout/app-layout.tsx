import "./app-layout.css"

import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { NavLink, useParams } from "react-router-dom"

import GoldIcon from "~/assets/icons/gold-icon.svg?react"
import TractianLogo from "~/assets/icons/tractian-logo.svg?react"
import { buttonVariants } from "~/components/button"
import { Skeleton } from "~/components/skeleton"
import { CompanyServices } from "~/services"

export function AppLayout() {
  const { companyId } = useParams()

  const companies = useQuery({
    queryFn: CompanyServices.getCompanies,
    queryKey: [CompanyServices.GetCompaniesKey],
  })

  const locations = useQuery({
    queryFn: () => CompanyServices.getCompanyLocations(companyId as string),
    queryKey: [CompanyServices.GetCompanyLocationsKey, companyId],
    enabled: typeof companyId === "string",
  })

  const assets = useQuery({
    queryFn: () => CompanyServices.getCompanyAssets(companyId as string),
    queryKey: [CompanyServices.GetCompanyAssetsKey, companyId],
    enabled: typeof companyId === "string",
  })

  return (
    <div className="app-layout">
      <header className="al-header">
        <TractianLogo className="alh-logo" />
        {/* TODO: usar skeletons, tratar casos de erro */}

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
              <NavLink
                key={company.id}
                className={({ isActive }) =>
                  buttonVariants({
                    size: "sm",
                    variant: isActive ? "primary" : "secondary",
                    className: clsx("alhm-button", { active: isActive }),
                  })
                }
                to={company.id}>
                <GoldIcon className="alhmb-icon" />

                {company.name}
              </NavLink>
            ))}
        </div>
      </header>
    </div>
  )
}
