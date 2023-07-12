"use server"
import { likeComment, likePost } from "@/services/lemmy"

export type VoteActionProps = {
    instanceURL: string
    score: number
    id: number
}

export const votePost = async (props: VoteActionProps) =>
    likePost({
        instanceURL: props.instanceURL,
        input: {
            post_id: props.id,
            score: props.score,
        },
    })

export const voteComment = async (props: VoteActionProps) =>
    likeComment({
        instanceURL: props.instanceURL,
        input: {
            comment_id: props.id,
            score: props.score,
        },
    })
