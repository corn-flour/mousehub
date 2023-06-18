import { type ExploreSearchParams } from "./search-params-handler"
import { PostList } from "./postlist"

type PostListProps = {
    params: {
        instance_url: string
    }
    searchParams: ExploreSearchParams
}

const DefaultExploreView = ({ params, searchParams }: PostListProps) => {
    const { sort, page } = searchParams
    return (
        <PostList instanceURL={params.instance_url} sort={sort} page={page} />
    )
}

export default DefaultExploreView
