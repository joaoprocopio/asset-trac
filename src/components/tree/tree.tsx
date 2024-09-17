import { forwardRef } from "react"

export interface ITreeProps {
  tree?: ITree
}

export interface ITree extends Array<ITreeNode> {}

export interface ITreeNode {
  id: string
  name: string
  children?: ITreeNode[]
}

export const Tree = forwardRef<HTMLDivElement, ITreeProps>(({ tree }: ITreeProps, forwardedRef) => {
  return <div ref={forwardedRef}>ima tree</div>
})
Tree.displayName = "Tree"
