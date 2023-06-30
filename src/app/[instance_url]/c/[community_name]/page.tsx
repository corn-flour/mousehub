import { Suspense } from "react"
import { PostListSkeleton } from "../../post-skeleton"
import { PostList } from "../../postlist"
import SortSelector from "../../(explore)/sort-selector"
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
            <SortSelector />
            <Suspense fallback={<PostListSkeleton />}>
                <PostList
                    instanceURL={params.instance_url}
                    communityName={params.community_name}
                    sort={sort}
                    page={page}
                />
            </Suspense>
        </>
    )
}

export default CommunityView
