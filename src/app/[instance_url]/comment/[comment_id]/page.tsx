import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Post } from "@/components/posts/post"
import { LemmyHttp } from "lemmy-js-client"
import { getServerSession } from "next-auth"
import Comments from "@/components/comments/comment-view"

type PostViewProps = {
    params: {
        instance_url: string
        comment_id: string
    }
}

const CommentViewPage = async (props: PostViewProps) => {
    const { instance_url, comment_id } = props.params
    const session = await getServerSession(authOptions)
    const accessToken = session?.accessToken

    const lemmyClient = new LemmyHttp(`https://${instance_url}`)
    const postResponse = await lemmyClient.getPost({
        comment_id: Number(comment_id),
        auth: accessToken,
    })

    return (
        <div className="space-y-8">
            <Post
                post={postResponse.post_view}
                instanceURL={instance_url}
                moderators={postResponse.moderators}
            />
            <Comments
                instanceURL={instance_url}
                postID={postResponse.post_view.post.id}
                commentID={Number(comment_id)}
            />
        </div>
    )
}

export default CommentViewPage
