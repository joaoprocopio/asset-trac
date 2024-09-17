export interface ITreeProps {
  tree?: ITree
}

export interface ITree extends Array<ITreeNode> {}

export interface ITreeNode {
  id: string
  name: string
  children?: ITreeNode[]
}

export function Tree({ tree }: ITreeProps) {
  return <div>ima tree</div>
}
