import { DataNode } from "antd/es/tree"
import clsx from "clsx"
import {
  BoxIcon,
  ChevronDownIcon,
  CircleIcon,
  CodepenIcon,
  MapPinIcon,
  ZapIcon,
} from "lucide-react"
import { useLayoutEffect, useRef, useState } from "react"

import { Skeleton } from "~/components/skeleton"
import { Tree } from "~/components/tree"
import { CompanyConstants } from "~/constants"

// TODO: fazer a filtragem https://ant.design/components/tree#tree-demo-search
export interface ICompanyAssetsTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  tree?: DataNode[]
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
      {!tree && <AssetsTreeSkeleton />}

      {!!(tree && mounted) && (
        <Tree
          className="!border-0"
          fieldNames={{
            key: "id",
            children: "children",
            title: "name",
          }}
          defaultExpandAll={false}
          defaultSelectedKeys={[selectedAssetId || ""]}
          showLine={true}
          virtual={true}
          showIcon={true}
          selectable={true}
          height={treeWrapperRef.current!.offsetHeight - 48}
          itemHeight={28}
          switcherIcon={AssetsTreeNodeSwitcherIcon}
          icon={AssetsTreeNodeIcon}
          titleRender={AssetsTreeNodeTitle}
          treeData={tree}
          onSelect={(selectedKeys) => handleChangeSelectedAssetId(selectedKeys as string[])}
        />
      )}
    </div>
  )
}

function AssetsTreeSkeleton() {
  return (
    <div className="space-y-px pr-6">
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

function AssetsTreeNodeSwitcherIcon(props) {
  return (
    <ChevronDownIcon
      className={clsx("h-full w-4 transition-all", {
        "-rotate-90": props.expanded,
      })}
    />
  )
}

function AssetsTreeNodeIcon(props) {
  switch (props.data.type) {
    case "location":
      return <MapPinIcon className="mx-auto h-full w-4" />
    case "asset":
      return <BoxIcon className="mx-auto h-full w-4" />
    case "component":
      return <CodepenIcon className="mx-auto h-full w-4" />
  }
}

function AssetsTreeNodeTitle(props) {
  if (!(props.status && props.sensorType)) return props.name

  const isAlert = props.status === CompanyConstants.AssetStatus.Alert
  const isOperating = props.status === CompanyConstants.AssetStatus.Operating

  const isEnergyType = props.sensorType === CompanyConstants.AssetSensorType.Energy
  const isVibrationType = props.sensorType === CompanyConstants.AssetSensorType.Vibration

  const classes = clsx("ml-2 inline-block h-4 w-3", {
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
