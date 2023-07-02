import { formatTimeAgo } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export const TimeTooltip = ({ time }: { time: string }) => {
    const date = new Date(time + "Z")

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button className="text-sm text-muted-foreground">
                    {formatTimeAgo(date)}
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Created at {date.toLocaleString()}</p>
            </TooltipContent>
        </Tooltip>
    )
}
