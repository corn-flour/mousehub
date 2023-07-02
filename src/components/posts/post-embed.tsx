import Link from "next/link"
import React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card"
import Image from "next/image"
import { isVideo } from "./helpers"
import { ExternalLink } from "lucide-react"

export const PostVideo = (props: { url: string }) => {
    if (isVideo(props.url))
        return (
            <video className="relative z-10 aspect-video w-full">
                <source src={props.url} />
            </video>
        )
    return (
        <iframe src={props.url} className="relative z-10 aspect-video w-full" />
    )
}

export const PostEmbed = (props: {
    url: string
    title?: string
    description?: string
    thumbnailURL?: string
    videoURL?: string
}) => {
    const { url, title, description, thumbnailURL, videoURL } = props
    const hasBody = !!description || !!thumbnailURL || !!videoURL

    return (
        <Link href={url} target="_blank" className="group relative z-10 mt-4">
            <Card className="border-transparent bg-muted transition group-hover:bg-muted/60">
                <CardHeader>
                    {!!title && <CardTitle>{title}</CardTitle>}
                    <CardDescription className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                            {url}
                        </span>
                    </CardDescription>
                </CardHeader>
                {!!hasBody && (
                    <CardContent className="space-y-4">
                        <p>{description}</p>
                        {!!thumbnailURL && (
                            <Image
                                src={thumbnailURL}
                                alt={title ?? ""}
                                width={700}
                                height={400}
                                className="w-full"
                            />
                        )}
                        {!!videoURL && <PostVideo url={videoURL} />}
                    </CardContent>
                )}
            </Card>
        </Link>
    )
}
