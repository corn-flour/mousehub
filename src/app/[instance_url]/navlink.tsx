"use client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavLink = ({ url, label }: { url: string; label: string }) => {
    const pathname = usePathname()
    const isActive = url === pathname

    return (
        <Link
            href={url}
            className={cn(
                "text-foreground/60 transition-colors hover:text-foreground/80",
                isActive && "text-foreground underline",
            )}
        >
            {label}
        </Link>
    )
}

export default NavLink
