import { type ReactNode } from "react"

const UserLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="p-4">
            <div className="mx-auto max-w-7xl">
                <main className="space-y-4">{children}</main>
            </div>
        </div>
    )
}

export default UserLayout
