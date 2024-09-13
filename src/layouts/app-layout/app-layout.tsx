import { useQuery } from "@tanstack/react-query"
import { Outlet } from "react-router-dom"

import { CompanyServices } from "~/services"

export function AppLayout() {
  const companies = useQuery({
    queryFn: CompanyServices.getCompanies,
    queryKey: [CompanyServices.GetCompaniesKey],
  })

  return (
    <div className="app-layout">
      {/* TODO: usar skeletons */}
      <header className="al-header">
        {companies.isLoading && <div>loading...</div>}
        {companies.isSuccess && companies.data.map((company) => company.name)}
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
