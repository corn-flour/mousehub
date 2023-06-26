import { buildCommentTree } from "@/lib/lemmy"
import { LemmyHttp } from "lemmy-js-client"
import { Suspense } from "react"
import CommentList from "./comment-list"

const Comments = async ({
    postID,
    instanceURL,
}: {
    postID: number
    instanceURL: string
}) => {
    const lemmyClient = new LemmyHttp(`https://${instanceURL}`)
    const comments = await lemmyClient.getComments({
        post_id: postID,
        max_depth: 5,
        page: 2,
        type_: "All",
    })

    console.log(comments.comments.length)
    const commentTree = buildCommentTree(comments.comments, false)

    return <CommentList commentTree={commentTree} limit={20} />
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
            <h2 className="text-xl">Comments</h2>
            <Suspense fallback={<div>Loading..</div>}>
                <Comments postID={postID} instanceURL={instanceURL} />
            </Suspense>
        </section>
    )
}

export default CommentView
