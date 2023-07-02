import { Bot, Globe, Mic, Shield } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export const OriginalPosterIcon = () => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button>
                    <Mic
                        className="h-4 w-4 text-blue-700 dark:text-blue-400"
                        aria-label="Original poster icon"
                    />
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <p>This user is the original poster</p>
            </TooltipContent>
        </Tooltip>
    )
}

export const ModIcon = () => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button>
                    <Shield
                        className="h-4 w-4 text-green-700 dark:text-green-400"
                        aria-label="Moderator icon"
                    />
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <p>This user is a moderator of this community</p>
            </TooltipContent>
        </Tooltip>
    )
}

export const AdminIcon = () => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button>
                    <Globe
                        className="h-4 w-4 text-red-600 dark:text-red-400"
                        aria-label="Admin icon"
                    />
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <p>This user is an administrator of this Lemmy instance.</p>
            </TooltipContent>
        </Tooltip>
    )
}

export const BotIcon = () => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button>
                    <Bot className="h-4 w-4" aria-label="Bot icon" />
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <p>This user is a bot account.</p>
            </TooltipContent>
        </Tooltip>
    )
}
