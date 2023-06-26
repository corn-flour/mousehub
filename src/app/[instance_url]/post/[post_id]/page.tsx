import Comments from "@/components/comments"
import { PostItem } from "@/components/post"
import { LemmyHttp } from "lemmy-js-client"

type PostViewProps = {
    params: {
        instance_url: string
        post_id: string
    }
}

export const dynamic = "force-dynamic"

const PostView = async (props: PostViewProps) => {
    const { instance_url, post_id } = props.params

    const lemmyClient = new LemmyHttp(`https://${instance_url}`)

    const postResponse = await lemmyClient.getPost({
        id: Number(post_id),
    })

    return (
        <div className="space-y-8">
            <PostItem
                post={postResponse.post_view}
                instanceURL={instance_url}
            />
            <Comments
                instanceURL={instance_url}
                postID={postResponse.post_view.post.id}
            />
        </div>
    )
}

export default PostView
