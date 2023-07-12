"use client"
import { ArrowDown, ArrowUp } from "lucide-react"
import { formatNumber } from "@/lib/utils"
import { voteComment, votePost } from "@/app/actions/votes"
import { experimental_useOptimistic as useOptimistic } from "react"
import { useParams, useRouter } from "next/navigation"
import { Toggle } from "./ui/toggle"
import { useSession } from "next-auth/react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

const UpvoteButton = (props: {
    upvotes: number
    isPressed: boolean
    onPress?: () => void
}) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Toggle
                    size="sm"
                    className="relative z-10 h-auto gap-1 py-1 pl-2 pr-3 data-[state=on]:bg-transparent data-[state=on]:text-blue-600 data-[state=on]:hover:bg-muted dark:data-[state=on]:text-blue-400"
                    aria-label="Upvote"
                    onPressedChange={props.onPress}
                    pressed={props.isPressed}
                >
                    <ArrowUp />
                    <span>{formatNumber(props.upvotes)}</span>
                </Toggle>
            </TooltipTrigger>
            <TooltipContent>
                <p>
                    {props.onPress ? "Upvote" : "You need to sign in to upvote"}
                </p>
            </TooltipContent>
        </Tooltip>
    )
}

const DownvoteButton = (props: {
    downvotes: number
    isPressed: boolean
    onPress?: () => void
}) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Toggle
                    size="sm"
                    className="relative z-10 h-auto gap-1 py-1 pl-2 pr-3 data-[state=on]:bg-transparent data-[state=on]:text-red-600 data-[state=on]:hover:bg-muted dark:data-[state=on]:text-red-400"
                    aria-label="Downvote"
                    onPressedChange={props.onPress}
                    pressed={props.isPressed}
                >
                    <ArrowDown />
                    <span>{formatNumber(props.downvotes)}</span>
                </Toggle>
            </TooltipTrigger>
            <TooltipContent>
                <p>
                    {props.onPress
                        ? "Downvote"
                        : "You need to sign in to downvote"}
                </p>
            </TooltipContent>
        </Tooltip>
    )
}

export const VotingButtons = (props: {
    upvotes: number
    downvotes: number
    myVote: number
    id: number
    type: "post" | "comment"
}) => {
    const [optimisticUpvotes, setOptimisticUpvotes] = useOptimistic<
        number,
        number
    >(props.upvotes, (_, newVote) => newVote)

    const [optimisticDownvotes, setOptimisticDownvotes] = useOptimistic<
        number,
        number
    >(props.downvotes, (_, newVote) => newVote)

    const [optimisticMyVote, setOptimisticMyvote] = useOptimistic<
        number,
        number
    >(props.myVote, (_, newMyVote) => newMyVote)

    const params = useParams()
    const { data: session } = useSession()
    const router = useRouter()

    if (!session) {
        // this renders the toggles without event handler
        // either when the user is not logged in
        // or when JS isn't ready and session isn't fetched yet
        return (
            <div className="flex items-center gap-1">
                <UpvoteButton
                    upvotes={props.upvotes}
                    isPressed={props.myVote === 1}
                />
                <DownvoteButton
                    downvotes={props.downvotes}
                    isPressed={props.myVote === -1}
                />
            </div>
        )
    }

    const handleUpvote = async () => {
        // if the user already upvoted, new score will be neutral, otherwise upvote the post
        const myNewVote = optimisticMyVote === 1 ? 0 : 1

        // if the user is upvoting the post then increase upvote count by 1
        // otherwise decrease it by one (since user no longer upvotes it)
        const newUpvotes =
            myNewVote === 1 ? optimisticUpvotes + 1 : optimisticUpvotes - 1
        setOptimisticUpvotes(newUpvotes)

        // if the user was downvoting the post before, reduce the downvote count by 1
        // otherwise it remains unchanged
        const newDownvotes =
            optimisticMyVote === -1
                ? optimisticDownvotes - 1
                : optimisticDownvotes
        setOptimisticDownvotes(newDownvotes)

        // optimistically update the user vote
        setOptimisticMyvote(myNewVote)

        // call serverAction
        if (props.type === "post") {
            await votePost({
                instanceURL: params["instance_url"],
                score: myNewVote,
                id: props.id,
            })
        } else {
            await voteComment({
                instanceURL: params["instance_url"],
                score: myNewVote,
                id: props.id,
            })
        }
        router.refresh()
    }

    const handleDownvote = async () => {
        // if the user has downvoted before, the vote becomes neutral
        // otherwise, the user vote is downvote
        const myNewVote = optimisticMyVote === -1 ? 0 : -1

        // if user is downvoting, increase the downvote count by 1
        // otherwise, decrease it by 1 (user vote is now neutral)
        const newDownvotes =
            myNewVote === -1 ? optimisticDownvotes + 1 : optimisticDownvotes - 1
        setOptimisticDownvotes(newDownvotes)

        // if user was upvoting before, decrease the upvote count by 1
        // otherwise, it is unchanged
        const newUpvotes =
            optimisticMyVote === 1 ? optimisticUpvotes - 1 : optimisticUpvotes
        setOptimisticUpvotes(newUpvotes)

        // optimistically update user vote
        setOptimisticMyvote(myNewVote)

        // call server action
        if (props.type === "post") {
            await votePost({
                instanceURL: params["instance_url"],
                score: myNewVote,
                id: props.id,
            })
        } else {
            await voteComment({
                instanceURL: params["instance_url"],
                score: myNewVote,
                id: props.id,
            })
        }
        router.refresh()
    }

    return (
        <div className="flex items-center gap-1">
            <UpvoteButton
                upvotes={optimisticUpvotes}
                isPressed={optimisticMyVote === 1}
                onPress={() => handleUpvote()}
            />
            <DownvoteButton
                downvotes={optimisticDownvotes}
                isPressed={optimisticMyVote === -1}
                onPress={() => handleDownvote()}
            />
        </div>
    )
}
