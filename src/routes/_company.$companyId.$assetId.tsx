import { useQuery } from "@tanstack/react-query"
import { InboxIcon } from "lucide-react"
import { useParams } from "react-router"

import { Typography } from "~/components/typography"
import { AssetType } from "~/constants/company-constants"
import { cn } from "~/lib/cn"
import type { TGraphNode } from "~/lib/graph"
import { assetsGraphOptions, assetsOptions, locationsOptions } from "~/lib/query/query-options"
import type { TAssetNode, TLocationNode } from "~/schemas/company-schemas"

export default function CompanyAssetsDetails({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const params = useParams()

  const locations = useQuery(locationsOptions(params.companyId!))
  const assets = useQuery(assetsOptions(params.companyId!))
  const selectedAsset = useQuery({
    ...assetsGraphOptions(params.companyId!, locations.data!, assets.data!),
    enabled: locations.isSuccess && assets.isSuccess && typeof params.assetId === "string",
    select: (graph) => graph.getNode(params.assetId!),
  })

  if (!selectedAsset.data) {
    return (
      <div className={cn("grid grid-rows-[4rem_1fr]", className)} {...props}>
        <div className="row-span-2 space-y-1.5 self-center text-center">
          <InboxIcon className="h-14 w-full" />

          <Typography variant="h3">Empty</Typography>
          <Typography className="mx-auto" affects="muted">
            Select any location, asset or component
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("grid grid-rows-[4rem_1fr]", className)} {...props}>
      <header className="flex items-center border-b bg-background px-6">
        <Typography className="align-middle first-letter:uppercase" variant="h3">
          {selectedAsset.data.name}
        </Typography>
      </header>

      <DetailsView selectedAsset={selectedAsset.data!} />
    </div>
  )
}

function DetailsView({ selectedAsset }: { selectedAsset: TGraphNode<TLocationNode | TAssetNode> }) {
  // Não acredito que vale a pena usar os hooks do react query aqui, esse componente é puramente exibicional.
  // Gostaria de deixar ele somente com a responsabilidade de exibir corretamente.
  switch (selectedAsset?.type) {
    case AssetType.Asset:
      return AssetType.Asset
    case AssetType.Component:
      return AssetType.Component
    case AssetType.Location:
      return AssetType.Location
  }
}
