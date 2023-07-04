"use client"

import { type CommentNode, formatUserInfo } from "@/lib/lemmy"
import Link from "next/link"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { type Person } from "lemmy-js-client"
import { Rat, Reply } from "lucide-react"
import { useInView } from "react-intersection-observer"
import Mdx from "../markdown/mdx"
import { VotingButtons } from "../action-buttons"
import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"
import { AdminIcon, BotIcon, ModIcon, OriginalPosterIcon } from "../icons"
import { TimeTooltip } from "../time-tooltip"
import { Toggle } from "../ui/toggle"
import { CommentForm } from "./comment-form"
import { useSession } from "next-auth/react"

const CommentHeader = ({
    author,
    publishedAt,
    isAdmin,
    isMod,
    isBot,
    isOriginalPoster,
}: {
    author: Person
    publishedAt: string
    isAdmin: boolean
    isMod: boolean
    isBot: boolean
    isOriginalPoster: boolean
}) => {
    const creator = formatUserInfo(author)

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
                <div className="inline-flex items-center gap-1">
                    <Link
                        href={`/${instanceURL}/u/${creator.userName}`}
                        className={cn(
                            "hover:underline",
                            isOriginalPoster
                                ? "text-blue-700 dark:text-blue-400"
                                : isMod
                                ? "text-green-700 dark:text-green-400"
                                : isAdmin && "text-red-600 dark:text-red-400",
                        )}
                    >
                        {creator.userName}
                    </Link>
                    {isOriginalPoster ? (
                        <OriginalPosterIcon />
                    ) : isMod ? (
                        <ModIcon />
                    ) : isAdmin ? (
                        <AdminIcon />
                    ) : (
                        isBot && <BotIcon />
                    )}
                </div>
                <span className="text-sm text-muted-foreground">•</span>
                <TimeTooltip time={publishedAt} />
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
    accessToken,
}: {
    comment: CommentNode
    depth: number
    accessToken?: string
}) => {
    const hasChildren = !!comment.children.length
    const [replyformOpen, setReplyFormOpen] = useState(false)

    return (
        <div>
            <div className="space-y-2">
                <CommentHeader
                    author={comment.comment_view.creator}
                    publishedAt={comment.comment_view.comment.published}
                    isOriginalPoster={comment.creator.isOriginalPoster}
                    isAdmin={comment.creator.isAdmin}
                    isMod={comment.creator.isModerator}
                    isBot={comment.creator.isBot}
                />
                <Mdx text={comment.comment_view.comment.content} />
                <div className="-ml-3 flex gap-2 space-x-1">
                    <VotingButtons
                        type="comment"
                        id={comment.comment_view.comment.id}
                        upvotes={comment.comment_view.counts.upvotes}
                        downvotes={comment.comment_view.counts.downvotes}
                        myVote={comment.comment_view.my_vote ?? 0}
                    />
                    <Toggle
                        className="gap-2"
                        size="sm"
                        pressed={replyformOpen}
                        onPressedChange={setReplyFormOpen}
                    >
                        <Reply className="h-4 w-4" />
                        Reply
                    </Toggle>
                </div>
            </div>
            <div className="mt-4">
                {replyformOpen &&
                    (accessToken ? (
                        <CommentForm
                            accessToken={accessToken}
                            postID={comment.comment_view.post.id}
                            parentCommentID={comment.comment_view.comment.id}
                            onCancel={() => setReplyFormOpen(false)}
                        />
                    ) : (
                        <div>You must sign in to reply to comments</div>
                    ))}
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
                            accessToken={accessToken}
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
    const { data: session } = useSession()

    return (
        <div>
            <div className="space-y-8">
                {filteredTree.map((comment) => (
                    <Comment
                        comment={comment}
                        key={comment.comment_view.comment.id}
                        depth={0}
                        accessToken={session?.accessToken}
                    />
                ))}
            </div>
            <div ref={endContainer} />
        </div>
    )
}
