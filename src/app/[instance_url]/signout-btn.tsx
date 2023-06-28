"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export const SignOutButton = () => {
    return (
        <Button
            onClick={async () => {
                await signOut({
                    callbackUrl: "/lemmy.world/local",
                })
            }}
        >
            Sign out
        </Button>
    )
}
