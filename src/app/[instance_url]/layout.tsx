import { Button } from "@/components/ui/button"
import { fetchLemmyInstances } from "@/lib/lemmy"
import { Rat } from "lucide-react"
import Link from "next/link"
import { type ReactNode } from "react"
import InstanceSelector from "./instance-selector"
import ThemeSwitch from "./theme-switch"

const NavBar = async () => {
    const instances = await fetchLemmyInstances()
    const data = instances.map(({ name, url }) => ({
        value: url,
        label: name,
    }))

    return (
        <header className="fixed top-0 z-20 w-full border-b bg-background p-4">
            <div className="mx-auto flex items-center gap-2 lg:max-w-7xl">
                <Button asChild variant="ghost">
                    <Link href="/">
                        <Rat className="h-6 w-6" />
                        <span className="sr-only">Home</span>
                    </Link>
                </Button>
                <InstanceSelector data={data} />
                <ThemeSwitch />
            </div>
        </header>
    )
}

const HomeLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <NavBar />
            <main className="mx-auto mb-8 mt-28 lg:max-w-2xl">{children}</main>
        </>
    )
}

export default HomeLayout
