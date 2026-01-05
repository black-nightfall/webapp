import * as React from "react"
import { cn } from "@/lib/utils"

export interface NeoGridProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

export function NeoGrid({ className, children, ...props }: NeoGridProps) {
    return (
        <div className={cn("@container w-full", className)} {...props}>
            <div className="grid grid-cols-1 gap-6 @md:grid-cols-2 @xl:grid-cols-3 @4xl:grid-cols-4">
                {children}
            </div>
        </div>
    )
}
