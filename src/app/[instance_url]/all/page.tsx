import { PostItem } from "@/components/post"
import { LemmyHttp } from "lemmy-js-client"

type PostListProps = {
    params: {
        instance_url: string
    }
}

const PostList = async ({ params }: PostListProps) => {
    const lemmyClient = new LemmyHttp(`https://${params.instance_url}`)
    const posts = await lemmyClient.getPosts({
        type_: 'All'
    })

    return (
        <div className="my-4 flex flex-col gap-4">
            {posts.posts.map((post) => (
                <PostItem
                    key={post.post.id}
                    post={post}
                    instanceURL={params.instance_url}
                    isExplorePost
                />
            ))}
        </div>
    )
}

export default PostList
