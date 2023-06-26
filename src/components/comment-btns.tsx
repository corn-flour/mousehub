"use client"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "./ui/button"

export const UpvoteButton = ({ count }: { count: number }) => {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-auto gap-1 py-1 pl-2 pr-3"
            type="button"
        >
            <ChevronUp />
            <span>{count}</span>
        </Button>
    )
}

export const DownvoteButton = ({ count }: { count: number }) => {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-auto gap-1 py-1 pl-1 pr-2"
            type="button"
        >
            <ChevronDown />
            <span>{count}</span>
        </Button>
    )
}
