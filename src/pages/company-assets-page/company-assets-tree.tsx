import {
  BoxIcon,
  ChevronDownIcon,
  CircleIcon,
  CodepenIcon,
  MapPinIcon,
  ZapIcon,
} from "lucide-react"
import { ComponentProps, useLayoutEffect, useRef, useState } from "react"

import { Skeleton } from "~/components/skeleton"
import { Tree } from "~/components/tree"
import { CompanyConstants } from "~/constants"
import { cn } from "~/utils"

// TODO: fazer a filtragem https://ant.design/components/tree#tree-demo-search
export interface ICompanyAssetsTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  tree?: ComponentProps<typeof Tree>["treeData"]
  selectedAssetId?: string
  handleChangeSelectedAssetId: (assetIds: string[]) => void
}

export function CompanyAssetsTree({
  tree,
  selectedAssetId,
  handleChangeSelectedAssetId,
  ...props
}: ICompanyAssetsTreeProps) {
  const [mounted, setMounted] = useState<boolean>(false)

  const treeWrapperRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => setMounted(true), [])

  return (
    <div ref={treeWrapperRef} {...props}>
      {!mounted && <CompanyAssetsTreeSkeleton className="pr-6" />}

      {mounted && (
        <Tree
          className="!border-0"
          fieldNames={{
            key: "id",
            children: "children",
            title: "name",
          }}
          treeData={tree}
          defaultExpandAll={false}
          defaultSelectedKeys={[selectedAssetId || ""]}
          showLine={true}
          virtual={true}
          showIcon={true}
          selectable={true}
          height={treeWrapperRef.current!.offsetHeight - 48}
          itemHeight={28}
          switcherIcon={CompanyAssetsTreeNodeSwitcherIcon}
          icon={CompanyAssetsTreeNodeIcon}
          titleRender={CompanyAssetsTreeNodeTitle}
          onSelect={(selectedKeys) => handleChangeSelectedAssetId(selectedKeys as string[])}
        />
      )}
    </div>
  )
}

export interface ICompanyAssetsTreeSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CompanyAssetsTreeSkeleton({
  className,
  ...props
}: ICompanyAssetsTreeSkeletonProps) {
  return (
    <div className={cn("space-y-px", className)} {...props}>
      <Skeleton className="h-6" />
      <Skeleton className="h-6" />
      <Skeleton className="h-6" />
      <Skeleton className="h-6" />
      <Skeleton className="h-6" />
      <Skeleton className="h-6" />
      <Skeleton className="h-6" />
      <Skeleton className="h-6" />
      <Skeleton className="h-6" />
      <Skeleton className="h-6" />
    </div>
  )
}

function CompanyAssetsTreeNodeSwitcherIcon(props) {
  return (
    <ChevronDownIcon
      className={cn("h-full w-4", {
        "-rotate-90": props.expanded,
      })}
    />
  )
}

function CompanyAssetsTreeNodeIcon(props) {
  switch (props.data.type) {
    case "location":
      return <MapPinIcon className="mx-auto h-full w-4" />
    case "asset":
      return <BoxIcon className="mx-auto h-full w-4" />
    case "component":
      return <CodepenIcon className="mx-auto h-full w-4" />
  }
}

function CompanyAssetsTreeNodeTitle(props) {
  if (!(props.status && props.sensorType)) return props.name

  const isAlert = props.status === CompanyConstants.AssetStatus.Alert
  const isOperating = props.status === CompanyConstants.AssetStatus.Operating

  const isEnergyType = props.sensorType === CompanyConstants.AssetSensorType.Energy
  const isVibrationType = props.sensorType === CompanyConstants.AssetSensorType.Vibration

  const classes = cn("ml-2 inline-block h-4 w-3", {
    "fill-destructive text-destructive": isAlert,
    "fill-success text-success": isOperating,
  })

  return (
    <>
      {props.name}

      {isEnergyType && <ZapIcon className={classes} />}
      {isVibrationType && <CircleIcon className={classes} />}
    </>
  )
}
