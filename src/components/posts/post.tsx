import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { type CommunityModeratorView, type PostView } from "lemmy-js-client"
import Mdx from "@/components/mdx"
import { formatNumber } from "@/lib/utils"
import {
    formatCommunityInfo,
    formatUserInfo,
    isUserModerator,
} from "@/lib/lemmy"
import { Button } from "../ui/button"
import { NSFWMask } from "./nsfw-mask"
import { getPostType } from "./helpers"
import { PostEmbed, PostImage, PostVideo } from "./post-segments"
import { PostVotingButtons } from "../action-buttons"
import { PostHeader } from "./post-header"
import { Separator } from "../ui/separator"

const Post = (props: {
    post: PostView
    instanceURL: string
    moderators?: CommunityModeratorView[]
}) => {
    const { post, instanceURL } = props
    const creator = formatUserInfo(post.creator)
    const community = formatCommunityInfo(post.community)

    const postType = getPostType(post)

    const isUserAdmin = post.creator.admin

    return (
        <Card className="relative overflow-visible border-none">
            <PostHeader
                communityName={community.communityName}
                communityTitle={post.community.title}
                instanceURL={instanceURL}
                creatorUserName={creator.userName}
                published={post.post.published}
                postTitle={post.post.name}
                isUserAdmin={isUserAdmin}
                isUserMod={isUserModerator(post.creator.id, props.moderators)}
                isBot={post.creator.bot_account}
            />
            <Separator />
            <CardContent className="px-0 pt-6">
                <NSFWMask nsfw={post.post.nsfw}>
                    <div className="space-y-4">
                        {postType === "link" ? (
                            <PostEmbed
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                url={post.post.url!}
                                title={post.post.embed_title}
                                description={post.post.embed_description}
                                thumbnailURL={post.post.thumbnail_url}
                                videoURL={post.post.embed_video_url}
                            />
                        ) : postType === "image" ? (
                            <PostImage
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                url={post.post.thumbnail_url ?? post.post.url!}
                                alt={post.post.embed_title ?? ""}
                            />
                        ) : postType === "video" ? (
                            <PostVideo
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                url={post.post.thumbnail_url ?? post.post.url!}
                            />
                        ) : null}
                        {post.post.body && <Mdx text={post.post.body} />}
                    </div>
                </NSFWMask>
            </CardContent>

            <CardFooter className="-ml-4 gap-1 px-0">
                <PostVotingButtons
                    upvotes={post.counts.upvotes}
                    downvotes={post.counts.downvotes}
                    myVote={post.my_vote ?? 0}
                    id={post.post.id}
                />
                <Button variant="ghost" size="sm" asChild className="z-10">
                    <Link
                        href={`/${instanceURL}/post/${post.post.id}#comments`}
                    >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {formatNumber(post.counts.comments)} comments
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export { Post }
