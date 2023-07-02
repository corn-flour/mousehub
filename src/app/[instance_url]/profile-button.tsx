"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeftRight, LogOut, PlusCircle, Rat, User } from "lucide-react"
import { signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { useAccountManager } from "../account-provider"

export const ProfileButton = ({
    user,
    instanceURL,
}: {
    user: {
        id: string
        userName: string
        avatar?: string
    }
    instanceURL: string
}) => {
    const { accounts: accountSet, removeAccount } = useAccountManager()

    const accounts = Array.from(accountSet)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-auto w-auto cursor-pointer items-center gap-2 px-2 py-1.5"
                >
                    <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                            <Rat />
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left md:block">
                        <p>{user.userName}</p>
                        <p className="text-sm text-muted-foreground">
                            {instanceURL}
                        </p>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuItem asChild>
                    <Link
                        href={`/${instanceURL}/u/${user.userName}`}
                        className="flex items-center gap-2"
                    >
                        <User className="h-4 w-4" />
                        View Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex cursor-pointer items-center gap-2">
                        <ArrowLeftRight className="h-4 w-4" />
                        <span>Switch Account</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent className="flex flex-col gap-1">
                            {accounts.map((account) => (
                                <DropdownMenuItem key={account.id} asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex h-auto w-auto cursor-pointer items-center justify-start gap-2 px-2 py-1.5"
                                        onClick={() =>
                                            signIn("account-switch", {
                                                instanceURL:
                                                    account.instanceURL,
                                                accessToken: account.jwt,
                                            })
                                        }
                                    >
                                        <Avatar>
                                            <AvatarImage
                                                src={account.localUser.avatar}
                                            />
                                            <AvatarFallback>
                                                <Rat />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="hidden text-left md:block">
                                            <p>{account.localUser.userName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {account.instanceURL}
                                            </p>
                                        </div>
                                    </Button>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/login"
                                    className="flex cursor-pointer items-center gap-2"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    Add Account
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={async () => {
                        removeAccount(user.id)
                        await signOut({
                            callbackUrl: "/login",
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
