import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { Check, ChevronsUpDown, Loader } from "lucide-react"
import { Command, CommandGroup, CommandInput, CommandItem } from "./ui/command"
import { cn } from "@/lib/utils"
import { type CommunityView } from "lemmy-js-client"

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
            // this fetch doesn't always need to be the most up to date
            // cache for 1 hour before revalidating
            const response = await fetch(
                `/api/search?query=${queryKey[1]}&instanceURL=${instanceURL}`,
                {
                    next: {
                        revalidate: 3600,
                    },
                },
            )
            const communities = (await response.json()) as CommunityView[]
            return communities
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
                            className="w-[200px] justify-between"
                        >
                            {props.value
                                ? props.value.name
                                : "Select Community"}
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
                        className="w-[200px] justify-between"
                    >
                        {props.value ? props.value.name : "Select Community"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
            )}
            <PopoverContent className="w-[200px] p-0">
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
                    ) : !data.length ? (
                        <div className="px-4 py-2 text-sm">
                            No community found
                        </div>
                    ) : (
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
                                                props.value.id === community.id
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                            )}
                                        />
                                        <div className="flex flex-col">
                                            <p>{community.displayName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {community.domain}
                                            </p>
                                        </div>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    )
}
