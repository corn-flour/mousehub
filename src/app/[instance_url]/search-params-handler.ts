import { type SortType } from "lemmy-js-client"

// the items in the search params of any "explore" page
export type ExploreSearchParams = {
    sort: SortType
    page: string
}

// return the search params for changing sort type
// after changing sort type, the list will go to the first page
export const setSortType = (
    searchParams: ExploreSearchParams,
    sortType: SortType,
) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete("page")
    newParams.set("sort", sortType)
    return newParams
}
// return the search params of the previous page
export const getNextPageParams = (searchParams: ExploreSearchParams) => {
    const pageNum = searchParams.page ? Number(searchParams.page) : 1
    return new URLSearchParams({
        ...searchParams,
        page: String(pageNum + 1),
    })
}

// return the search params of the next page
export const getPreviousPageParams = (searchParams: ExploreSearchParams) => {
    const pageNum = searchParams.page ? Number(searchParams.page) : 1
    return new URLSearchParams({
        ...searchParams,
        page: String(pageNum - 1),
    })
}
