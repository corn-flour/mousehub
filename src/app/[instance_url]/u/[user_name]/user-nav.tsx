"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

export const UserNav = ({
    instanceURL,
    userName,
}: {
    instanceURL: string
    userName: string
}) => {
    const pathname = usePathname()
    const rootPath = `/${instanceURL}/u/${decodeURIComponent(userName)}`

    return (
        <nav className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
            <Link
                href={rootPath}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    pathname === rootPath &&
                        "bg-background text-foreground shadow-sm",
                )}
            >
                Posts
            </Link>
            <Link
                href={`${rootPath}/comments`}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    pathname === `${rootPath}/comments` &&
                        "bg-background text-foreground shadow-sm",
                )}
            >
                Comments
            </Link>
        </nav>
    )
}
