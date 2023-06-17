import { type ReactNode } from "react"

const HomeLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <main className="mx-auto lg:max-w-2xl">{children}</main>
        </div>
    )
}

export default HomeLayout
