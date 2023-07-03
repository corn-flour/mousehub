"use client"

import { useForm } from "react-hook-form"
import MDEditor from "@uiw/react-md-editor"

import { Form, FormField, FormItem, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import { Loader, Send } from "lucide-react"
import rehypeSanitize from "rehype-sanitize"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { createComment } from "@/app/actions/comments"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const commentFormSchema = z.object({
    text: z.string().min(1),
})

const CommentForm = ({
    postID,
    accessToken,
    onCancel,
}: {
    postID: number
    accessToken: string
    onCancel: () => void
}) => {
    const params = useParams()

    const form = useForm({
        resolver: zodResolver(commentFormSchema),
        defaultValues: {
            text: "",
        },
    })

    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onSubmit = async (data: { text: string }) => {
        setLoading(true)
        await createComment({
            instanceURL: params["instance_url"],
            postID,
            accessToken,
            content: data.text,
        })
        setLoading(false)
        form.reset()
        router.refresh()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                        <FormItem>
                            <MDEditor
                                value={field.value}
                                onChange={(v) => field.onChange(v ?? "")}
                                preview="edit"
                                previewOptions={{
                                    rehypePlugins: [[rehypeSanitize]],
                                }}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button type="submit" className="gap-2">
                        {loading ? (
                            <Loader className="h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                        Comment
                    </Button>
                    <Button variant="ghost" type="button" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    )
}

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
                    accessToken={session.accessToken}
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
