import { Suspense } from "react"
import { PostList } from "../../../components/posts/postlist"
import { type ExploreSearchParams } from "../search-params-handler"
import SortSelector from "./sort-selector"
import { PostListSkeleton } from "../post-skeleton"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

type PostListProps = {
    params: {
        instance_url: string
    }
    searchParams: ExploreSearchParams
}

const DefaultExploreView = async ({ params, searchParams }: PostListProps) => {
    const session = await getServerSession(authOptions)

    // redirect to the local list if the user is not logged in
    if (!session) {
        redirect(`/${params.instance_url}/local`)
    }

    const { sort, page } = searchParams
    return (
        <>
            <SortSelector />
            <Suspense
                fallback={<PostListSkeleton />}
                key={JSON.stringify(searchParams)}
            >
                <PostList
                    instanceURL={params.instance_url}
                    sort={sort}
                    page={page}
                    type="Subscribed"
                />
            </Suspense>
        </>
    )
}

export default DefaultExploreView
