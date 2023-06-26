import { type CommentNode, buildCommentTree, formatUserInfo } from "@/lib/lemmy"
import { LemmyHttp, type Person } from "lemmy-js-client"
import { Suspense } from "react"
import Mdx from "./mdx"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Rat } from "lucide-react"
import Link from "next/link"
import { DownvoteButton, UpvoteButton } from "./comment-btns"

const CommentAuthor = ({ author }: { author: Person }) => {
    const creator = formatUserInfo(author)
    return (
        <Link
            href={`/u/${author.id}`}
            className="group flex items-center gap-2"
        >
            <Avatar>
                <AvatarImage src={author.avatar} />
                <AvatarFallback>
                    <Rat />
                </AvatarFallback>
            </Avatar>
            <p className="group-hover:underline">{creator.userName}</p>
        </Link>
    )
}

const Comment = ({ comment }: { comment: CommentNode }) => {
    return (
        <div>
            <div className="space-y-2">
                <CommentAuthor author={comment.comment_view.creator} />
                <Mdx text={comment.comment_view.comment.content} />
                <div className="-ml-3 space-x-1">
                    <UpvoteButton count={comment.comment_view.counts.upvotes} />
                    <DownvoteButton
                        count={comment.comment_view.counts.downvotes}
                    />
                </div>
            </div>
            {comment.children.length ? (
                <div className="mt-4 space-y-4 border-l pl-4">
                    {comment.children.map((child) => (
                        <Comment
                            comment={child}
                            key={child.comment_view.comment.id}
                        />
                    ))}
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}

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
        limit: 20,
        type_: "All",
    })
    const commentTree = buildCommentTree(comments.comments, false)

    return (
        <div className="space-y-8">
            {commentTree.map((comment) => (
                <Comment
                    comment={comment}
                    key={comment.comment_view.comment.id}
                />
            ))}
        </div>
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
            <h2 className="text-xl">Comments</h2>
            <Suspense fallback={<div>Loading..</div>}>
                <Comments postID={postID} instanceURL={instanceURL} />
            </Suspense>
        </section>
    )
}

export default CommentView
