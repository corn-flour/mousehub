import Mdx from "@/components/mdx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { GetPostsResponse, LemmyHttp } from "lemmy-js-client"
import { ExternalLink, Rat } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type PostListProps = {
    params: {
        instance_url: string
    }
}

const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url)
}

// TODO: handle embed_video_url?
const Embed = (props: {
    url: string
    title?: string
    description?: string
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
                <Card>
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
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{url}</CardDescription>
                </CardHeader>
                {description && <CardContent>{description}</CardContent>}
            </Card>
        </Link>
    )
}

const PostItem = (props: {
    post: GetPostsResponse["posts"][number]
    instanceURL: string
}) => {
    const post = props.post
    return (
        <Card className="relative transition-all hover:border-slate-700">
            <Link
                href={`/${props.instanceURL}/post/${post.post.id}`}
                className="absolute left-0 top-0 h-full w-full"
            >
                <span className="sr-only">{props.post.post.name}</span>
            </Link>
            <CardHeader className="space-y-4">
                <div className="flex items-center gap-2">
                    <Avatar className="bg-slate-100">
                        <AvatarImage src={props.post.community.icon} />
                        <AvatarFallback>
                            <Rat />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <Link
                            href="#"
                            className="z-10 font-semibold text-purple-700 hover:underline dark:text-purple-300"
                        >
                            {props.post.community.title}
                        </Link>
                        <Link href="#" className="z-10 text-sm hover:underline">
                            @{props.post.creator.name}
                            {!props.post.creator.local &&
                                `@${props.instanceURL}`}
                        </Link>
                    </div>
                </div>
                <CardTitle>{post.post.name}</CardTitle>
            </CardHeader>
            <CardContent>
                {post.post.body && <Mdx text={post.post.body} />}
                {post.post.thumbnail_url ? (
                    <Image
                        src={post.post.thumbnail_url}
                        alt=""
                        className="rounded-lg"
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

const PostList = async ({ params }: PostListProps) => {
    const lemmyClient = new LemmyHttp(`https://${params.instance_url}`)
    const posts = await lemmyClient.getPosts({})

    return (
        <div className="my-4 flex flex-col gap-4">
            {posts.posts.map((post) => (
                <PostItem
                    key={post.post.id}
                    post={post}
                    instanceURL={params.instance_url}
                />
            ))}
        </div>
    )
}

export default PostList
