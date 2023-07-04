"use server"
import { createLemmyClient } from "@/lib/lemmy"

export type VoteActionProps = {
    instanceURL: string
    accessToken: string
    score: number
    id: number
}

export const votePost = async (props: VoteActionProps) => {
    const lemmyClient = createLemmyClient(props.instanceURL)
    const upvoteResponse = await lemmyClient.likePost({
        auth: props.accessToken,
        post_id: props.id,
        score: props.score,
    })
    return upvoteResponse
}

export const voteComment = async (props: VoteActionProps) => {
    const lemmyClient = createLemmyClient(props.instanceURL)
    const upvoteResponse = await lemmyClient.likeComment({
        auth: props.accessToken,
        comment_id: props.id,
        score: props.score,
    })
    return upvoteResponse
}
