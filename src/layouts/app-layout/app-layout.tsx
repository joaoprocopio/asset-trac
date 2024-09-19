import { useQuery } from "@tanstack/react-query"
import { useAtom, useSetAtom } from "jotai"
import { RESET } from "jotai/utils"
import { Package2Icon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { NavLink, Outlet } from "react-router-dom"

import TractianLogo from "~/assets/logos/tractian-logo.svg?react"
import { CompanyAtoms } from "~/atoms"
import { Button } from "~/components/button"
import { Skeleton } from "~/components/skeleton"
import { CompanyServices } from "~/services"

export function AppLayout() {
  const [mounted, setMounted] = useState(false)

  const [selectedCompany, setSelectedCompany] = useAtom(CompanyAtoms.selectedCompanyAtom)
  const [selectedCompanyId, setSelectedCompanyId] = useAtom(CompanyAtoms.selectedCompanyIdAtom)
  const setSelectedAsset = useSetAtom(CompanyAtoms.selectedAssetAtom)

  const companies = useQuery({
    queryFn: CompanyServices.getCompanies,
    queryKey: [CompanyServices.GetCompaniesKey],
  })

  const handleChangeCompany = useCallback(
    (nextCompanyId: string) => {
      if (!companies.isSuccess || !nextCompanyId) {
        setSelectedCompany(RESET)
        return setSelectedCompanyId(RESET)
      }

      setSelectedCompanyId(nextCompanyId)

      const nextCompany = companies.data.find((company) => company.id === nextCompanyId)

      if (!nextCompany) {
        setSelectedCompany(RESET)
        return setSelectedCompanyId(RESET)
      }

      setSelectedCompany(nextCompany)
      setSelectedAsset(undefined)
    },
    [
      companies.data,
      companies.isSuccess,
      setSelectedAsset,
      setSelectedCompany,
      setSelectedCompanyId,
    ]
  )

  useEffect(() => {
    if (!companies.isSuccess && !selectedCompany) return
    if (mounted) return

    setMounted(true)

    handleChangeCompany(selectedCompanyId)
  }, [mounted, companies.isSuccess, selectedCompanyId, selectedCompany, handleChangeCompany])

  return (
    <>
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
                <Button
                  key={company.id}
                  className="gap-2"
                  size="sm"
                  variant={company.id === selectedCompanyId ? "default" : "secondary"}
                  onClick={() => handleChangeCompany(company.id)}>
                  <Package2Icon className="h-4 w-4" />

                  {`${company.name} Unit`}
                </Button>
              ))}
          </div>
        </div>
      </header>

      <main className="h-full pt-16">
        <div className="container mx-auto h-full px-6 py-8">
          <Outlet />
        </div>
      </main>
    </>
  )
}
