"use client"

import { cn } from "@/lib/utils"
import { Eye } from "lucide-react"
import { useState, type ReactNode } from "react"

export const NSFWMask = ({
    children,
    nsfw,
}: {
    children: ReactNode
    nsfw?: boolean
}) => {
    const [isBlurred, setIsBlurred] = useState(true)

    if (nsfw) {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsBlurred(false)}
                    type="button"
                    className={cn(
                        "group absolute inset-0 z-10 rounded-md",
                        isBlurred && "bg-red-200/80 backdrop-blur-xl",
                    )}
                >
                    <div
                        className={cn(
                            "rounded-sm bg-red-400/50 px-4 py-2 group-hover:bg-red-500/50",
                            isBlurred
                                ? "inline-flex items-center justify-center gap-2"
                                : "hidden",
                        )}
                    >
                        <Eye className="h-6 w-6" />
                        <span>Unblur</span>
                    </div>
                </button>
                {children}
            </div>
        )
    }

    return children
}
