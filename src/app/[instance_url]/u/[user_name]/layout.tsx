import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { LemmyHttp } from "lemmy-js-client"
import { Rat } from "lucide-react"
import Image from "next/image"
import { Suspense, type ReactNode } from "react"

const UserHeader = async ({
    userName: rawUserName,
    instanceURL,
}: {
    userName: string
    instanceURL: string
}) => {
    const userName = decodeURIComponent(rawUserName)
    const lemmyClient = new LemmyHttp(`https://${instanceURL}`)
    const userDetails = await lemmyClient.getPersonDetails({
        username: userName,
    })

    return (
        <section>
            <div className="relative h-96 w-full">
                {userDetails.person_view.person.banner && (
                    <Image
                        src={userDetails.person_view.person.banner}
                        alt={`Banner of ${userName}`}
                        className="object-cover"
                        fill
                    />
                )}
            </div>

            <div className="relative h-24 bg-muted px-4">
                <div className="absolute left-1/2 top-0 mx-auto w-full max-w-7xl -translate-x-1/2 -translate-y-7">
                    <div className="flex items-end gap-4">
                        <Avatar className="h-24 w-24 border-[5px] border-muted bg-muted">
                            <AvatarImage
                                src={userDetails.person_view.person.avatar}
                            />
                            <AvatarFallback className="bg-white">
                                <Rat className="h-12 w-12 text-muted" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {userDetails.person_view.person.display_name
                                        ? userDetails.person_view.person
                                              .display_name
                                        : userName}
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    @{decodeURIComponent(userName)}
                                </p>
                            </div>
                            <Button variant="destructive">Block</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const UserHeaderSkeleton = () => {
    return (
        <section>
            <div className="h-96 w-full bg-muted-foreground"></div>

            <div className="relative h-24 bg-muted px-4">
                <div className="absolute left-1/2 top-0 mx-auto w-full max-w-7xl -translate-x-1/2 -translate-y-7">
                    <div className="flex items-end gap-4">
                        <div className="h-24 w-24 rounded-full bg-muted">
                            <Skeleton className="h-24 w-24 rounded-full bg-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-[250px] bg-muted-foreground" />
                                <Skeleton className="h-3 w-[200px] bg-muted-foreground" />
                            </div>
                            <Button>Subscribe</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const UserLayout = ({
    params,
    children,
}: {
    params: {
        instance_url: string
        user_name: string
    }
    children: ReactNode
}) => {
    return (
        <>
            <Suspense fallback={<UserHeaderSkeleton />}>
                <UserHeader
                    instanceURL={params.instance_url}
                    userName={params.user_name}
                />
            </Suspense>
            <div className="p-4">
                <div className="mx-auto max-w-7xl">
                    <main className="space-y-4">{children}</main>
                </div>
            </div>
        </>
    )
}

export default UserLayout
