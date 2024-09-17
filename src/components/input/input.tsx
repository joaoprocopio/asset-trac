import * as React from "react"

import { cn } from "~/utils/cn"

export interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ElementType
  endIcon?: React.ElementType
}

export function Input({ className, type, startIcon, endIcon, ...forwardedProps }: IInputProps) {
  const StartIcon = startIcon
  const EndIcon = endIcon

  return (
    <div className="relative w-full">
      <input
        type={type}
        className={cn(
          "peer flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          startIcon && "pl-9",
          endIcon && "pr-9",
          className
        )}
        {...forwardedProps}
      />

      {StartIcon && (
        <StartIcon className="absolute left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground peer-focus:text-foreground" />
      )}

      {EndIcon && (
        <EndIcon className="absolute right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground peer-focus:text-foreground" />
      )}
    </div>
  )
}
