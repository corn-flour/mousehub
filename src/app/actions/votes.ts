"use server"
import { LemmyHttp } from "lemmy-js-client"

export type VoteActionProps = {
    instanceURL: string
    accessToken: string
    score: number
    id: number
}

export type DownvoteActionProps = {
    instanceURL: string
    accessToken: string
    hasUserDownvoted: boolean
    id: number
}

export const votePost = async (props: VoteActionProps) => {
    const lemmyClient = new LemmyHttp(`https://${props.instanceURL}`)
    const upvoteResponse = await lemmyClient.likePost({
        auth: props.accessToken,
        post_id: props.id,
        score: props.score,
    })
    return upvoteResponse
}
