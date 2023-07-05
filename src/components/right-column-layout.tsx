import { type ReactNode } from "react"

export const RightColumnLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="px-4 py-4 lg:py-8 xl:overflow-visible">
            <div className="mx-auto mb-8 max-w-7xl items-start gap-8 xl:grid xl:grid-cols-[minmax(0,1fr),400px]">
                {children}
            </div>
        </div>
    )
}
