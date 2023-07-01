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
import { cn, formatTimeAgo } from "@/lib/utils"
import { useParams } from "next/navigation"

const CommentHeader = ({
    author,
    publishedAt,
}: {
    author: Person
    publishedAt: string
}) => {
    const creator = formatUserInfo(author)
    const publishedDate = new Date(publishedAt + "Z")

    const params = useParams()
    const instanceURL = params["instance_url"]

    return (
        <div className="flex items-center gap-2">
            <Link
                href={`/u/${creator.userName}`}
                className="hover:underline"
                aria-hidden
                tabIndex={-1}
            >
                <Avatar>
                    <AvatarImage src={author.avatar} />
                    <AvatarFallback>
                        <Rat />
                    </AvatarFallback>
                </Avatar>
            </Link>
            <div className="flex items-end gap-1">
                <Link
                    href={`/${instanceURL}/u/${creator.userName}`}
                    className="hover:underline"
                >
                    {creator.userName}
                </Link>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                    {formatTimeAgo(publishedDate)}
                </span>
            </div>
        </div>
    )
}

const borderColors = [
    "border-red-400/70",
    "border-orange-400/70",
    "border-yellow-400/70",
    "border-blue-400/70",
    "border-green-400/70",
    "border-blue-400/70",
    "border-indigo-400/70",
    "border-violet-400/70",
]

const Comment = ({
    comment,
    depth,
}: {
    comment: CommentNode
    depth: number
}) => {
    const hasChildren = !!comment.children.length

    return (
        <div>
            <div className="space-y-2">
                <CommentHeader
                    author={comment.comment_view.creator}
                    publishedAt={comment.comment_view.comment.published}
                />
                <Mdx text={comment.comment_view.comment.content} />
                <div className="-ml-3 space-x-1">
                    <UpvoteButton count={comment.comment_view.counts.upvotes} />
                    <DownvoteButton
                        count={comment.comment_view.counts.downvotes}
                    />
                </div>
            </div>
            {hasChildren && (
                <div
                    className={cn(
                        "mt-4 space-y-4 border-l-4 pl-4",
                        borderColors[depth],
                    )}
                >
                    {comment.children.map((child) => (
                        <Comment
                            comment={child}
                            key={child.comment_view.comment.id}
                            depth={(depth + 1) % borderColors.length}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

// renders an infinite scrolling list of comments
export const CommentList = ({
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
                        depth={0}
                    />
                ))}
            </div>
            <div ref={endContainer} />
        </div>
    )
}
