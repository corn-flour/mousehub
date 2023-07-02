import { type PostView } from "lemmy-js-client"

export type PostType = "text" | "image" | "link" | "video"

// a link is an image if it ends in jpg/jpeg/png/webp/avif/gif/svg
export const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url)
}

// a link is a video if it ends in mp4/webm
export const isVideo = (url: string) => {
    return /\.(mp4|webm)$/.test(url)
}

export const getPostType = (post: PostView): PostType => {
    // if there is an url, which is an image link (ends in expected formats)
    if (post.post.url && isImage(post.post.url)) return "image"

    // if there is post url, which is a video link
    if (post.post.url && isVideo(post.post.url)) return "video"

    // otherwise, if post contains link, post is URL type
    if (post.post.url) return "link"

    // if post contain thumbnail URL and it is an image, post is image type
    if (post.post.thumbnail_url && isImage(post.post.thumbnail_url))
        return "image"

    if (post.post.thumbnail_url && isVideo(post.post.thumbnail_url))
        return "video"

    // post
    return "text"
}
