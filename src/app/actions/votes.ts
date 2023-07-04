"use server"
import { createLemmyClient } from "@/lib/lemmy"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"

export type VoteActionProps = {
    instanceURL: string
    score: number
    id: number
}

export const votePost = async (props: VoteActionProps) => {
    const session = await getServerSession(authOptions)
    if (!session?.accessToken) {
        throw new Error("user is not signed in")
    }
    const lemmyClient = createLemmyClient(props.instanceURL)
    const upvoteResponse = await lemmyClient.likePost({
        auth: session.accessToken,
        post_id: props.id,
        score: props.score,
    })
    return upvoteResponse
}

export const voteComment = async (props: VoteActionProps) => {
    const session = await getServerSession(authOptions)
    if (!session?.accessToken) {
        throw new Error("user is not signed in")
    }
    const lemmyClient = createLemmyClient(props.instanceURL)
    const upvoteResponse = await lemmyClient.likeComment({
        auth: session.accessToken,
        comment_id: props.id,
        score: props.score,
    })
    return upvoteResponse
}
