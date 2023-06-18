import { PostItem } from "@/components/post"
import { Button } from "@/components/ui/button"
import { LemmyHttp } from "lemmy-js-client"
import Link from "next/link"
import {
    getPreviousPageParams,
    type ExploreSearchParams,
    getNextPageParams,
} from "./search-params-handler"

type PostListProps = {
    params: {
        instance_url: string
    }
    searchParams: ExploreSearchParams
}

const PostList = async ({ params, searchParams }: PostListProps) => {
    const { sort, page } = searchParams

    const pageNum = page ? Number(page) : 1

    const lemmyClient = new LemmyHttp(`https://${params.instance_url}`)
    const posts = await lemmyClient.getPosts({
        sort,
        page: pageNum,
    })

    return (
        <>
            <div className="flex flex-col gap-4">
                {posts.posts.map((post) => (
                    <PostItem
                        key={post.post.id}
                        post={post}
                        instanceURL={params.instance_url}
                        isExplorePost
                    />
                ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-4">
                {pageNum > 1 && (
                    <Button asChild variant="outline">
                        <Link
                            href={`/${
                                params.instance_url
                            }?${getPreviousPageParams(
                                searchParams,
                            ).toString()}`}
                        >
                            Last page
                        </Link>
                    </Button>
                )}
                <Button asChild variant="outline">
                    <Link
                        href={`/${params.instance_url}?${getNextPageParams(
                            searchParams,
                        ).toString()}`}
                    >
                        Next page
                    </Link>
                </Button>
            </div>
        </>
    )
}

export default PostList
