import Mdx from "@/components/mdx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCommunityInfo } from "@/lib/lemmy"
import { LemmyHttp } from "lemmy-js-client"
import { Rat } from "lucide-react"
import { Suspense, type ReactNode } from "react"

const CommunityInfo = async ({
    communityName,
    instanceURL,
}: {
    communityName: string
    instanceURL: string
}) => {
    const lemmyClient = new LemmyHttp(`https://${instanceURL}`)
    const post = await lemmyClient.getCommunity({
        name: decodeURIComponent(communityName),
    })

    const community = formatCommunityInfo(post.community_view.community)
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={post.community_view.community.icon} />
                        <AvatarFallback>
                            <Rat />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>
                            {post.community_view.community.name}
                        </CardTitle>
                        <CardDescription>
                            {community.communityName}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {!!post.community_view.community.description && (
                    <Mdx text={post.community_view.community.description} />
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
        <>
            <main className="flex-[2] space-y-4">{children}</main>
            <aside className="sticky hidden flex-1 lg:block">
                <Suspense fallback={<CommunityInfoSkeletion />}>
                    <CommunityInfo
                        communityName={params.community_name}
                        instanceURL={params.instance_url}
                    />
                </Suspense>
            </aside>
        </>
    )
}

export default CommunityLayout
