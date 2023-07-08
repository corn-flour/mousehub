"use server"

import { type CreatePost } from "lemmy-js-client"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { createLemmyClient } from "@/lib/lemmy"

type CreatePostProps = {
    instanceURL: string
    body: Omit<CreatePost, "auth">
}

export const createPost = async (props: CreatePostProps) => {
    const session = await getServerSession(authOptions)

    if (!session) {
        throw new Error("Unauthorized")
    }

    const lemmyClient = createLemmyClient(props.instanceURL)
    const createPostResponse = await lemmyClient.createPost({
        auth: session.accessToken,
        ...props.body,
    })

    return createPostResponse
}
