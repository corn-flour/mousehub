"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type AnchorHTMLAttributes, forwardRef } from "react"

export const SidebarLink = forwardRef<
    HTMLAnchorElement,
    AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, href, ...props }, ref) => {
    const pathname = usePathname()
    return (
        <Link
            ref={ref}
            href={href ?? ""}
            className={cn(
                "itemcs-center flex gap-4 rounded px-4 py-1.5 transition hover:bg-accent",
                pathname === href && "bg-accent text-accent-foreground",
                className,
            )}
            {...props}
        />
    )
})

SidebarLink.displayName = "SidebarLink"
