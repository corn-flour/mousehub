import { Suspense } from "react"
import { PostList } from "../postlist"
import { type ExploreSearchParams } from "../search-params-handler"
import SortSelector from "./sort-selector"
import { PostListSkeleton } from "../post-skeleton"

type PostListProps = {
    params: {
        instance_url: string
    }
    searchParams: ExploreSearchParams
}

const DefaultExploreView = ({ params, searchParams }: PostListProps) => {
    const { sort, page } = searchParams
    return (
        <>
            <SortSelector />
            <Suspense fallback={<PostListSkeleton />} key={JSON.stringify(searchParams)}>
                <PostList
                    instanceURL={params.instance_url}
                    sort={sort}
                    page={page}
                />
            </Suspense>
        </>
    )
}

export default DefaultExploreView
