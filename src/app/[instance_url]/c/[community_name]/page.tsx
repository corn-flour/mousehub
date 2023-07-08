import { Suspense } from "react"
import { PostListSkeleton } from "../../post-skeleton"
import { PostList } from "../../../../components/posts/postlist"
import { type ExploreSearchParams } from "../../search-params-handler"

const CommunityView = ({
    params,
    searchParams,
}: {
    params: {
        instance_url: string
        community_name: string
    }
    searchParams: ExploreSearchParams
}) => {
    const { sort, page } = searchParams
    return (
        <>
            <Suspense
                fallback={<PostListSkeleton />}
                key={JSON.stringify(searchParams)}
            >
                <PostList
                    instanceURL={params.instance_url}
                    communityName={params.community_name}
                    type="All"
                    sort={sort}
                    page={page}
                />
            </Suspense>
        </>
    )
}

export default CommunityView
