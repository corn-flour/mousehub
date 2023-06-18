import { Button } from "@/components/ui/button"
import { fetchLemmyInstances } from "@/lib/lemmy"
import { cookies } from "next/headers"
import { Rat } from "lucide-react"
import Link from "next/link"
import { type ReactNode } from "react"
import InstanceSelector from "./instance-selector"
import ThemeSwitch from "./theme-switch"
import NavLink from "./navlink"
import { SignOutButton } from "./signout-btn"

const NavBar = async ({ instanceURL }: { instanceURL: string }) => {
    const instances = await fetchLemmyInstances()
    const data = instances.map(({ name, url }) => ({
        value: url,
        label: name,
    }))

    const jwt = cookies().get("jwt")?.value

    return (
        <header className="fixed top-0 z-20 w-full border-b bg-background p-4">
            <div className="mx-auto flex items-center justify-between lg:max-w-7xl">
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost">
                        <Link href="/">
                            <Rat className="h-6 w-6" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </Button>
                    <InstanceSelector data={data} />
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

const ExploreLayout = ({
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
            <main className="mx-auto mb-8 mt-28 lg:max-w-2xl">{children}</main>
        </>
    )
}

export default ExploreLayout
