import { type CommentView } from "lemmy-js-client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import Link from "next/link"
import { formatCommunityInfo, formatUserInfo } from "@/lib/lemmy"
import { formatTimeAgo } from "@/lib/utils"
import Mdx from "../markdown/mdx"
import { Separator } from "../ui/separator"
import { VotingButtons } from "../action-buttons"

const CommentLink = ({
    comment,
    instanceURL,
}: {
    comment: CommentView
    instanceURL: string
}) => {
    const publishedDate = new Date(comment.comment.published + "Z")
    const community = formatCommunityInfo(comment.community)
    const creator = formatUserInfo(comment.creator)

    return (
        <Card className="overflow-hidden">
            <CardHeader className="relative space-y-2 py-2 transition hover:bg-muted">
                <Link
                    href={`/${instanceURL}/post/${comment.post.id}`}
                    className="absolute inset-0"
                >
                    <span className="sr-only">Visit post</span>
                </Link>

                {/** Comment context -------------------------------------------------- */}
                <CardTitle className="text-md font-normal">
                    <Link
                        href={`/${instanceURL}/u/${creator.userName}`}
                        className="relative z-10 font-semibold hover:underline"
                    >
                        {comment.creator.display_name ?? comment.creator.name}
                    </Link>
                    <span> commented on </span>
                    <span className="font-semibold">{comment.post.name}</span>
                    <span className="text-muted-foreground"> • </span>
                    <Link
                        href={`/${instanceURL}/c/${community.communityName}@${community.domain}`}
                        className="relative z-10 inline-flex items-center gap-2 font-semibold hover:underline"
                        aria-hidden
                        tabIndex={-1}
                    >
                        <span>{comment.community.name}</span>
                    </Link>
                    <span className="text-sm text-muted-foreground"> • </span>
                    <span className="text-muted-foreground">
                        {formatTimeAgo(publishedDate)}
                    </span>
                </CardTitle>
            </CardHeader>
            <Separator className="mx-auto w-[calc(100%-3rem)]" />
            <CardContent className="relative space-y-2 py-2 transition hover:bg-muted">
                <Link
                    href={`/${instanceURL}/comment/${comment.comment.id}`}
                    className="absolute inset-1"
                >
                    <span className="sr-only">Visit comment</span>
                </Link>
                <Mdx text={comment.comment.content} />
                <div className="-ml-3 space-x-1">
                    <VotingButtons
                        type="comment"
                        id={comment.comment.id}
                        upvotes={comment.counts.upvotes}
                        downvotes={comment.counts.downvotes}
                        myVote={comment.my_vote ?? 0}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default CommentLink
