import { PostForm } from "@/components/posts/postform"

const CreatePostPage = ({
    searchParams,
}: {
    searchParams: {
        communityID?: string
    }
}) => {
    return (
        <div>
            <PostForm
                initialCommunityID={
                    searchParams.communityID
                        ? Number(searchParams.communityID)
                        : undefined
                }
            />
        </div>
    )
}

export default CreatePostPage
