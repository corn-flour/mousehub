import { type ExploreSearchParams } from "@/app/[instance_url]/search-params-handler"
import { PostList } from "../postlist"

type PostListProps = {
    params: {
        instance_url: string
    }
    searchParams: ExploreSearchParams
}

const ExploreAllView = ({ params, searchParams }: PostListProps) => {
    const { sort, page } = searchParams

    return (
        <PostList
            instanceURL={params.instance_url}
            sort={sort}
            page={page}
            type="All"
        />
    )
}

export default ExploreAllView
