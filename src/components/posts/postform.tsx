"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { CommunitySelector } from "../community-selector"
import { Input } from "../ui/input"
import { FormMarkdownEditor } from "../markdown/markdown-editor"
import { Switch } from "../ui/switch"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card"
import { Button } from "../ui/button"
import { createPost } from "@/app/actions/posts"
import { useParams, useRouter } from "next/navigation"
import { Loader, Send } from "lucide-react"

const postFormSchema = z.object({
    // The community the post will go to
    communityID: z.number(),

    // the title of the post
    name: z.string(),

    // the content of the post
    body: z.string().optional(),

    // A related URL for the post, or a link to the post image
    url: z.string().optional(),

    // Mark if post is NSFW or not
    nsfw: z.boolean(),
})

type PostFormData = z.infer<typeof postFormSchema>

export const PostForm = ({
    initialCommunityID,
}: {
    initialCommunityID?: number
}) => {
    console.log("initial community ID", initialCommunityID)
    const params = useParams()
    const router = useRouter()
    const form = useForm<PostFormData>({
        resolver: zodResolver(postFormSchema),
        defaultValues: {
            communityID: initialCommunityID,
            nsfw: false,
        },
    })

    const onSubmit: SubmitHandler<PostFormData> = async (data) => {
        const { communityID, ...rest } = data
        const postFormResponse = await createPost({
            instanceURL: params["instance_url"],
            body: {
                community_id: communityID,
                ...rest,
            },
        })

        router.push(
            `/${params["instance_url"]}/post/${postFormResponse.post_view.post.id}`,
        )
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Create a new post</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="communityID"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Community</FormLabel>
                                    <CommunitySelector
                                        value={field.value}
                                        onChange={field.onChange}
                                        isInForm
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Post title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="body"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormMarkdownEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="nsfw"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2 space-y-0">
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel>Mark NSFW</FormLabel>
                                </FormItem>
                            )}
                        />
                    </CardContent>

                    <CardFooter>
                        <Button
                            type="submit"
                            className="gap-2"
                            disabled={
                                !form.formState.isValid ||
                                form.formState.isSubmitting
                            }
                        >
                            {form.formState.isSubmitting ? (
                                <Loader className="animate-spin" />
                            ) : (
                                <Send />
                            )}
                            Create post
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}
