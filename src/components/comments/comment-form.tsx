import { useForm } from "react-hook-form"

import { Form, FormField, FormItem, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import { Loader, Send } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { createComment } from "@/app/actions/comments"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormMarkdownEditor } from "../markdown/markdown-editor"

const commentFormSchema = z.object({
    text: z.string().min(1),
})

//! This component MUST be imported from a client component
//! since it is taking in a onCancel() function prop
export const CommentForm = ({
    postID,
    parentCommentID,
    onCancel,
}: {
    postID: number
    parentCommentID?: number
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

            parentCommentID,
            content: data.text,
        })
        setLoading(false)
        onCancel()
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
                            <FormMarkdownEditor
                                value={field.value}
                                onChange={field.onChange}
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
