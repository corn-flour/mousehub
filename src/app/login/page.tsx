"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { type SubmitHandler, useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { z } from "zod"

const loginFormSchema = z.object({
    instance_url: z.string(),
    username: z.string(),
    password: z.string(),
})

type LoginFormData = z.infer<typeof loginFormSchema>

// TODO: display list of currently logged in accounts
const LoginPage = () => {
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema),
    })

    const onSubmit: SubmitHandler<LoginFormData> = (data) => {
        const { instance_url, username, password } = data
        void signIn("credentials", {
            instanceURL: instance_url,
            username,
            password,
            callbackUrl: `/${instance_url}`,
        })
    }

    return (
        <Form {...form}>
            <Card className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>
                        Sign in to your Lemmy account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="instance_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instance URL</FormLabel>
                                    <FormDescription>
                                        The lemmy instance of your account
                                    </FormDescription>
                                    <FormControl>
                                        <Input
                                            placeholder="lemmy.world"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username or email</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Sign In</Button>
                    </CardFooter>
                </form>
            </Card>
        </Form>
    )
}

export default LoginPage
