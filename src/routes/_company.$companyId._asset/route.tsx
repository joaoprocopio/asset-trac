import { Outlet } from "react-router"

export default function Asset() {
  return (
    <div className="grid grid-rows-[4rem_1fr]">
      <Outlet />
    </div>
  )
}
