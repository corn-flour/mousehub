import { Button } from "@/components/ui/button"
import { type SortType } from "lemmy-js-client"
import Link from "next/link"
import {
    type ExploreSearchParams,
    getNextPageParams,
    getPreviousPageParams,
} from "../../search-params-handler"
import { Suspense } from "react"
import { PostListSkeleton } from "../../post-skeleton"
import SortSelector from "../../(explore)/sort-selector"
import { PostLink } from "@/components/posts/post-link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createLemmyClient } from "@/lib/lemmy"

type UserPageParams = {
    instanceURL: string
    userName: string
    sort?: SortType
    page?: string
}

const buildURL = (params: UserPageParams) => {
    // post list is in user view
    // generate /:instance_url/u/:user_name?params
    return {
        prev: `/${params.instanceURL}/u/${
            params.userName
        }?${getPreviousPageParams({
            sort: params.sort,
            page: params.page,
        }).toString()}`,
        next: `/${params.instanceURL}/u/${params.userName}?${getNextPageParams({
            sort: params.sort,
            page: params.page,
        }).toString()}`,
    }
}

const UserPosts = async ({
    instanceURL,
    userName: rawUserName,
    sort,
    page,
}: UserPageParams) => {
    const session = await getServerSession(authOptions)
    const userName = decodeURIComponent(rawUserName)
    const lemmyClient = createLemmyClient(instanceURL)
    const pageNum = page ? Number(page) : 1
    const userInfo = await lemmyClient.getPersonDetails({
        username: userName,
        sort,
        page: pageNum,
        auth: session?.accessToken,
    })

    const { prev, next } = buildURL({
        instanceURL,
        userName,
        sort,
        page,
    })

    return (
        <>
            <div className="flex flex-col gap-4">
                {userInfo.posts.map((post) => (
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

const UserView = ({
    params,
    searchParams,
}: {
    params: {
        user_name: string
        instance_url: string
    }
    searchParams: ExploreSearchParams
}) => {
    return (
        <>
            <SortSelector />
            <Suspense
                fallback={<PostListSkeleton />}
                key={JSON.stringify(searchParams)}
            >
                <UserPosts
                    instanceURL={params.instance_url}
                    userName={params.user_name}
                    sort={searchParams.sort}
                    page={searchParams.page}
                />
            </Suspense>
        </>
    )
}

export default UserView
