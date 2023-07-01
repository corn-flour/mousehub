import { Button } from "@/components/ui/button"
import { Rat } from "lucide-react"
import Link from "next/link"
import { type ReactNode } from "react"
import ThemeSwitch from "./theme-switch"
import NavLink from "./navlink"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { type MyUserInfo } from "lemmy-js-client"
import { ProfileButton } from "./profile-button"

const NavBar = ({
    instanceURL,
    localUser,
}: {
    instanceURL: string
    localUser?: MyUserInfo
}) => {
    return (
        <header className="sticky left-0 top-0 z-20 w-full border-b bg-background p-4">
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
                        <NavLink url={`/${instanceURL}/local`} label="Local" />
                        <NavLink url={`/${instanceURL}/all`} label="All" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeSwitch />

                    {!localUser ? (
                        <Button asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                    ) : (
                        <ProfileButton
                            user={localUser}
                            instanceURL={instanceURL}
                        />
                    )}
                </div>
            </div>
        </header>
    )
}

const InstanceViewLayout = async ({
    children,
    params,
}: {
    children: ReactNode
    params: {
        instance_url: string
    }
}) => {
    const session = await getServerSession(authOptions)
    if (session && session.instanceURL !== params.instance_url) {
        // the user is log in but not in the right instance
        // redirect to the right instance
        //? do we want to handle viewing other instance when the user is signed in?
        //? the user can then automatically be viewed as guest?
        redirect(`/${session.instanceURL}/local`)
        return null
    }

    return (
        <>
            <NavBar
                instanceURL={params.instance_url}
                localUser={session?.localUser}
            />
            {children}
        </>
    )
}

export default InstanceViewLayout
