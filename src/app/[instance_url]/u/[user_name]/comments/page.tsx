import { Button } from "@/components/ui/button"
import { type SortType } from "lemmy-js-client"
import Link from "next/link"
import {
    type ExploreSearchParams,
    getNextPageParams,
    getPreviousPageParams,
} from "../../../search-params-handler"
import { Suspense } from "react"
import { PostListSkeleton } from "../../../post-skeleton"
import SortSelector from "@/components/sort-selector"
import CommentLink from "@/components/comments/comment-link"
import { ITEM_LIST_SIZE } from "@/config/consts"
import { getUser } from "@/services/lemmy"

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
        }/comments?${getPreviousPageParams({
            sort: params.sort,
            page: params.page,
        }).toString()}`,
        next: `/${params.instanceURL}/u/${
            params.userName
        }/comments?${getNextPageParams({
            sort: params.sort,
            page: params.page,
        }).toString()}`,
    }
}

const UserComments = async ({
    instanceURL,
    userName: rawUserName,
    sort,
    page,
}: UserPageParams) => {
    const userName = decodeURIComponent(rawUserName)
    const pageNum = page ? Number(page) : 1

    const { data: userInfo } = await getUser({
        instanceURL,
        input: {
            username: userName,
            sort: sort ?? "New",
            page: pageNum,
            limit: ITEM_LIST_SIZE,
        },
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
                {userInfo.comments.map((comment) => (
                    <CommentLink
                        instanceURL={instanceURL}
                        comment={comment}
                        key={comment.comment.id}
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
                {userInfo.comments.length === ITEM_LIST_SIZE && (
                    <Button asChild variant="outline">
                        <Link href={next}>Next page</Link>
                    </Button>
                )}
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
                <UserComments
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
