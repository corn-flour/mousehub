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
import { Suspense, type ReactNode } from "react"

const CommunityInfo = async ({
    commentID,
    instanceURL,
}: {
    commentID: string
    instanceURL: string
}) => {
    const lemmyClient = createLemmyClient(instanceURL)
    const comment = await lemmyClient.getComment({
        id: Number(commentID),
    })

    const community = formatCommunityInfo(comment.comment_view.community)
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage
                            src={comment.comment_view.community.icon}
                        />
                        <AvatarFallback>
                            <Rat />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>
                            {comment.comment_view.community.name}
                        </CardTitle>
                        <CardDescription>
                            !{community.communityName}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {!!comment.comment_view.community.description && (
                    <Mdx text={comment.comment_view.community.description} />
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
        comment_id: string
    }
    children: ReactNode
}) => {
    return (
        <RightColumnLayout>
            <main className="flex-[2] space-y-4">{children}</main>
            <aside className="sticky hidden flex-1 xl:block">
                <Suspense fallback={<CommunityInfoSkeletion />}>
                    <CommunityInfo
                        commentID={params.comment_id}
                        instanceURL={params.instance_url}
                    />
                </Suspense>
            </aside>
        </RightColumnLayout>
    )
}

export default PostLayout
