"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "next-themes"
import { type ReactNode } from "react"
import AccountManagerProvider from "./account-provider"
import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <AccountManagerProvider>
                <ThemeProvider attribute="class">
                    <TooltipProvider>{children}</TooltipProvider>
                </ThemeProvider>
            </AccountManagerProvider>
        </SessionProvider>
    )
}
