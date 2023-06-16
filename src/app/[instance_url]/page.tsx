import Mdx from "@/components/mdx"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { GetPostsResponse, LemmyHttp } from "lemmy-js-client"
import Link from "next/link"

type PostListProps = {
    params: {
        instance_url: string
    }
}

const PostItem = (props: {
    post: GetPostsResponse["posts"][number]
    instanceURL: string
}) => {
    const post = props.post
    return (
        <Link href={`/${props.instanceURL}/post/${post.post.id}`}>
            <Card className="transition-asdf hover:border-slate-700">
                <CardHeader>
                    <CardTitle>{post.post.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    {post.post.body && <Mdx text={post.post.body} />}
                </CardContent>
                <CardFooter>{/** TODO: Action buttons here? */}</CardFooter>
            </Card>
        </Link>
    )
}

const PostList = async ({ params }: PostListProps) => {
    const lemmyClient = new LemmyHttp(`https://${params.instance_url}`)
    const posts = await lemmyClient.getPosts({})

    return (
        <div className="flex flex-col gap-4">
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
