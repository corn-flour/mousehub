import { type ReactNode } from "react"

export const LeftAsideLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="p-0 lg:grid lg:grid-cols-[300px,1fr]">{children}</div>
    )
}
