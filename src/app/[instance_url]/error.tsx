"use client" // Error components must be Client Components

import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function Error({ error }: { error: Error }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])
    const pathname = usePathname()

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-8">
            <h1 className="text-4xl">Something went wrong!</h1>
            <p>
                An error has occurred while trying to open this page. If this
                error persists, please open an issue on Github with the related
                information!
            </p>
            <div className="flex flex-wrap items-center gap-4">
                <Button asChild>
                    {/** This is a raw anchor tag to force the app to do a hard reload */}
                    {/** Error component seems to expose a "reset" button to try rerendering the segment, but i feel like this has better feedback */}
                    <a href={pathname}>Try again</a>
                </Button>
                <Button className="gap-1" variant="secondary" asChild>
                    <a
                        href="https://github.com/corn-flour/mousehub/issues"
                        target="_blank"
                    >
                        <Github />
                        Open an issue on Github
                    </a>
                </Button>
            </div>
        </div>
    )
}
