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
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center justify-center gap-2 rounded-md px-2 py-1 text-sm transition hover:bg-muted/50 hover:text-red-500">
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
