"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { Button } from "../ui/button"
import Link from "next/link"
import { CommentForm } from "./comment-form"

export const PostCommentButton = (props: { postID: number }) => {
    const { data: session } = useSession()
    const [commentFormOpen, setCommentFormOpen] = useState(false)

    if (!session) {
        return (
            <Button asChild>
                <Link href="/login">Sign in to add comment</Link>
            </Button>
        )
    }
    return (
        <>
            {commentFormOpen ? (
                <CommentForm
                    postID={props.postID}
                    onCancel={() => setCommentFormOpen(false)}
                />
            ) : (
                <Button onClick={() => setCommentFormOpen(true)}>
                    Add Comment
                </Button>
            )}
        </>
    )
}
