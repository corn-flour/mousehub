import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const PostSkeleton = ({ opacity }: { opacity: number }) => {
    return (
        <Card
            className={cn(
                "animate-pulse",
                opacity === 1
                    ? "opacity-100"
                    : opacity === 2
                    ? "opacity-80"
                    : opacity === 3
                    ? "opacity-40"
                    : opacity === 4
                    ? "opacity-20"
                    : "opacity-10",
            )}
        >
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4" />
                <Skeleton className="h-4 w-[500px] max-w-full" />
            </CardContent>
        </Card>
    )
}

export const PostListSkeleton = () => {
    return (
        <div className="space-y-4">
            <PostSkeleton opacity={1} />
            <PostSkeleton opacity={2} />
            <PostSkeleton opacity={3} />
            <PostSkeleton opacity={4} />
            <PostSkeleton opacity={5} />
        </div>
    )
}
