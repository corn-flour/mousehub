import { ChevronDown, ChevronUp, MessageCircle, Rat } from "lucide-react"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { type PostView } from "lemmy-js-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Mdx from "@/components/mdx"
import { cn, formatNumber, formatTimeAgo } from "@/lib/utils"
import { formatCommunityInfo, formatUserInfo } from "@/lib/lemmy"
import { Button } from "../ui/button"
import { PostImage } from "./post-image"
import { NSFWMask } from "./nsfw-mask"
import { isImage } from "./helpers"
import { PostEmbed } from "./post-embed"

const Post = (props: {
    post: PostView
    instanceURL: string
    isExplorePost?: boolean
}) => {
    const { post, instanceURL, isExplorePost } = props
    const creator = formatUserInfo(post.creator)
    const community = formatCommunityInfo(post.community)

    return (
        <Card
            className={cn(
                "relative overflow-hidden transition-all",
                isExplorePost && "hover:border-muted-foreground",
            )}
        >
            {isExplorePost && ( // only make the card clickable on explore pages
                <Link
                    href={`/${instanceURL}/post/${post.post.id}`}
                    className="absolute left-0 top-0 z-10 h-full w-full"
                >
                    <span className="sr-only">{post.post.name}</span>
                </Link>
            )}

            {/**
             * Up/downvote buttons
             * TODO: Implement server actions for these
             * */}
            <div className="absolute left-0 top-0 z-10 flex h-full w-10 flex-col items-center py-4">
                <Button variant="ghost" className="px-2">
                    <span className="sr-only">Upvote</span>
                    <ChevronUp />
                </Button>
                <p>{formatNumber(post.counts.score)}</p>
                <Button variant="ghost" className="px-2">
                    <span className="sr-only">Downvote</span>
                    <ChevronDown />
                </Button>
            </div>

            <CardHeader className="ml-10 space-y-4">
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
            <CardContent className="ml-10">
                <NSFWMask nsfw={post.post.nsfw}>
                    {post.post.body && (
                        <Mdx
                            text={post.post.body}
                            shouldOverflow={isExplorePost}
                        />
                    )}
                    {post.post.thumbnail_url ? (
                        <PostImage imageURL={post.post.thumbnail_url} alt="" />
                    ) : (
                        post.post.url &&
                        isImage(post.post.url) && (
                            <PostImage
                                imageURL={post.post.url}
                                alt={post.post.embed_title ?? ""}
                            />
                        )
                    )}
                    {post.post.url && !isImage(post.post.url) && (
                        <PostEmbed
                            url={post.post.url}
                            title={post.post.embed_title}
                            description={post.post.embed_description}
                        />
                    )}
                </NSFWMask>
            </CardContent>

            <CardFooter className="ml-10">
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

export { Post }
