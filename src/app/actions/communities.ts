"use server"
import { followCommunity } from "@/services/lemmy"

export const updateCommunitySubscription = async (props: {
    instanceURL: string
    communityID: number
    type: "subscribe" | "unsubscribe"
}) => {
    const subscriptionResponse = await followCommunity({
        instanceURL: props.instanceURL,
        input: {
            community_id: props.communityID,
            follow: props.type === "subscribe",
        },
    })

    return subscriptionResponse
}
