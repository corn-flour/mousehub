import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { RightColumnLayout } from "@/components/right-column-layout"
import Mdx from "@/components/markdown/mdx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { createLemmyClient, formatCommunityInfo } from "@/lib/lemmy"
import { Rat } from "lucide-react"
import { getServerSession } from "next-auth"
import { Suspense, type ReactNode } from "react"

const CommunityInfo = async ({
    postID,
    instanceURL,
}: {
    postID: string
    instanceURL: string
}) => {
    const session = await getServerSession(authOptions)
    const lemmyClient = createLemmyClient(instanceURL)
    const post = await lemmyClient.getPost({
        id: Number(postID),
        auth: session?.accessToken,
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
                            !{community.communityName}
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

const PostLayout = ({
    params,
    children,
}: {
    params: {
        instance_url: string
        post_id: string
    }
    children: ReactNode
}) => {
    return (
        <RightColumnLayout>
            <main className="flex-[2] space-y-4">{children}</main>
            <aside className="sticky top-[117px] hidden flex-1 xl:block">
                <Suspense fallback={<CommunityInfoSkeletion />}>
                    <CommunityInfo
                        postID={params.post_id}
                        instanceURL={params.instance_url}
                    />
                </Suspense>
            </aside>
        </RightColumnLayout>
    )
}

export default PostLayout
