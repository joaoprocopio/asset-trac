import { forwardRef, useLayoutEffect, useState } from "react"
import { createPortal } from "react-dom"

export interface IPortalProps extends React.HTMLAttributes<HTMLDivElement> {
  container?: Element | null
}

export const Portal = forwardRef<React.ElementRef<"div">, IPortalProps>(
  ({ container: containerProp, ...props }, ref) => {
    const [mounted, setMounted] = useState(false)

    useLayoutEffect(() => setMounted(true), [])

    const container = containerProp || (mounted && globalThis?.document?.body)

    return container ? createPortal(<div {...props} ref={ref} />, container) : null
  }
)
Portal.displayName = "Portal"
