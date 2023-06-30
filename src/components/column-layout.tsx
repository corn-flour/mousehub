import { type ReactNode } from "react"

export const ColumnLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="px-4 py-8">
            <div className="mx-auto mb-8 max-w-7xl grid-cols-[minmax(0,1fr),400px] items-start gap-8 lg:grid">
                {children}
            </div>
        </div>
    )
}
