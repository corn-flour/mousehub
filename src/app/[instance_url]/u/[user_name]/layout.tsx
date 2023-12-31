import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Rat } from "lucide-react"
import Image from "next/image"
import { Suspense, type ReactNode } from "react"
import { UserNav } from "./user-nav"
import { formatUserInfo } from "@/lib/lemmy"
import { getUser } from "@/services/lemmy"

const UserHeader = async ({
    userName: rawUserName,
    instanceURL,
}: {
    userName: string
    instanceURL: string
}) => {
    const userName = decodeURIComponent(rawUserName)

    const { data: userDetails } = await getUser({
        instanceURL,
        input: {
            username: userName,
        },
    })

    const user = formatUserInfo(userDetails.person_view.person)

    return (
        <section>
            <div className="relative h-96 w-full bg-muted-foreground">
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
                            <AvatarFallback className=" bg-primary-foreground">
                                <Rat className="h-12 w-12 text-primary" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl font-bold">
                                {user.displayName}
                            </h1>
                            <div className="flex items-center gap-1">
                                <p className="text-lg">@{user.userName}</p>
                                <span className="rounded-lg bg-black/40 px-2 py-1.5 text-sm leading-none tracking-wider text-muted-foreground">
                                    @{user.domain}
                                </span>
                            </div>
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
        <div>
            <Suspense fallback={<UserHeaderSkeleton />}>
                <UserHeader
                    instanceURL={params.instance_url}
                    userName={params.user_name}
                />
            </Suspense>
            <div className="p-4">
                <div className="mx-auto max-w-7xl space-y-4">
                    <UserNav
                        instanceURL={params.instance_url}
                        userName={params.user_name}
                    />
                    <main className="space-y-4">{children}</main>
                </div>
            </div>
        </div>
    )
}

export default UserLayout
