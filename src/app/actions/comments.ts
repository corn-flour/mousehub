"use server"

import { createLemmyClient } from "@/lib/lemmy"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { authOptions } from "../api/auth/[...nextauth]/route"

export const createComment = async (props: {
    instanceURL: string
    // accessToken: string
    content: string
    postID: number
    parentCommentID?: number
}) => {
    const session = await getServerSession(authOptions)
    if (!session?.accessToken) {
        console.log("no session found")
        throw new Error("user isn't signed in")
    }

    const lemmyClient = createLemmyClient(props.instanceURL)
    const commentResponse = await lemmyClient.createComment({
        auth: session.accessToken,
        content: props.content,
        post_id: props.postID,
        parent_id: props.parentCommentID,
    })

    revalidatePath(`/[instance_url]/post/[post_id]`)
    revalidatePath(`/[instance_url]/u/[user_name]/comments`)
    return commentResponse
}
