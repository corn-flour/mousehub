"use server"

import { type CreatePost } from "lemmy-js-client"
import { createPost } from "@/services/lemmy"

type CreatePostProps = {
    instanceURL: string
    body: Omit<CreatePost, "auth">
}

export const submitPost = async (props: CreatePostProps) =>
    createPost({
        instanceURL: props.instanceURL,
        input: props.body,
    })
