import { Post } from "@/components/posts/post"
import Comments from "@/components/comments/comment-view"
import { getPost } from "@/services/lemmy"

type PostViewProps = {
    params: {
        instance_url: string
        comment_id: string
    }
}

const CommentViewPage = async (props: PostViewProps) => {
    const { instance_url, comment_id } = props.params

    const { data: postResponse } = await getPost({
        instanceURL: instance_url,
        input: {
            comment_id: Number(comment_id),
        },
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
