import { ChevronDown, ChevronUp, ExternalLink, Rat } from "lucide-react"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { type GetPostsResponse } from "lemmy-js-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Mdx from "@/components/mdx"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { formatUserInfo } from "@/lib/lemmy"
import { Button } from "./ui/button"

const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url)
}

// TODO: handle embed_video_url?
const Embed = (props: {
    url: string
    title?: string
    description?: string
    isExplorePost?: boolean
}) => {
    const { url, title, description } = props
    if (!title && !description)
        return (
            <Link
                href={props.url}
                target="_blank"
                className="mt-4 hover:underline"
            >
                {url}
                <ExternalLink className="ml-1 inline-block h-4 w-4" />
            </Link>
        )

    if (!description) {
        return (
            <Link href={url} target="_blank" className="mt-4">
                <Card
                    className={
                        !props.isExplorePost ? "hover:border-slate-700" : ""
                    }
                >
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{url}</CardDescription>
                    </CardHeader>
                </Card>
            </Link>
        )
    }

    return (
        <Link href={url} target="_blank" className="mt-4">
            <Card
                className={!props.isExplorePost ? "hover:border-slate-700" : ""}
            >
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{url}</CardDescription>
                </CardHeader>
                {description && <CardContent>{description}</CardContent>}
            </Card>
        </Link>
    )
}

// TODO: fix remote community link
const PostItem = (props: {
    post: GetPostsResponse["posts"][number]
    instanceURL: string
    isExplorePost?: boolean
}) => {
    const { post, instanceURL, isExplorePost } = props
    const creator = formatUserInfo(post.creator)

    return (
        <Card
            className={cn(
                "relative overflow-hidden transition-all",
                isExplorePost && "hover:border-slate-700",
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
            <div className="absolute left-0 top-0 h-full w-10 z-10 py-4 flex flex-col items-center">
                <Button variant="ghost" className="px-2">
                    <span className="sr-only">Upvote</span>
                    <ChevronUp />
                </Button>
                <p>{post.counts.score}</p>
                <Button variant="ghost" className="px-2">
                    <span className="sr-only">Downvote</span>
                    <ChevronDown />
                </Button>
            </div>

            <CardHeader className="ml-10 space-y-4">
                <div className="flex items-center gap-2">
                    <Avatar className="bg-slate-100">
                        <AvatarImage src={post.community.icon} />
                        <AvatarFallback>
                            <Rat />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <Link
                            href={`/${instanceURL}/c/${post.community.name}`}
                            className="z-10 font-semibold text-purple-700 hover:underline dark:text-purple-300"
                        >
                            {post.community.title}
                        </Link>
                        <Link
                            href={`/${instanceURL}/u/${creator.userName}`}
                            className="z-10 text-sm hover:underline"
                        >
                            {creator.userName}
                        </Link>
                    </div>
                </div>
                <CardTitle>{post.post.name}</CardTitle>
            </CardHeader>
            <CardContent className=" ml-10">
                {post.post.body && (
                    <Mdx text={post.post.body} shouldOverflow={isExplorePost} />
                )}
                {post.post.thumbnail_url ? (
                    <Image
                        src={post.post.thumbnail_url}
                        alt=""
                        className="max-h-[600px] rounded-lg object-cover object-top"
                        width={672}
                        height={672}
                    />
                ) : (
                    post.post.url &&
                    isImage(post.post.url) && (
                        <Image
                            src={post.post.url}
                            alt={post.post.embed_title ?? ""}
                            className="rounded-lg"
                            width={672}
                            height={672}
                        />
                    )
                )}
                {post.post.url && !isImage(post.post.url) && (
                    <Embed
                        url={post.post.url}
                        title={post.post.embed_title}
                        description={post.post.embed_description}
                    />
                )}
            </CardContent>

            <CardFooter>{/** TODO: Action buttons here? */}</CardFooter>
        </Card>
    )
}

export { PostItem }
