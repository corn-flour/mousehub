import { ColumnLayout } from "@/components/column-layout"
import Mdx from "@/components/markdown/mdx"
import { LeftAsideLayout } from "@/components/three-column-layout"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { createLemmyClient, formatCommunityInfo } from "@/lib/lemmy"
import { ExternalLink, Globe, Home, Link2, Rat, Users } from "lucide-react"
import Image from "next/image"
import { Suspense, type ReactNode } from "react"
import { SidebarLink } from "./sidebar-link"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

const InstanceInfo = async ({ instanceURL }: { instanceURL: string }) => {
    const session = await getServerSession(authOptions)
    const lemmyClient = createLemmyClient(instanceURL)
    const site = await lemmyClient.getSite({
        auth: session?.accessToken,
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>{site.site_view.site.name}</CardTitle>
                <CardDescription>
                    {site.site_view.site.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!!site.site_view.site.banner && (
                    <Image
                        src={site.site_view.site.banner}
                        alt="Site banner"
                        width={420}
                        height={280}
                    />
                )}
                {!!site.site_view.site.sidebar && (
                    <Mdx text={site.site_view.site.sidebar} />
                )}
            </CardContent>
        </Card>
    )
}

const InstanceInfoSkeletion = () => {
    return (
        <Card>
            <CardHeader className="space-y-4">
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-16" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
            </CardContent>
        </Card>
    )
}

const SubscriptionList = async ({ instanceURL }: { instanceURL: string }) => {
    const session = await getServerSession(authOptions)
    const lemmyClient = createLemmyClient(instanceURL)
    const siteData = await lemmyClient.getSite({
        auth: session?.accessToken,
    })

    return (
        <>
            {siteData.my_user?.follows?.length ? (
                siteData.my_user?.follows.map(({ community }) => {
                    const communityName =
                        formatCommunityInfo(community).communityName
                    return (
                        <SidebarLink
                            key={community.id}
                            href={`/${instanceURL}/c/${communityName}`}
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

const ExploreLayout = ({
    params,
    children,
}: {
    params: {
        instance_url: string
    }
    children: ReactNode
}) => {
    return (
        <LeftAsideLayout>
            <aside className="sticky top-[85px] hidden h-[calc(100vh-85px)] border-r lg:block">
                <ScrollArea className="h-full w-full">
                    <div className="space-y-4 p-4">
                        <div className="space-y-2">
                            <h3 className="text-sm uppercase text-muted-foreground">
                                Feeds
                            </h3>
                            <SidebarLink href={`/${params.instance_url}`}>
                                <Home className="h-5 w-5" />
                                Home
                            </SidebarLink>
                            <SidebarLink href={`/${params.instance_url}/local`}>
                                <Users className="h-5 w-5" />
                                Local
                            </SidebarLink>
                            <SidebarLink href={`/${params.instance_url}/all`}>
                                <Globe className="h-5 w-5" />
                                All
                            </SidebarLink>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <h3 className="text-sm uppercase text-muted-foreground">
                                Subscriptions
                            </h3>
                            <SubscriptionList
                                instanceURL={params.instance_url}
                            />
                        </div>
                        <Separator />
                        <div className="space-y-2">
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
            <ColumnLayout>
                <main className="flex-[2] space-y-4">{children}</main>
                <aside className="sticky top-[117px] hidden flex-1 lg:block">
                    <Suspense fallback={<InstanceInfoSkeletion />}>
                        <InstanceInfo instanceURL={params.instance_url} />
                    </Suspense>
                </aside>
            </ColumnLayout>
        </LeftAsideLayout>
    )
}

export default ExploreLayout
