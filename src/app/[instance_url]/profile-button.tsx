"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type MyUserInfo } from "lemmy-js-client"
import { LogOut, Rat, User } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"

export const ProfileButton = ({
    user,
    instanceURL,
}: {
    user: MyUserInfo
    instanceURL: string
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-auto w-auto cursor-pointer items-center gap-2 px-2 py-1.5"
                >
                    <Avatar>
                        <AvatarImage src={user.local_user_view.person.avatar} />
                        <AvatarFallback>
                            <Rat />
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                        <p>{user.local_user_view.person.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {instanceURL}
                        </p>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuItem asChild>
                    <Link
                        href={`/${instanceURL}/u/${user.local_user_view.person.name}`}
                        className="flex items-center gap-2"
                    >
                        <User className="h-4 w-4" />
                        View Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={async () => {
                        await signOut({
                            callbackUrl: "/lemmy.world/local",
                        })
                    }}
                    className="flex cursor-pointer items-center gap-2"
                >
                    <LogOut className="h-4 w-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
