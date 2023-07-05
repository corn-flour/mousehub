import { type ReactNode } from "react"

export const RightColumnLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="px-8 py-4 lg:py-8">
            <div className="mx-auto mb-8 grid max-w-7xl grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr),400px]">
                {children}
            </div>
        </div>
    )
}
