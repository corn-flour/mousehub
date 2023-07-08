"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "next-themes"
import { type ReactNode } from "react"
import AccountManagerProvider from "./account-provider"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <AccountManagerProvider>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider attribute="class">
                        <TooltipProvider>{children}</TooltipProvider>
                    </ThemeProvider>
                </QueryClientProvider>
            </AccountManagerProvider>
        </SessionProvider>
    )
}
