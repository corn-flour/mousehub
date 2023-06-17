"use client"
import { cn } from "@/lib/utils"
import { useState, type ReactNode, useRef, useEffect } from "react"

// a client component that set the max height to its content
// apply a gradient mask if the inner content should overflow
const OverflowMask = (props: {
    children: ReactNode
    shouldOverflow?: boolean
}) => {
    const { children, shouldOverflow } = props
    const ref = useRef<HTMLDivElement>(null)
    const [isContentOverflow, setIsContentOverflow] = useState(false)

    useEffect(() => {
        if (ref.current && shouldOverflow) {
            setIsContentOverflow(
                ref.current.clientHeight < ref.current.scrollHeight,
            )
        }
    }, [ref, shouldOverflow])
    return (
        <div
            className={cn(
                shouldOverflow && "max-h-40 overflow-hidden",
                isContentOverflow && "mask-gradient",
            )}
            ref={ref}
        >
            {children}
        </div>
    )
}

export default OverflowMask
