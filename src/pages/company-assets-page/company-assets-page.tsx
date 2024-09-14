import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

import { CompanyServices } from "~/services"

export function CompanyAssetsPage() {
  const { companyId } = useParams()

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

  console.log({ locations: locations.data, assets: assets.data })

  return <h1>tree view</h1>
}
