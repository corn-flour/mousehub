"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "next-themes"
import { type ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider attribute="class">
            <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
    )
}
