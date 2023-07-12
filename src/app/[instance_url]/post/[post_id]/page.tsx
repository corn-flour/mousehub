import Comments from "@/components/comments/comment-view"
import { Post } from "@/components/posts/post"
import { getPost } from "@/services/lemmy"

type PostViewProps = {
    params: {
        instance_url: string
        post_id: string
    }
}

const PostView = async (props: PostViewProps) => {
    const { instance_url, post_id } = props.params

    const { data: postResponse } = await getPost({
        instanceURL: instance_url,
        input: {
            id: Number(post_id),
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
            />
        </div>
    )
}

export default PostView
