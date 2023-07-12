import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type {
    CommentResponse,
    CommunityResponse,
    CreateComment,
    CreateCommentLike,
    CreatePost,
    CreatePostLike,
    FollowCommunity,
    GetComment,
    GetComments,
    GetCommunity,
    GetPersonDetails,
    GetPost,
    GetPosts,
    PostResponse,
} from "lemmy-js-client"
import { LemmyHttp } from "lemmy-js-client"
import { getServerSession } from "next-auth"

type ServiceProp<T> = {
    instanceURL: string
    opt?: RequestInit
    input: Omit<T, "auth">
}

type ServiceResponse<T> =
    | {
          status: "success"
          data: T
      }
    | {
          status: "error"
          code: number
          message: string
      }

type PostService<TInput, TOutput> = (
    props: ServiceProp<TInput>,
) => Promise<ServiceResponse<TOutput>>

const initService = async (props: {
    instanceURL: string
    // fetch option passed from service consumers
    opt?: RequestInit

    // default service fetch option, used if consumer option isn't specified
    defaultOpt?: RequestInit
}) => {
    const { instanceURL, opt, defaultOpt } = props

    // if neither option is passed, default to no fetch cache
    const fetchOptions: RequestInit = {
        next: {
            revalidate: 0,
        },
        ...defaultOpt,
        ...opt,
    }

    const session = await getServerSession(authOptions)

    // passing the fetch function that next.js overrides so that we might actually use the cache feature
    // currently doesn't cache anything because revalidating is rough D:
    return {
        client: new LemmyHttp(`https://${instanceURL}`, {
            fetchFunction: (input, init) =>
                fetch(input, {
                    ...init,
                    ...fetchOptions,
                }),
        }),
        session,
    }
}

// method wrapper for lemmyClient.getSite
// by default, the result is cached for 1hr since this data don't change often
export const getSite = async (props: {
    instanceURL: string
    opt?: RequestInit
}) => {
    const { instanceURL, opt } = props

    const { client, session } = await initService({
        instanceURL,
        opt,
        defaultOpt: {
            next: {
                revalidate: 3600,
            },
        },
    })

    const siteData = await client.getSite({
        auth: session?.accessToken,
    })

    return {
        authed: !!session,
        data: siteData,
    }
}

export const getCommunity = async (props: ServiceProp<GetCommunity>) => {
    const { input, ...rest } = props
    const { client, session } = await initService(rest)
    const response = await client.getCommunity({
        ...input,
        auth: session?.accessToken,
    })

    return {
        authed: !!session,
        data: response,
    }
}

export const getPosts = async (props: ServiceProp<GetPosts>) => {
    const { input, ...rest } = props
    const { client, session } = await initService(rest)
    const response = await client.getPosts({
        ...input,
        auth: session?.accessToken,
    })

    return {
        authed: !!session,
        data: response,
    }
}

export const getPost = async (props: ServiceProp<GetPost>) => {
    const { input, ...rest } = props
    const { client, session } = await initService(rest)
    const response = await client.getPost({
        ...input,
        auth: session?.accessToken,
    })

    return {
        authed: !!session,
        data: response,
    }
}

export const getComments = async (props: ServiceProp<GetComments>) => {
    const { input, ...rest } = props
    const { client, session } = await initService(rest)
    const response = await client.getComments({
        ...input,
        auth: session?.accessToken,
    })
    return {
        authed: !!session,
        data: response,
    }
}

export const getUser = async (props: ServiceProp<GetPersonDetails>) => {
    const { input, ...rest } = props
    const { client, session } = await initService(rest)
    const response = await client.getPersonDetails({
        ...input,
        auth: session?.accessToken,
    })

    return {
        authed: !!session,
        data: response,
    }
}

export const getComment = async (props: ServiceProp<GetComment>) => {
    const { input, ...rest } = props
    const { client, session } = await initService(rest)
    const response = await client.getComment({
        ...input,
        auth: session?.accessToken,
    })
    return {
        authed: !!session,
        data: response,
    }
}

export const createPost: PostService<CreatePost, PostResponse> = async (
    props,
) => {
    try {
        const { input, ...rest } = props
        const { client, session } = await initService(rest)

        if (!session) {
            return {
                status: "error",
                code: 401,
                message: "User not signed in",
            }
        }
        const response = await client.createPost({
            ...input,
            auth: session.accessToken,
        })
        return {
            status: "success",
            data: response,
        }
    } catch (e) {
        return {
            status: "error",
            code: 500,
            message: JSON.stringify(e),
        }
    }
}

export const createComment: PostService<
    CreateComment,
    CommentResponse
> = async (props) => {
    try {
        const { input, ...rest } = props
        const { client, session } = await initService(rest)

        if (!session) {
            return {
                status: "error",
                code: 401,
                message: "User not signed in",
            }
        }
        const response = await client.createComment({
            ...input,
            auth: session.accessToken,
        })
        return {
            status: "success",
            data: response,
        }
    } catch (e) {
        return {
            status: "error",
            code: 500,
            message: JSON.stringify(e),
        }
    }
}

export const followCommunity: PostService<
    FollowCommunity,
    CommunityResponse
> = async (props) => {
    try {
        const { input, ...rest } = props
        const { client, session } = await initService(rest)

        if (!session) {
            return {
                status: "error",
                code: 401,
                message: "User not signed in",
            }
        }
        const response = await client.followCommunity({
            ...input,
            auth: session.accessToken,
        })
        return {
            status: "success",
            data: response,
        }
    } catch (e) {
        return {
            status: "error",
            code: 500,
            message: JSON.stringify(e),
        }
    }
}

export const likePost: PostService<CreatePostLike, PostResponse> = async (
    props,
) => {
    try {
        const { input, ...rest } = props
        const { client, session } = await initService(rest)

        if (!session) {
            return {
                status: "error",
                code: 401,
                message: "User not signed in",
            }
        }
        const response = await client.likePost({
            ...input,
            auth: session.accessToken,
        })
        return {
            status: "success",
            data: response,
        }
    } catch (e) {
        return {
            status: "error",
            code: 500,
            message: JSON.stringify(e),
        }
    }
}

export const likeComment: PostService<
    CreateCommentLike,
    CommentResponse
> = async (props) => {
    try {
        const { input, ...rest } = props
        const { client, session } = await initService(rest)

        if (!session) {
            return {
                status: "error",
                code: 401,
                message: "User not signed in",
            }
        }
        const response = await client.likeComment({
            ...input,
            auth: session.accessToken,
        })
        return {
            status: "success",
            data: response,
        }
    } catch (e) {
        return {
            status: "error",
            code: 500,
            message: JSON.stringify(e),
        }
    }
}
