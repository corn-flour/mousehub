import { Rat } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { CardHeader } from "../ui/card"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { AdminIcon, BotIcon, ModIcon } from "../icons"
import { TimeTooltip } from "../time-tooltip"

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
    isBot?: boolean
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
                            {props.isBot && <BotIcon />}
                            {props.isUserMod && <ModIcon />}
                            {props.isUserAdmin && <AdminIcon />}
                        </div>
                        <span className="text-sm text-muted-foreground">•</span>
                        <TimeTooltip time={props.published} />
                    </div>
                </div>
            </div>
            <h1 className="text-xl font-bold">{props.postTitle}</h1>
        </CardHeader>
    )
}
