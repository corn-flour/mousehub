import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PostForm } from "@/components/posts/postform"
import { createLemmyClient } from "@/lib/lemmy"
import { getServerSession } from "next-auth"

const CreatePostPage = async ({
    params,
    searchParams,
}: {
    params: {
        instance_url: string
    }
    searchParams: {
        communityID?: string
    }
}) => {
    const session = await getServerSession(authOptions)
    const lemmyClient = createLemmyClient(params.instance_url)

    const communityID = searchParams.communityID
    const communityResponse = await lemmyClient.getCommunity({
        id: communityID ? Number(communityID) : undefined,
        auth: session?.accessToken,
    })

    return (
        <div>
            <PostForm
                initialCommunity={communityResponse.community_view.community}
            />
        </div>
    )
}

export default CreatePostPage
