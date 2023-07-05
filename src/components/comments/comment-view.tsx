import { buildCommentTree, createLemmyClient } from "@/lib/lemmy"

import { Suspense } from "react"
import { CommentList } from "./comment-list"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { CommentLoader } from "./skeletons"
import { PostCommentButton } from "./post-comment-button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const Comments = async ({
    postID,
    instanceURL,
    commentID,
}: {
    postID: number
    instanceURL: string
    commentID?: number
}) => {
    const lemmyClient = createLemmyClient(instanceURL)

    const session = await getServerSession(authOptions)

    const [comments, post] = await Promise.all([
        lemmyClient.getComments({
            post_id: postID,
            max_depth: 8,
            page: 2,
            type_: "All",
            parent_id: commentID,
            auth: session?.accessToken,
        }),
        lemmyClient.getPost({
            id: postID,
            auth: session?.accessToken,
        }),
    ])

    const commentTree = buildCommentTree(
        comments.comments,
        !!commentID,
        post.moderators,
        post.post_view.creator.id,
    )

    return (
        <>
            {!!commentID ? (
                <Link
                    href={`/${instanceURL}/post/${postID}`}
                    className="flex items-center gap-1 text-muted-foreground transition-all hover:gap-2 hover:text-foreground"
                >
                    See all comments
                    <ArrowRight />
                </Link>
            ) : (
                <PostCommentButton postID={postID} />
            )}
            <CommentList commentTree={commentTree} limit={20} />
        </>
    )
}

// renders comment will suspense fallback
const CommentView = ({
    postID,
    instanceURL,
    commentID,
}: {
    postID: number
    instanceURL: string
    commentID?: number
}) => {
    return (
        <section className="space-y-8" id="comments">
            <Suspense fallback={<CommentLoader />}>
                <Comments
                    postID={postID}
                    instanceURL={instanceURL}
                    commentID={commentID}
                />
            </Suspense>
        </section>
    )
}

export default CommentView
