import { Outlet } from "react-router-dom"

export function AppLayout() {
  return (
    <div>
      <h1>i am the app layout</h1>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
