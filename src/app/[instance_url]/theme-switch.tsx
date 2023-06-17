"use client"

import { Button } from "@/components/ui/button"
import { MoonStar, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const useLoaded = () => {
    const [loaded, setLoaded] = useState(false)
    useEffect(() => setLoaded(true), [])
    return loaded
}

const ThemeSwitch = () => {
    const { resolvedTheme, setTheme } = useTheme()
    const loaded = useLoaded()

    // * Toggle would not work properly with server side rendering, can only render when client is loaded
    // Return placeholder button
    if (!loaded)
        return (
            <button
                aria-label="Placeholder button"
                className="rounded-full p-2 text-lg text-transparent transition-all "
            >
                <MoonStar />
            </button>
        )

    return (
        <Button
            variant="ghost"
            onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
        >
            <span className="sr-only">Change theme</span>
            {resolvedTheme === "dark" ? <MoonStar /> : <Sun />}
        </Button>
    )
}

export default ThemeSwitch
