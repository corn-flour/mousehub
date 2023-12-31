"use client"

import { updateCommunitySubscription } from "@/app/actions/communities"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { type SubscribedType } from "lemmy-js-client"
import { Check, Loader } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export const ServerSubscriptionButton = (props: {
    communityID: number
    userSubscription: SubscribedType
}) => {
    const { communityID, userSubscription } = props
    const [loading, setLoading] = useState(false)
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()

    const handleSubscribe = async () => {
        setLoading(true)

        const response = await updateCommunitySubscription({
            instanceURL: params["instance_url"],
            communityID,
            type:
                userSubscription === "NotSubscribed"
                    ? "subscribe"
                    : "unsubscribe",
        })

        if (response.status === "success") {
            router.refresh()
        } else {
            toast({
                description:
                    userSubscription === "NotSubscribed"
                        ? "Failed to subscribe to community"
                        : "Failed to unsubscribe from community",
                variant: "destructive",
            })
        }
        setLoading(false)
    }

    return (
        <Button
            onClick={() => handleSubscribe()}
            type="button"
            className={cn(
                "group w-32 gap-2 bg-primary/10 text-primary",
                userSubscription === "NotSubscribed" && "hover:bg-primary/20",
                userSubscription === "Pending" &&
                    "bg-yellow-600 text-white hover:bg-destructive hover:text-destructive-foreground",
                userSubscription === "Subscribed" &&
                    "hover:bg-destructive hover:text-destructive-foreground",
            )}
        >
            {loading ? (
                <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Loading</span>
                </>
            ) : userSubscription === "Subscribed" ? (
                <>
                    <Check className="h-5 w-5 group-hover:hidden" />
                    <span className="group-hover:hidden">Subscribed</span>
                    <span className="hidden group-hover:block">
                        Unsubscribe
                    </span>
                </>
            ) : userSubscription === "NotSubscribed" ? (
                <>
                    <span>Subscribe</span>
                </>
            ) : (
                <>
                    <span className="group-hover:hidden">Pending</span>
                    <span className="hidden group-hover:block">
                        Unsubscribe
                    </span>
                </>
            )}
        </Button>
    )
}
