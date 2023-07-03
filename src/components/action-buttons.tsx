"use client"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "./ui/button"
import { formatNumber } from "@/lib/utils"
import { votePost } from "@/app/actions/votes"
import { experimental_useOptimistic as useOptimistic } from "react"
import { useParams, useRouter } from "next/navigation"
import { Toggle } from "./ui/toggle"
import { useSession } from "next-auth/react"

export const UpvoteButton = ({ count }: { count: number }) => {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="relative z-10 h-auto gap-1 py-1 pl-2 pr-3"
            type="button"
            aria-label="Upvote"
        >
            <ChevronUp />
            <span>{formatNumber(count)}</span>
        </Button>
    )
}

export const DownvoteButton = ({ count }: { count: number }) => {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="relative z-10 h-auto gap-1 py-1 pl-1 pr-2"
            type="button"
            aria-label="Downvote"
        >
            <ChevronDown />
            <span>{formatNumber(count)}</span>
        </Button>
    )
}

const NoAuthVotingButtons = ({
    upvotes,
    downvotes,
}: {
    upvotes: number
    downvotes: number
}) => {
    return (
        <div className="flex items-center gap-1">
            <Button
                size="sm"
                className="relative z-10 h-auto gap-1 py-1 pl-2 pr-3"
                aria-label="Upvote"
            >
                <ChevronUp />
                <span>{formatNumber(upvotes)}</span>
            </Button>
            <Button
                size="sm"
                className="relative z-10 h-auto gap-1 py-1 pl-1 pr-2"
                aria-label="Downvote"
            >
                <ChevronDown />
                <span>{formatNumber(downvotes)}</span>
            </Button>
        </div>
    )
}

export const PostVotingButtons = (props: {
    upvotes: number
    downvotes: number
    myVote: number
    id: number
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
        return (
            <NoAuthVotingButtons
                upvotes={props.upvotes}
                downvotes={props.downvotes}
            />
        )
    }

    const handleUpvote = async () => {
        // if the user already upvoted, new score will be neutral, otherwise upvote the post
        const myNewVote = optimisticMyVote === 1 ? 0 : 1

        console.log("debug", optimisticMyVote, myNewVote)

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
        await votePost({
            instanceURL: params["instance_url"],
            accessToken: session?.accessToken,
            score: myNewVote,
            id: props.id,
        })
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
        await votePost({
            instanceURL: params["instance_url"],
            accessToken: session?.accessToken,
            score: myNewVote,
            id: props.id,
        })
        router.refresh()
    }

    return (
        <div className="flex items-center gap-1">
            <Toggle
                size="sm"
                className="relative z-10 h-auto gap-1 py-1 pl-2 pr-3"
                aria-label="Upvote"
                onPressedChange={handleUpvote}
                pressed={optimisticMyVote === 1}
            >
                <ChevronUp />
                <span>{formatNumber(optimisticUpvotes)}</span>
            </Toggle>
            <Toggle
                size="sm"
                className="relative z-10 h-auto gap-1 py-1 pl-1 pr-2"
                aria-label="Downvote"
                onPressedChange={handleDownvote}
                pressed={optimisticMyVote === -1}
            >
                <ChevronDown />
                <span>{formatNumber(optimisticDownvotes)}</span>
            </Toggle>
        </div>
    )
}
