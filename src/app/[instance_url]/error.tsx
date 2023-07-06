"use client" // Error components must be Client Components

import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"

//? do we want to do anything with this error message
//? we can log it to console, but would that be an issue when the lemmy api calls contain the access token as params?
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Error({ error }: { error: Error }) {
    // useEffect(() => {
    //     // Log the error to an error reporting service
    //     console.error(error)
    // }, [error])

    const pathname = usePathname()
    const searchParams = useSearchParams()

    const hasSearchParams = !!searchParams.toString().length

    return (
        <div className="flex flex-col items-center justify-center gap-8 p-4">
            <h1 className="text-2xl md:text-4xl">Something went wrong 😢</h1>
            <p className="max-w-[80ch] text-center text-muted-foreground [text-wrap:balance]">
                An error has occurred while trying to open this page. Sometimes,
                this is just because of the server being flakey and will likely
                resolve when you reload the page. However, if this error
                persists, please open an issue on Github with the related
                information!
            </p>
            <div className="flex flex-wrap items-center gap-4">
                <Button asChild>
                    {/** This is a raw anchor tag to force the app to do a hard reload */}
                    {/** Error component seems to expose a "reset" button to try rerendering the segment, but i feel like this has better feedback */}
                    <a
                        href={`${pathname}${
                            hasSearchParams ? `?${searchParams.toString()}` : ""
                        }`}
                    >
                        Try again
                    </a>
                </Button>
                <Button className="gap-1" variant="secondary" asChild>
                    <a
                        href="https://github.com/corn-flour/mousehub/issues"
                        target="_blank"
                    >
                        <Github />
                        Open an issue
                    </a>
                </Button>
            </div>
        </div>
    )
}
