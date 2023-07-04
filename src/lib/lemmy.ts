import {
    type CommunityModeratorView,
    type Comment,
    type CommentView,
    type Community,
    type Person,
    LemmyHttp,
} from "lemmy-js-client"

export const createLemmyClient = (instanceURL: string) => {
    // passing the fetch function that next.js overrides so that we can actually use the cache feature
    // revalidate cache every 60 seconds
    return new LemmyHttp(`https://${instanceURL}`, {
        fetchFunction: (input, init) =>
            fetch(input, {
                ...init,
                next: {
                    revalidate: 60,
                },
            }),
    })
}

export const formatUserInfo = (user: Person) => {
    // regex to extract domain name from URL. This is to get the instance domain of the user
    const match = /^(?:https?:\/\/)?([^\/\r\n]+)/.exec(user.actor_id)
    const domain = match ? match[1] : "" // This should never fail considering the domain is taken from the API directly
    const userName = user.local ? user.name : `${user.name}@${domain}`
    const displayName = user.display_name ?? user.name
    return {
        userName,
        displayName,
    }
}

export const formatCommunityInfo = (community: Community) => {
    const match = /^(?:https?:\/\/)?([^\/\r\n]+)/.exec(community.actor_id)
    const domain = match ? match[1] : "" // This should never fail considering the domain is taken from the API directly
    const communityName = community.local
        ? community.name
        : `${community.name}@${domain}`

    return {
        communityName,
    }
}

export type CommentNode = {
    comment_view: CommentView
    children: CommentNode[]
    depth: number
    creator: {
        isModerator: boolean
        isAdmin: boolean
        isBot: boolean
        isOriginalPoster: boolean
    }
}

// get the depth of the comment
const getDepthFromComment = (comment: Comment) => {
    const length = comment.path.split(".").length
    return length ? length - 2 : undefined
}

// get the ID of the parent of a given comment
const getCommentParentId = (comment?: Comment): number | undefined => {
    const split = comment?.path.split(".")
    // remove the 0
    split?.shift()

    return split && split.length > 1
        ? Number(split.at(split.length - 2))
        : undefined
}

// build a comment tree, copied from lemmy UI
export const buildCommentTree = (
    comments: CommentView[],
    parentComment: boolean,
    moderators: CommunityModeratorView[],
    originalPosterID: number,
) => {
    const map = new Map<number, CommentNode>()
    const depthOffset = !parentComment
        ? 0
        : getDepthFromComment(comments[0].comment) ?? 0

    for (const comment_view of comments) {
        const depthI = getDepthFromComment(comment_view.comment) ?? 0
        const depth = depthI ? depthI - depthOffset : 0
        const node: CommentNode = {
            comment_view,
            children: [],
            depth,
            creator: {
                isAdmin: comment_view.creator.admin,
                isModerator: isUserModerator(
                    comment_view.creator.id,
                    moderators,
                ),
                isBot: comment_view.creator.bot_account,
                isOriginalPoster: comment_view.creator.id === originalPosterID,
            },
        }
        map.set(comment_view.comment.id, { ...node })
    }

    const tree: CommentNode[] = []

    // if its a parent comment fetch, then push the first comment to the top node.
    if (parentComment) {
        const cNode = map.get(comments[0].comment.id)
        if (cNode) {
            tree.push(cNode)
        }
    }

    for (const comment_view of comments) {
        const child = map.get(comment_view.comment.id)
        if (child) {
            const parent_id = getCommentParentId(comment_view.comment)
            if (parent_id) {
                const parent = map.get(parent_id)
                // Necessary because blocked comment might not exist
                if (parent) {
                    parent.children.push(child)
                }
            } else {
                if (!parentComment) {
                    tree.push(child)
                }
            }
        }
    }

    return tree
}

type LemmyInstance = {
    url: string
    name: string
}

// fetch all lemmy instances
// data taken from https://github.com/maltfield/awesome-lemmy-instances
const LEMMY_INSTANCES_CSV_URL =
    "https://github.com/maltfield/awesome-lemmy-instances/blob/main/awesome-lemmy-instances.csv"

export const fetchLemmyInstances = async () => {
    const response = await fetch(LEMMY_INSTANCES_CSV_URL)
    const csvData = await response.text()
    const lines = csvData.split("\n")

    const jsonData: LemmyInstance[] = []

    // as of writing, the data columns in the csv are
    // instance/NU/NC/Fed/Adult/V/Users/BI/BB/UT/Version
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",")
        const instance = values[0]
        const match = instance.match(/\[(.+?)\]\((https?:\/\/.+?)\)/)
        if (match) {
            const name = match[1]
            let url = match[2]
            if (url.startsWith("https://")) {
                url = url.slice(8)
            }
            jsonData.push({
                url,
                name,
            })
        }
    }
    return jsonData
}

export const isUserModerator = (
    userID: number,
    moderators?: CommunityModeratorView[],
) => moderators?.map((m) => m.moderator.id).includes(userID) ?? false
