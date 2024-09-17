import { forwardRef, memo } from "react"

export interface ITreeNode {
  id: string
  name: string
  children?: ITreeNode[]
}

export interface ITreeProps extends React.HTMLAttributes<HTMLUListElement> {
  tree?: ITreeNode[]
}
export interface ITreeNodeProps extends React.HTMLAttributes<HTMLUListElement> {
  treeNode: ITreeNode
  treeLevel: number
}

const _Tree = forwardRef<HTMLUListElement, ITreeProps>(({ tree }, ref) => {
  if (!tree) {
    return
  }

  return (
    <ul ref={ref} className="tree">
      {tree.map((treeNode) => (
        <TreeNode key={treeNode.id} treeNode={treeNode} treeLevel={0} />
      ))}
    </ul>
  )
})
_Tree.displayName = "Tree"

const _TreeNode = forwardRef<HTMLUListElement, ITreeNodeProps>(({ treeNode, treeLevel }, ref) => {
  return (
    <ul ref={ref} style={{ marginLeft: treeLevel * 8 }}>
      <li>{treeNode.name}</li>

      {treeNode.children && (
        <ul>
          {treeNode.children.map((child) => (
            <TreeNode key={child.id} treeNode={child} treeLevel={++treeLevel} />
          ))}
        </ul>
      )}
    </ul>
  )
})
_TreeNode.displayName = "Tree"

export const Tree = memo(_Tree)
export const TreeNode = memo(_TreeNode)
