import { buildCommentTree } from "@/lib/lemmy"

import { Suspense } from "react"
import { CommentLoader } from "./skeletons"
import { PostCommentButton } from "./post-comment-button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import dynamic from "next/dynamic"
import { getComments, getPost } from "@/services/lemmy"

const CommentList = dynamic(() => import("./comment-list"))

const Comments = async ({
    postID,
    instanceURL,
    commentID,
}: {
    postID: number
    instanceURL: string
    commentID?: number
}) => {
    const [commentResponse, postResponse] = await Promise.all([
        getComments({
            instanceURL,
            input: {
                post_id: postID,
                max_depth: 8,
                type_: "All",
                parent_id: commentID,
            },
        }),
        getPost({
            instanceURL,
            input: {
                id: postID,
            },
        }),
    ])

    const comments = commentResponse.data
    const post = postResponse.data

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
