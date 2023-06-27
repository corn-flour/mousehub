import { Button } from "@/components/ui/button"
import { cookies } from "next/headers"
import { Rat } from "lucide-react"
import Link from "next/link"
import { type ReactNode } from "react"
import ThemeSwitch from "./theme-switch"
import NavLink from "./navlink"
import { SignOutButton } from "./signout-btn"

const NavBar = ({ instanceURL }: { instanceURL: string }) => {
    const jwt = cookies().get("jwt")?.value

    return (
        <header className="fixed top-0 z-20 w-full border-b bg-background p-4">
            <div className="mx-auto flex items-center justify-between lg:max-w-7xl">
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost">
                        <Link
                            href={`/${instanceURL}`}
                            className="flex items-center gap-2"
                        >
                            <Rat className="h-6 w-6" />
                            <span className="text-lg">{instanceURL}</span>
                        </Link>
                    </Button>
                    <div className="ml-4 flex items-center gap-4">
                        <NavLink url={`/${instanceURL}`} label="Local" />
                        <NavLink url={`/${instanceURL}/all`} label="All" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeSwitch />
                    {jwt ? (
                        <SignOutButton instanceURL={instanceURL} />
                    ) : (
                        <Button asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}

const InstanceViewLayout = ({
    children,
    params,
}: {
    children: ReactNode
    params: {
        instance_url: string
    }
}) => {
    return (
        <>
            <NavBar instanceURL={params.instance_url} />
            <div className="p-4">
                <div className="mx-auto mb-8 mt-28 max-w-7xl grid-cols-[minmax(0,1fr),400px] items-start gap-8 lg:grid">
                    {children}
                </div>
            </div>
        </>
    )
}

export default InstanceViewLayout
