import { type ReactNode } from "react"

export const LeftAsideLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="grid-cols-[300px,1fr] p-4 lg:grid lg:p-0">
            {children}
        </div>
    )
}
