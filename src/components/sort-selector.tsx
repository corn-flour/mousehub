"use client"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { type SortType } from "lemmy-js-client"
import { useSearchParams } from "next/navigation"
import { useRef } from "react"

const sortOptions = [
    {
        value: "Hot",
        label: "Hot",
    },
    {
        value: "Active",
        label: "Active",
    },
    {
        value: "New",
        label: "New",
    },
    {
        value: "TopDay",
        label: "Top of day",
    },
    {
        value: "TopWeek",
        label: "Top of week",
    },
    {
        value: "TopMonth",
        label: "Top of month",
    },
    {
        value: "TopYear",
        label: "Top of year",
    },
]

const SortSelector = ({ initialValue }: { initialValue: SortType }) => {
    const searchParams = useSearchParams()
    const sortOption = searchParams.get("sort") ?? initialValue
    const formRef = useRef<HTMLFormElement>(null)

    return (
        <form ref={formRef} className="flex justify-end">
            <label className="inline-flex items-center gap-2">
                <span className="flex-1">Sort by:</span>
                <Select
                    name="sort"
                    defaultValue={sortOption}
                    onValueChange={() => {
                        formRef && formRef.current?.submit()
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select sort option" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {sortOptions.map(({ label, value }) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </label>
        </form>
    )
}

export default SortSelector
