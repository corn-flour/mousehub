"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { createLemmyClient } from "@/lib/lemmy"

export const updateCommunitySubscription = async (props: {
    instanceURL: string
    communityID: number
    type: "subscribe" | "unsubscribe"
}) => {
    const session = await getServerSession(authOptions)
    if (!session) {
        throw new Error("Unauthorized")
    }

    const lemmyClient = createLemmyClient(props.instanceURL)
    const subscriptionResponse = await lemmyClient.followCommunity({
        community_id: props.communityID,
        auth: session.accessToken,
        follow: props.type === "subscribe",
    })

    return subscriptionResponse
}
