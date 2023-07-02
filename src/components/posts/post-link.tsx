import { formatCommunityInfo, formatUserInfo } from "@/lib/lemmy"
import { type PostView } from "lemmy-js-client"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { MessageCircle, Rat } from "lucide-react"
import { formatNumber, formatTimeAgo } from "@/lib/utils"
import { NSFWMask } from "./nsfw-mask"
import Mdx from "../mdx"
import { DownvoteButton, UpvoteButton } from "../action-buttons"
import { Button } from "../ui/button"
import { getPostType } from "./helpers"
import { PostEmbed, PostVideo } from "./post-embed"
import { PostImage } from "./post-image"

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
            <CardHeader className="space-y-4">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={post.community.icon} />
                        <AvatarFallback>
                            <Rat />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <Link
                            href={`/${instanceURL}/c/${community.communityName}`}
                            className="z-10 font-semibold text-purple-700 hover:underline dark:text-purple-300"
                        >
                            {post.community.title}
                        </Link>
                        <div className="flex items-end gap-1">
                            <Link
                                href={`/${instanceURL}/u/${creator.userName}`}
                                className="z-10 text-sm hover:underline"
                            >
                                {creator.userName}
                            </Link>
                            <span className="text-sm text-muted-foreground">
                                •
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {formatTimeAgo(
                                    new Date(post.post.published + "Z"),
                                )}
                            </span>
                        </div>
                    </div>
                </div>
                <CardTitle>{post.post.name}</CardTitle>
            </CardHeader>
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
                        />
                    ) : postType === "image" ? (
                        <PostImage
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            imageURL={post.post.thumbnail_url ?? post.post.url!}
                            alt={post.post.embed_title ?? ""}
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
