"use server"
import { createComment } from "@/services/lemmy"

export const postComment = async (props: {
    instanceURL: string
    content: string
    postID: number
    parentCommentID?: number
}) =>
    createComment({
        instanceURL: props.instanceURL,
        input: {
            content: props.content,
            post_id: props.postID,
            parent_id: props.parentCommentID,
        },
    })
