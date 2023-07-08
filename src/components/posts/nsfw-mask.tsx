"use client"
import { useState, type ReactNode } from "react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible"
import { Eye, EyeOff } from "lucide-react"

export const NSFWMask = ({
    children,
    nsfw,
}: {
    children: ReactNode
    nsfw?: boolean
}) => {
    const [open, setOpen] = useState(false)
    if (nsfw) {
        return (
            <Collapsible
                open={open}
                onOpenChange={setOpen}
                className="relative z-10"
            >
                <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center justify-center gap-2 rounded-md px-2 py-1 text-sm transition hover:text-red-500">
                        <div className="flex-1 border-b-2 border-dotted" />
                        {open ? (
                            <>
                                <Eye className="h-6 w-6" />
                                <span>Hide NSFW Content</span>
                            </>
                        ) : (
                            <>
                                <EyeOff className="h-6 w-6" />
                                <span>Show NSFW Content</span>
                            </>
                        )}
                        <div className="flex-1 border-b-2 border-dotted" />
                    </button>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-2">
                    {children}
                </CollapsibleContent>
            </Collapsible>
        )
    }

    return children
}
