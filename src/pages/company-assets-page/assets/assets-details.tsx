import { InboxIcon } from "lucide-react"

import { Typography } from "~/components/typography"

export interface IAssetsDetails extends React.HTMLAttributes<HTMLDivElement> {
  selectedAssetId?: string
}

export function AssetsDetails({ selectedAssetId, ...props }: IAssetsDetails) {
  return (
    <div {...props}>
      {!selectedAssetId && (
        <div className="flex flex-grow basis-px flex-col items-center justify-center text-center">
          <InboxIcon className="h-14 w-14" />

          <Typography variant="h3">Empty</Typography>
          <Typography affects="muted">Select any location or asset</Typography>
        </div>
      )}

      {/* TODO: mostrar o gateway */}
      {/* TODO: mostrar o sensor */}
      {/* TODO: mostrar o sensor type */}
      {/* TODO: mostrar o sensor status */}
      {selectedAssetId && <Typography variant="h3">{selectedAssetId}</Typography>}
    </div>
  )
}
