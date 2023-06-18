import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { login } from "../auth-action"

const LoginPage = () => {
    return (
        <div>
            <form
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                action={login}
            >
                <Card>
                    <CardHeader>
                        <h1 className="text-xl">Sign In</h1>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <label className="flex flex-col gap-1">
                            <span>Instance URL</span>
                            <Input name="instance_url" />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span>Username or Email</span>
                            <Input name="username" />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span>Password</span>
                            <Input name="password" type="password" />
                        </label>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Sign In</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}

export default LoginPage
