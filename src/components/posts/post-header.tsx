import { Globe, Rat, Shield } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { CardHeader } from "../ui/card"
import Link from "next/link"
import { cn, formatTimeAgo } from "@/lib/utils"

export const PostHeader = (props: {
    communityIcon?: string
    instanceURL: string
    communityName: string
    communityTitle: string
    creatorUserName: string
    published: string
    postTitle: string
    isExplore?: boolean
    isUserAdmin?: boolean
    isUserMod?: boolean
}) => {
    return (
        <CardHeader className={cn("space-y-4", !props.isExplore && "px-0")}>
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src={props.communityIcon} />
                    <AvatarFallback>
                        <Rat />
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <Link
                        href={`/${props.instanceURL}/c/${props.communityName}`}
                        className="z-10 font-semibold text-purple-700 hover:underline dark:text-purple-300"
                    >
                        {props.communityTitle}
                    </Link>
                    <div className="flex items-end gap-1">
                        <div className="flex items-center gap-1">
                            <Link
                                href={`/${props.instanceURL}/u/${props.creatorUserName}`}
                                className="z-10 text-sm hover:underline"
                            >
                                <span>{props.creatorUserName}</span>
                            </Link>
                            {props.isUserMod && (
                                <Shield className="h-4 w-4 text-green-400" />
                            )}
                            {props.isUserAdmin && (
                                <Globe className="h-4 w-4 text-red-400" />
                            )}
                        </div>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                            {formatTimeAgo(new Date(props.published + "Z"))}
                        </span>
                    </div>
                </div>
            </div>
            <h1 className="text-xl font-bold">{props.postTitle}</h1>
        </CardHeader>
    )
}
