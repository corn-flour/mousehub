import { Button } from "@/components/ui/button"
import { ExternalLink, Globe, Rat, Users } from "lucide-react"
import Link from "next/link"
import { type ReactNode } from "react"
import ThemeSwitch from "./theme-switch"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { ProfileButton } from "./profile-button"
import { LeftAsideLayout } from "@/components/left-column-layout"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarLink } from "./sidebar-link"
import { Home } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { formatCommunityInfo } from "@/lib/lemmy"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SearchBar } from "@/components/search-bar"
import { getSite } from "@/services/lemmy"

const NavBar = ({
    instanceURL,
    localUser,
}: {
    instanceURL: string
    localUser?: {
        id: string
        userName: string
        avatar?: string
    }
}) => {
    return (
        <header className="sticky left-0 top-0 z-20 w-full border-b bg-background p-4">
            <div className="mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost">
                        <Link
                            href={`/${instanceURL}`}
                            className="flex items-center gap-2"
                        >
                            <Rat className="h-6 w-6" />
                            <span className="hidden text-lg sm:block">
                                {instanceURL}
                            </span>
                        </Link>
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <SearchBar />
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

const SubscriptionList = async ({ instanceURL }: { instanceURL: string }) => {
    const { data: siteData } = await getSite({
        instanceURL,
        opt: {
            next: {
                revalidate: 0,
            },
        },
    })

    return (
        <>
            {siteData.my_user?.follows?.length ? (
                siteData.my_user?.follows.map(({ community }) => {
                    const { communityName, domain } =
                        formatCommunityInfo(community)
                    return (
                        <SidebarLink
                            key={community.id}
                            href={`/${instanceURL}/c/${communityName}@${domain}`}
                        >
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={community.icon} />
                                <AvatarFallback>
                                    <Rat />
                                </AvatarFallback>
                            </Avatar>
                            {community.name}
                        </SidebarLink>
                    )
                })
            ) : (
                <p className="py-4 text-muted-foreground">
                    You have not subscribed to any community yet.
                </p>
            )}
        </>
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
        redirect(`/${session.instanceURL}`)
        return null
    }

    return (
        <>
            <NavBar
                instanceURL={params.instance_url}
                localUser={session?.localUser}
            />
            <LeftAsideLayout>
                <aside className="sticky top-[85px] hidden h-[calc(100vh-85px)] border-r lg:block">
                    <ScrollArea className="h-full w-full">
                        <div className="space-y-4 p-4">
                            <div className="space-y-1">
                                <h3 className="text-sm uppercase text-muted-foreground">
                                    Feeds
                                </h3>
                                {session && (
                                    <SidebarLink
                                        href={`/${params.instance_url}`}
                                    >
                                        <Home className="h-5 w-5" />
                                        Home
                                    </SidebarLink>
                                )}
                                <SidebarLink
                                    href={`/${params.instance_url}/local`}
                                >
                                    <Users className="h-5 w-5" />
                                    Local
                                </SidebarLink>
                                <SidebarLink
                                    href={`/${params.instance_url}/all`}
                                >
                                    <Globe className="h-5 w-5" />
                                    All
                                </SidebarLink>
                            </div>
                            <Separator />
                            <div className="space-y-1">
                                <h3 className="text-sm uppercase text-muted-foreground">
                                    Subscriptions
                                </h3>
                                <SubscriptionList
                                    instanceURL={params.instance_url}
                                />
                            </div>
                            <Separator />
                            <div className="space-y-1">
                                <Link
                                    href="https://github.com/corn-flour/mousehub"
                                    target="_blank"
                                    className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary "
                                >
                                    Source code
                                    <ExternalLink className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="https://join-lemmy.org/"
                                    target="_blank"
                                    className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary "
                                >
                                    About Lemmy
                                    <ExternalLink className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </ScrollArea>
                </aside>
                {children}
            </LeftAsideLayout>
        </>
    )
}

export default InstanceViewLayout
