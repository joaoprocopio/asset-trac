import "./app-layout.css"

import { Outlet } from "react-router-dom"

export function AppLayout() {
  return (
    <div className="app-layout">
      <header className="al-header">I'm a header</header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
