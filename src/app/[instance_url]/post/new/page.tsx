import { PostForm } from "@/components/posts/postform"
import { getCommunity } from "@/services/lemmy"

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
    const communityID = searchParams.communityID

    const { data: communityResponse } = await getCommunity({
        instanceURL: params.instance_url,
        input: {
            id: communityID ? Number(communityID) : undefined,
        },
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
