import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { Check, ChevronsUpDown, Loader } from "lucide-react"
import { Command, CommandGroup, CommandInput, CommandItem } from "./ui/command"
import { cn } from "@/lib/utils"
import { type SearchResponse } from "lemmy-js-client"

import { useDebounce } from "use-debounce"
import { FormControl } from "./ui/form"
import { formatCommunityInfo } from "@/lib/lemmy"

type CommunitySelectorValue = {
    id: number
    name: string
    icon?: string
}

//! This can ONLY be called by a client component, since it needs an onChange event handler
export const CommunitySelector = (props: {
    value: CommunitySelectorValue
    onChange: (v: CommunitySelectorValue) => void
    isInForm?: boolean
}) => {
    const params = useParams()
    const [searchQuery, setSearchQuery] = useState("")

    const [debouncedQuery] = useDebounce(searchQuery, 300)

    const instanceURL = params["instance_url"]

    const { data, status } = useQuery({
        queryFn: async ({ queryKey }) => {
            // user doesn't pass in any queryKey, just return
            if (!queryKey[1]) return []

            const queryParams = new URLSearchParams({
                query: queryKey[1],
                instanceURL: instanceURL,
                type: "Communities",
                limit: "10",
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
            return searchResponse.communities
        },
        queryKey: ["search", debouncedQuery],
    })

    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            {props.isInForm ? (
                <FormControl>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[250px] justify-between overflow-hidden"
                        >
                            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">
                                {props.value.name
                                    ? props.value.name
                                    : "Select Community"}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                </FormControl>
            ) : (
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[250px] justify-between"
                    >
                        {props.value ? props.value.name : "Select Community"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
            )}
            <PopoverContent className="w-[250px] p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search community..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                    {status === "error" ? (
                        <p className="text-destructive">
                            An error has occurred while trying to fetch
                            communities
                        </p>
                    ) : status === "loading" ? (
                        <div className="flex items-center justify-center py-2">
                            <Loader className="animate-spin" />
                        </div>
                    ) : !data?.length ? (
                        <div className="px-4 py-2 text-sm">
                            No community found
                        </div>
                    ) : (
                        !!data && (
                            <CommandGroup>
                                {data.map((communityView) => {
                                    const community = formatCommunityInfo(
                                        communityView.community,
                                    )
                                    return (
                                        <CommandItem
                                            key={communityView.community.id}
                                            onSelect={() => {
                                                props.onChange({
                                                    id: community.id,
                                                    name: community.displayName,
                                                    icon: community.icon,
                                                })
                                                setOpen(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    props.value.id ===
                                                        community.id
                                                        ? "opacity-100"
                                                        : "opacity-0",
                                                )}
                                            />
                                            <div className="flex flex-col overflow-hidden">
                                                <p className="overflow-hidden text-ellipsis whitespace-nowrap">
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
                        )
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    )
}
