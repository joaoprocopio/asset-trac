import "~/styles/sanitize.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

const rootEl = document.getElementById("__root")!
const root = createRoot(rootEl)

root.render(
  <StrictMode>
    <div>hello world!</div>
  </StrictMode>
)
