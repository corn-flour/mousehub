import { type ExploreSearchParams } from "@/app/[instance_url]/search-params-handler"
import { PostList } from "../postlist"

type PostListProps = {
    params: {
        instance_url: string
    }
    searchParams: ExploreSearchParams
}

const ExploreLocalView = ({ params, searchParams }: PostListProps) => {
    const { sort, page } = searchParams

    return (
        <PostList
            instanceURL={params.instance_url}
            sort={sort}
            page={page}
            type="Local"
        />
    )
}

export default ExploreLocalView