import { buildCommentTree } from "@/lib/lemmy"
import { LemmyHttp } from "lemmy-js-client"
import { Suspense } from "react"
import { CommentList } from "./comment-list"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { CommentLoader } from "./skeletons"

const Comments = async ({
    postID,
    instanceURL,
}: {
    postID: number
    instanceURL: string
}) => {
    const lemmyClient = new LemmyHttp(`https://${instanceURL}`)

    const session = await getServerSession(authOptions)

    const [comments, post] = await Promise.all([
        lemmyClient.getComments({
            post_id: postID,
            max_depth: 5,
            page: 2,
            type_: "All",
            auth: session?.accessToken,
        }),
        lemmyClient.getPost({
            id: postID,
        }),
    ])

    const commentTree = buildCommentTree(
        comments.comments,
        false,
        post.moderators,
        post.post_view.creator.id,
    )

    return (
        <>
            <h2 className="text-xl">Comments</h2>
            <CommentList commentTree={commentTree} limit={20} />
        </>
    )
}

// renders comment will suspense fallback
const CommentView = ({
    postID,
    instanceURL,
}: {
    postID: number
    instanceURL: string
}) => {
    return (
        <section className="space-y-8" id="comments">
            <Suspense fallback={<CommentLoader />}>
                <Comments postID={postID} instanceURL={instanceURL} />
            </Suspense>
        </section>
    )
}

export default CommentView
