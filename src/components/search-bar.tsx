"use client"

import { useQuery } from "@tanstack/react-query"
import { type SearchResponse } from "lemmy-js-client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounce } from "use-debounce"
import { Button } from "./ui/button"
import { Loader, Search, XCircle } from "lucide-react"
import {
    CommandDialog,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command"
import { formatCommunityInfo, formatUserInfo } from "@/lib/lemmy"
import { useRouter } from "next/navigation"
import { Separator } from "./ui/separator"

export const SearchBar = () => {
    const params = useParams()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    const [debouncedQuery] = useDebounce(searchQuery, 300)

    const instanceURL = params["instance_url"]

    const { data, status } = useQuery({
        queryFn: async ({ queryKey }) => {
            // user doesn't pass in any queryKey, just return
            if (!queryKey[1]) return null

            const queryParams = new URLSearchParams({
                query: queryKey[1],
                instanceURL: instanceURL,
                type: "All",
                limit: "4",
            })

            // this fetch doesn't always need to be the most up to date
            // cache for 1 hour before revalidating
            const response = await fetch(
                `/api/search?${queryParams.toString()}`,
                {
                    next: {
                        revalidate: 3600,
                    },
                },
            )
            const searchResponse = (await response.json()) as SearchResponse
            return searchResponse
        },
        queryKey: ["search", debouncedQuery],
    })
    const [open, setOpen] = useState(false)

    // toggle search bar with shortkeys
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const foundSomething = !!data
    const hasUsers = !!data?.users?.length
    const hasCommunities = !!data?.communities?.length

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setOpen(true)}
                className="relative flex items-center justify-start gap-1 text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
            >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline-flex">Search Lemmy...</span>
                <span className="hidden sm:inline-flex lg:hidden">
                    Search...
                </span>
                <kbd className="pointer-events-none absolute right-1.5 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>

            <CommandDialog
                open={open}
                onOpenChange={(open) => {
                    setOpen(open)
                    setSearchQuery("")
                }}
                shouldFilter={false}
            >
                <CommandInput
                    placeholder="Type anything to search..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                />
                {status === "loading" ? (
                    <div className="flex items-center gap-2 border-t p-4">
                        <Loader className="animate-spin" />
                        <span>Searching...</span>
                    </div>
                ) : status === "error" ? (
                    <div className="flex items-center gap-2 border-t p-4 text-red-500">
                        <XCircle />
                        <span>An error has occurred 😢</span>
                    </div>
                ) : (
                    !!data && (
                        <CommandList className="border-t">
                            {!foundSomething && (
                                <div className="p-4">
                                    <p>Nothing found.</p>
                                </div>
                            )}
                            {hasUsers && (
                                <CommandGroup>
                                    <h3 className="my-2 text-sm uppercase text-muted-foreground">
                                        Users
                                    </h3>
                                    {data.users.map((userView) => {
                                        const user = formatUserInfo(
                                            userView.person,
                                        )
                                        return (
                                            <CommandItem
                                                key={userView.person.id}
                                                onSelect={() => {
                                                    router.push(
                                                        `/${instanceURL}/u/${user.userName}`,
                                                    )
                                                    setOpen(false)
                                                }}
                                                className="cursor-pointer"
                                            >
                                                <div className="flex flex-col">
                                                    <p>{user.displayName}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {user.domain}
                                                    </p>
                                                </div>
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            )}
                            {hasUsers && hasCommunities && <Separator />}
                            {hasCommunities && (
                                <CommandGroup>
                                    <h3 className="my-2 text-sm uppercase text-muted-foreground">
                                        Communities
                                    </h3>
                                    {data.communities.map((communityView) => {
                                        const community = formatCommunityInfo(
                                            communityView.community,
                                        )
                                        return (
                                            <CommandItem
                                                key={communityView.community.id}
                                                onSelect={() => {
                                                    router.push(
                                                        `/${instanceURL}/c/${community.communityName}`,
                                                    )
                                                    setOpen(false)
                                                }}
                                                className="cursor-pointer"
                                            >
                                                <div className="flex flex-col">
                                                    <p>
                                                        {community.displayName}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {community.domain}
                                                    </p>
                                                </div>
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            )}
                        </CommandList>
                    )
                )}
            </CommandDialog>
        </>
    )
}
