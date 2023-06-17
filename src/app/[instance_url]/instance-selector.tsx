"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { usePathname, useRouter } from 'next/navigation'

// Cmdk renders every item in the list all the time
// We may revisit this and introduce custom filter if this has perf issue
const InstanceSelector = ({data} : {
    data: {
        value: string
        label: string
    }[]
}) => {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const currentInstance = pathname.split('/')[1]
    
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {currentInstance
                        ? data.find(
                              (instance) => instance.value === currentInstance,
                          )?.label
                        : "Select instance..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search instance..." />
                    <CommandEmpty>No instance found.</CommandEmpty>
                    <CommandGroup className="max-h-96 overflow-y-scroll">
                        {data.map((entry) => (
                            <CommandItem
                                key={entry.value}
                                onSelect={() => {
                                    const pathSplitted = pathname.split('/')
                                    pathSplitted[1] = entry.value
                                    router.push(pathSplitted.join('/'))
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        currentInstance === entry.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                    )}
                                />
                                {entry.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default InstanceSelector
