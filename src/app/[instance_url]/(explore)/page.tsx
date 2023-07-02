import { Suspense } from "react"
import { PostList } from "../../../components/posts/postlist"
import { type ExploreSearchParams } from "../search-params-handler"
import SortSelector from "./sort-selector"
import { PostListSkeleton } from "../post-skeleton"
import { TestAccountProviders } from "../test-accounts-provider"

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
            <TestAccountProviders />
            <SortSelector />
            <Suspense
                fallback={<PostListSkeleton />}
                key={JSON.stringify(searchParams)}
            >
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
