import { lazy } from "react"

export const Tree = lazy(async () => {
  const { Tree } = await import("./tree")

  return { default: Tree }
})
