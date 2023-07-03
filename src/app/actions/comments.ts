"use server"

import { LemmyHttp } from "lemmy-js-client"

export const createComment = async (props: {
    instanceURL: string
    accessToken: string
    content: string
    postID: number
    parentCommentID?: number
}) => {
    const lemmyClient = new LemmyHttp(`https://${props.instanceURL}`)
    const commentResponse = await lemmyClient.createComment({
        auth: props.accessToken,
        content: props.content,
        post_id: props.postID,
        parent_id: props.parentCommentID,
    })
    return commentResponse
}
