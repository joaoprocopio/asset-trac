import { forwardRef } from "react"

import { Skeleton } from "../skeleton"

export interface ITree {
  id: string
  name: string
  children?: ITree[]
}

export interface ITreeProps extends React.HTMLAttributes<HTMLDivElement> {
  tree?: ITree[]
}

export const Tree = forwardRef<HTMLDivElement, ITreeProps>(({ tree }, ref) => {
  if (!tree) {
    return <Skeleton />
  }

  return <div ref={ref}>{JSON.stringify(tree, null, 2)}</div>
})
Tree.displayName = "Tree"
