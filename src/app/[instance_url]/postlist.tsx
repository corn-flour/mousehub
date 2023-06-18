import { PostItem } from "@/components/post"
import { Button } from "@/components/ui/button"
import { LemmyHttp, type ListingType, type SortType } from "lemmy-js-client"
import Link from "next/link"
import {
    getNextPageParams,
    getPreviousPageParams,
} from "./search-params-handler"

type PostListProps = {
    instanceURL: string
    jwt?: string
    type?: ListingType
    sort?: SortType
    page?: string
}

const buildURL = (params: Omit<PostListProps, "jwt">) => {
    if (params.type) {
        return {
            prev: `/${
                params.instanceURL
            }/${params.type.toLowerCase()}?${getPreviousPageParams({
                sort: params.sort,
                page: params.page,
            }).toString()}`,
            next: `/${
                params.instanceURL
            }/${params.type.toLowerCase()}?${getNextPageParams({
                sort: params.sort,
                page: params.page,
            }).toString()}`,
        }
    }
    return {
        prev: `/${params.instanceURL}?${getPreviousPageParams({
            sort: params.sort,
            page: params.page,
        }).toString()}`,
        next: `/${params.instanceURL}?${getNextPageParams({
            sort: params.sort,
            page: params.page,
        }).toString()}`,
    }
}

export const PostList = async ({
    instanceURL,
    jwt,
    sort,
    type,
    page,
}: PostListProps) => {
    const pageNum = page ? Number(page) : 1

    const lemmyClient = new LemmyHttp(`https://${instanceURL}`)
    const posts = await lemmyClient.getPosts({
        auth: jwt,
        type_: type,
        sort,
        page: pageNum,
    })

    const { prev, next } = buildURL({
        instanceURL,
        sort,
        type,
        page,
    })

    return (
        <>
            <div className="flex flex-col gap-4">
                {posts.posts.map((post) => (
                    <PostItem
                        key={post.post.id}
                        post={post}
                        instanceURL={instanceURL}
                        isExplorePost
                    />
                ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-4">
                {pageNum > 1 && (
                    <Button asChild variant="outline">
                        <Link href={prev}>Last page</Link>
                    </Button>
                )}
                <Button asChild variant="outline">
                    <Link href={next}>Next page</Link>
                </Button>
            </div>
        </>
    )
}
