import { RightColumnLayout } from "@/components/right-column-layout"
import Mdx from "@/components/markdown/mdx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { createLemmyClient } from "@/lib/lemmy"
import { Rat } from "lucide-react"
import Image from "next/image"
import { Suspense, type ReactNode } from "react"

const CommunityHeader = async ({
    communityName,
    instanceURL,
}: {
    communityName: string
    instanceURL: string
}) => {
    const lemmyClient = createLemmyClient(instanceURL)
    const community = await lemmyClient.getCommunity({
        name: decodeURIComponent(communityName),
    })

    return (
        <section>
            <div className="relative h-96 w-full bg-muted-foreground">
                {community.community_view.community.banner && (
                    <Image
                        src={community.community_view.community.banner}
                        alt=""
                        className="object-cover"
                        fill
                    />
                )}
            </div>

            <div className="relative h-24 bg-muted px-4">
                <div className="absolute left-1/2 top-0 mx-auto w-full max-w-7xl -translate-x-1/2 -translate-y-7">
                    <div className="flex items-end gap-4">
                        <Avatar className="h-24 w-24 border-[5px] border-muted bg-muted">
                            <AvatarImage
                                src={community.community_view.community.icon}
                            />
                            <AvatarFallback className="bg-primary-foreground">
                                <Rat className="h-12 w-12 text-primary" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {community.community_view.community.name}
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    !{decodeURIComponent(communityName)}
                                </p>
                            </div>
                            <Button>Subscribe</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const CommunityHeaderSkeleton = () => {
    return (
        <section>
            <div className="h-96 w-full bg-muted-foreground"></div>

            <div className="relative h-24 bg-muted px-4">
                <div className="absolute left-1/2 top-0 mx-auto w-full max-w-7xl -translate-x-1/2 -translate-y-7">
                    <div className="flex items-end gap-4">
                        <div className="h-24 w-24 rounded-full bg-muted">
                            <Skeleton className="h-24 w-24 rounded-full bg-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-[250px] bg-muted-foreground" />
                                <Skeleton className="h-3 w-[200px] bg-muted-foreground" />
                            </div>
                            <Button>Subscribe</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const CommunityInfo = async ({
    communityName,
    instanceURL,
}: {
    communityName: string
    instanceURL: string
}) => {
    const lemmyClient = createLemmyClient(instanceURL)
    const community = await lemmyClient.getCommunity({
        name: decodeURIComponent(communityName),
    })

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage
                            src={community.community_view.community.icon}
                        />
                        <AvatarFallback>
                            <Rat />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>
                            {community.community_view.community.name}
                        </CardTitle>
                        <CardDescription>
                            !{decodeURIComponent(communityName)}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {!!community.community_view.community.description && (
                    <Mdx
                        text={community.community_view.community.description}
                    />
                )}
            </CardContent>
        </Card>
    )
}

const CommunityInfoSkeletion = () => {
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

const CommunityLayout = ({
    params,
    children,
}: {
    params: {
        instance_url: string
        community_name: string
    }
    children: ReactNode
}) => {
    return (
        <div>
            <Suspense fallback={<CommunityHeaderSkeleton />}>
                <CommunityHeader
                    communityName={params.community_name}
                    instanceURL={params.instance_url}
                />
            </Suspense>
            <RightColumnLayout>
                <main className="flex-[2] space-y-4">{children}</main>
                <aside className="sticky top-[117px] hidden flex-1 xl:block">
                    <Suspense fallback={<CommunityInfoSkeletion />}>
                        <CommunityInfo
                            communityName={params.community_name}
                            instanceURL={params.instance_url}
                        />
                    </Suspense>
                </aside>
            </RightColumnLayout>
        </div>
    )
}

export default CommunityLayout
