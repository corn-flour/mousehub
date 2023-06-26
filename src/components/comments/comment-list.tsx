"use client"

import { type CommentNode, formatUserInfo } from "@/lib/lemmy"
import Link from "next/link"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { type Person } from "lemmy-js-client"
import { Rat } from "lucide-react"
import { useInView } from "react-intersection-observer"
import Mdx from "../mdx"
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

// renders an infinite scrolling list of comments
const CommentList = ({
    commentTree,
    limit,
}: {
    commentTree: CommentNode[]
    limit: number
}) => {
    const [count, setCount] = useState(limit)
    const { ref: endContainer } = useInView({
        onChange: (inView) => {
            if (inView) {
                setTimeout(() => {
                    setCount((count) => count + limit)
                }, 300)
            }
        },
    })
    const filteredTree = commentTree.slice(0, count)

    return (
        <div>
            <div className="space-y-8">
                {filteredTree.map((comment) => (
                    <Comment
                        comment={comment}
                        key={comment.comment_view.comment.id}
                    />
                ))}
            </div>
            <div ref={endContainer} />
        </div>
    )
}

export default CommentList
