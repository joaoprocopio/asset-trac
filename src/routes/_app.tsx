import { useQuery } from "@tanstack/react-query"
import { useAtom, useSetAtom } from "jotai"
import { RESET } from "jotai/utils"
import { Package2Icon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { NavLink, Outlet } from "react-router"

import TractianLogo from "~/assets/logos/tractian-logo.svg?react"
import {
  selectedAssetAtom,
  selectedAssetIdAtom,
  selectedCompanyAtom,
  selectedCompanyIdAtom,
} from "~/atoms/company-atoms"
import { Button } from "~/components/button"
import { Skeleton } from "~/components/skeleton"
import { CompanyServices } from "~/services/company-services"

export default function AppLayout() {
  const [once, setOnce] = useState(false)

  const [selectedCompany, setSelectedCompany] = useAtom(selectedCompanyAtom)
  const [selectedCompanyId, setSelectedCompanyId] = useAtom(selectedCompanyIdAtom)
  const setSelectedAsset = useSetAtom(selectedAssetAtom)
  const setSelectedAssetId = useSetAtom(selectedAssetIdAtom)

  const companies = useQuery({
    queryFn: CompanyServices.getCompanies,
    queryKey: ["companies"],
  })

  const handleChangeCompany = useCallback(
    (nextCompanyId: string) => {
      if (!companies.isSuccess) {
        setSelectedCompany(RESET)
        setSelectedCompanyId(RESET)
        setSelectedAsset(RESET)
        setSelectedAssetId(RESET)

        return
      }

      setSelectedCompanyId(nextCompanyId)

      const nextCompany = companies.data.find((company) => company.id === nextCompanyId)

      if (!nextCompany) {
        setSelectedCompany(RESET)
        setSelectedCompanyId(RESET)
        setSelectedAsset(RESET)
        setSelectedAssetId(RESET)

        return
      }

      setSelectedCompany(nextCompany)

      if (nextCompanyId !== selectedCompanyId) {
        setSelectedAsset(RESET)
        setSelectedAssetId(RESET)
      }
    },
    [
      companies.data,
      companies.isSuccess,
      selectedCompanyId,
      setSelectedAsset,
      setSelectedAssetId,
      setSelectedCompany,
      setSelectedCompanyId,
    ]
  )

  useEffect(() => {
    if (!companies.isSuccess) return
    if (selectedCompany || !selectedCompanyId) return
    if (once) return

    setOnce(true)
    handleChangeCompany(selectedCompanyId)
  }, [once, companies.isSuccess, selectedCompanyId, selectedCompany, handleChangeCompany])

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

                  <span>{`${company.name} Unit`}</span>
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
