import { Loader } from "lucide-react"
import { Separator } from "../ui/separator"

export const CommentLoader = () => {
    return (
        <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <Loader className="animate-spin text-muted-foreground" />
            <Separator className="flex-1" />
        </div>
    )
}
