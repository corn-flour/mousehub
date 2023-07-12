import { Button } from "@/components/ui/button"
import { type ListingType, type SortType } from "lemmy-js-client"
import Link from "next/link"
import {
    getNextPageParams,
    getPreviousPageParams,
} from "../../app/[instance_url]/search-params-handler"
import { PostLink } from "./post-link"
import SortSelector from "@/components/sort-selector"
import { DEFAULT_SORT_TYPE, ITEM_LIST_SIZE } from "@/config/consts"
import { getCommunity, getPosts, getSite } from "@/services/lemmy"

type PostListProps = {
    instanceURL: string
    jwt?: string
    type?: ListingType
    sort?: SortType
    page?: string
    communityName?: string
}

export const buildURL = (params: Omit<PostListProps, "jwt">) => {
    // post list is in community view
    // generate /:instance_url/c/:community_name?params paths
    if (params.communityName) {
        return {
            prev: `/${params.instanceURL}/c/${
                params.communityName
            }?${getPreviousPageParams({
                sort: params.sort,
                page: params.page,
            }).toString()}`,
            next: `/${params.instanceURL}/c/${
                params.communityName
            }?${getNextPageParams({
                sort: params.sort,
                page: params.page,
            }).toString()}`,
        }
    }

    // post list is in explore view, and specified a type_
    // generate /:instance_url/:type?params paths
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

    // post list is in explore view and is using default type_
    // generate /:instance_url?params paths
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
    sort,
    type,
    page,
}: Omit<PostListProps, "communityName">) => {
    const pageNum = page ? Number(page) : 1

    const siteResponse = await getSite({
        instanceURL,
    })

    const defaultSort =
        siteResponse.data.my_user?.local_user_view.local_user
            .default_sort_type ?? DEFAULT_SORT_TYPE

    const { data: posts } = await getPosts({
        instanceURL,
        input: {
            type_: type,
            sort: sort ?? defaultSort,
            page: pageNum,
            limit: ITEM_LIST_SIZE,
        },
    })

    const { prev, next } = buildURL({
        instanceURL,
        sort,
        type,
        page,
    })

    return (
        <>
            <div>
                <SortSelector initialValue={defaultSort} />
            </div>
            <div className="flex flex-col gap-4">
                {posts.posts.map((post) => (
                    <PostLink
                        key={post.post.id}
                        post={post}
                        instanceURL={instanceURL}
                    />
                ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-4">
                {pageNum > 1 && (
                    <Button asChild variant="outline">
                        <Link href={prev}>Last page</Link>
                    </Button>
                )}

                {/** This doesn't fully fix the button issue, there's a small chance the post list has exactly 20 posts left
                 * in which case it will still display the next page button even though there's nothing there
                 * this will be removed when we move to infinite scrolling
                 */}
                {posts.posts.length === ITEM_LIST_SIZE && (
                    <Button asChild variant="outline">
                        <Link href={next}>Next page</Link>
                    </Button>
                )}
            </div>
        </>
    )
}

export const CommunityPostList = async ({
    instanceURL,
    communityName,
    sort,
    type,
    page,
}: PostListProps & {
    communityName: string
}) => {
    const pageNum = page ? Number(page) : 1

    const siteResponse = await getSite({
        instanceURL,
    })

    const defaultSort =
        siteResponse.data.my_user?.local_user_view.local_user
            .default_sort_type ?? DEFAULT_SORT_TYPE

    const [postsResponse, communityResponse] = await Promise.all([
        getPosts({
            instanceURL,
            input: {
                community_name: decodeURIComponent(communityName),
                type_: type,
                sort: sort ?? defaultSort,
                page: pageNum,
                limit: ITEM_LIST_SIZE,
            },
        }),
        getCommunity({
            instanceURL,
            input: {
                name: decodeURIComponent(communityName),
            },
        }),
    ])

    const community = communityResponse.data
    const posts = postsResponse.data

    const { prev, next } = buildURL({
        instanceURL,
        communityName,
        sort,
        type,
        page,
    })

    return (
        <>
            <div className="flex items-center justify-between">
                {communityName && (
                    <Button asChild>
                        <Link
                            href={`/${instanceURL}/post/new?communityID=${community.community_view.community.id}`}
                        >
                            Create post
                        </Link>
                    </Button>
                )}
                <SortSelector initialValue={defaultSort} />
            </div>
            <div className="flex flex-col gap-4">
                {posts.posts.map((post) => (
                    <PostLink
                        key={post.post.id}
                        post={post}
                        instanceURL={instanceURL}
                    />
                ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-4">
                {pageNum > 1 && (
                    <Button asChild variant="outline">
                        <Link href={prev}>Last page</Link>
                    </Button>
                )}

                {/** This doesn't fully fix the button issue, there's a small chance the post list has exactly 20 posts left
                 * in which case it will still display the next page button even though there's nothing there
                 * this will be removed when we move to infinite scrolling
                 */}
                {posts.posts.length === ITEM_LIST_SIZE && (
                    <Button asChild variant="outline">
                        <Link href={next}>Next page</Link>
                    </Button>
                )}
            </div>
        </>
    )
}
