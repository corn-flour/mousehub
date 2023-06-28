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
import { LogOut, Rat } from "lucide-react"
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
                <Button variant="ghost" className="h-auto w-auto p-1">
                    <Avatar>
                        <AvatarImage src={user.local_user_view.person.avatar} />
                        <AvatarFallback>
                            <Rat />
                        </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">
                        {user.local_user_view.person.name}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuItem asChild>
                    <Link
                        href={`/${instanceURL}/u/${user.local_user_view.local_user.id}`}
                        className="flex cursor-pointer items-center gap-2"
                    >
                        <Avatar>
                            <AvatarImage
                                src={user.local_user_view.person.avatar}
                            />
                            <AvatarFallback>
                                <Rat />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p>{user.local_user_view.person.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {instanceURL}
                            </p>
                        </div>
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
