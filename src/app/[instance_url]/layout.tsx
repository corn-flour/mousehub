import { Button } from "@/components/ui/button"
import { fetchLemmyInstances } from "@/lib/lemmy"
import { Rat } from "lucide-react"
import Link from "next/link"
import { type ReactNode } from "react"
import InstanceSelector from "./instance-selector"

const NavBar = async () => {
    const instances = await fetchLemmyInstances()
    const data = instances.map(({ name, url }) => ({
        value: url,
        label: name,
    }))

    return (
        <header className="fixed p-4 w-full border-b bg-white z-20 top-0">
            <div className="flex items-center gap-4 lg:max-w-7xl">
                <Button asChild variant="ghost">
                    <Link href="/">
                        <Rat className="h-6 w-6" />
                        <span className="sr-only">Home</span>
                    </Link>
                </Button>
                <InstanceSelector data={data} />
            </div>
        </header>
    )
}

const HomeLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <NavBar />
            <main className="mx-auto lg:max-w-2xl mt-32">{children}</main>
        </>
    )
}

export default HomeLayout
