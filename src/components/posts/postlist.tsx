import { Button } from "@/components/ui/button"
import { type ListingType, type SortType } from "lemmy-js-client"
import Link from "next/link"
import {
    getNextPageParams,
    getPreviousPageParams,
} from "../../app/[instance_url]/search-params-handler"
import { PostLink } from "./post-link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createLemmyClient } from "@/lib/lemmy"

type PostListProps = {
    instanceURL: string
    communityName?: string
    jwt?: string
    type?: ListingType
    sort?: SortType
    page?: string
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
    communityName,
    sort,
    type,
    page,
}: PostListProps) => {
    const session = await getServerSession(authOptions)

    const pageNum = page ? Number(page) : 1

    const lemmyClient = createLemmyClient(instanceURL)
    const posts = await lemmyClient.getPosts({
        community_name: communityName && decodeURIComponent(communityName),
        auth: session?.accessToken,
        type_: type,
        sort,
        page: pageNum,
    })

    const { prev, next } = buildURL({
        instanceURL,
        communityName,
        sort,
        type,
        page,
    })

    return (
        <>
            <Button asChild>
                <Link
                    href={`/${instanceURL}/post/new?communityID=${posts.posts[0].community.id}`}
                >
                    Create post
                </Link>
            </Button>
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
                <Button asChild variant="outline">
                    <Link href={next}>Next page</Link>
                </Button>
            </div>
        </>
    )
}
