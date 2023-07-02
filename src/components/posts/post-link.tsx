import { formatCommunityInfo, formatUserInfo } from "@/lib/lemmy"
import { type PostView } from "lemmy-js-client"
import { Card, CardContent, CardFooter } from "../ui/card"
import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { formatNumber } from "@/lib/utils"
import { NSFWMask } from "./nsfw-mask"
import Mdx from "../mdx"
import { DownvoteButton, UpvoteButton } from "../action-buttons"
import { Button } from "../ui/button"
import { getPostType } from "./helpers"
import { PostEmbed, PostImage, PostVideo } from "./post-segments"
import { PostHeader } from "./post-header"

export const PostLink = (props: { post: PostView; instanceURL: string }) => {
    const { post, instanceURL } = props
    const creator = formatUserInfo(post.creator)
    const community = formatCommunityInfo(post.community)

    const postType = getPostType(post)

    return (
        <Card className="relative overflow-hidden transition-all hover:border-muted-foreground">
            <Link
                href={`/${instanceURL}/post/${post.post.id}`}
                className="absolute left-0 top-0 z-10 h-full w-full"
            >
                <span className="sr-only">{post.post.name}</span>
            </Link>
            <PostHeader
                communityName={community.communityName}
                communityTitle={post.community.title}
                instanceURL={instanceURL}
                creatorUserName={creator.userName}
                published={post.post.published}
                postTitle={post.post.name}
                isBot={post.creator.bot_account}
                isExplore
            />
            <CardContent>
                <NSFWMask nsfw={post.post.nsfw}>
                    {postType === "link" ? (
                        <PostEmbed
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            url={post.post.url!}
                            title={post.post.embed_title}
                            description={post.post.embed_description}
                            thumbnailURL={post.post.thumbnail_url}
                            videoURL={post.post.embed_video_url}
                            isExplore
                        />
                    ) : postType === "image" ? (
                        <PostImage
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            url={post.post.thumbnail_url ?? post.post.url!}
                            alt={post.post.embed_title ?? ""}
                            isExplore
                        />
                    ) : postType === "video" ? (
                        <PostVideo
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            url={post.post.thumbnail_url ?? post.post.url!}
                        />
                    ) : (
                        <Mdx text={post.post.body ?? ""} shouldOverflow />
                    )}
                </NSFWMask>
            </CardContent>

            <CardFooter className="gap-1">
                <UpvoteButton count={post.counts.upvotes} />
                <DownvoteButton count={post.counts.downvotes} />
                <Button variant="ghost" size="sm" asChild className="z-10">
                    <Link
                        href={`/${instanceURL}/post/${post.post.id}#comments`}
                    >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {formatNumber(post.counts.comments)} comments
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
