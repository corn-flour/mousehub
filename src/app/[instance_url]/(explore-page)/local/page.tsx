import { type ExploreSearchParams } from "@/app/[instance_url]/search-params-handler"
import { PostList } from "../../postlist"
import SortSelector from "../sort-selector"
import { Suspense } from "react"
import { PostListSkeleton } from "../../post-skeleton"

type PostListProps = {
    params: {
        instance_url: string
    }
    searchParams: ExploreSearchParams
}

const ExploreLocalView = ({ params, searchParams }: PostListProps) => {
    const { sort, page } = searchParams

    return (
        <>
            <SortSelector />
            <Suspense fallback={<PostListSkeleton />}>
                <PostList
                    instanceURL={params.instance_url}
                    sort={sort}
                    page={page}
                    type="Local"
                />
            </Suspense>
        </>
    )
}

export default ExploreLocalView
