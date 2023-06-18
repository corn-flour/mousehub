"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "../auth-action"
import { useRouter } from "next/navigation"

export const SignOutButton = ({ instanceURL }: { instanceURL: string }) => {
    const router = useRouter()
    return (
        <Button
            onClick={async () => {
                await signOut(instanceURL)
                router.push("/login")
            }}
        >
            Sign out
        </Button>
    )
}
