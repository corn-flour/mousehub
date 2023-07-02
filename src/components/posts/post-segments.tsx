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
import { cn } from "@/lib/utils"

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
    isExplore?: boolean
}) => {
    const { url, title, description, thumbnailURL, videoURL } = props
    const hasBody = !!description || !!thumbnailURL || !!videoURL

    return (
        <Card className="relative z-10 border-transparent bg-muted/60 transition hover:bg-muted">
            <Link href={url} target="_blank" className="absolute inset-0 mt-4">
                <span className="sr-only">Open link in next tab</span>
            </Link>
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
                    {!!videoURL && <PostVideo url={videoURL} />}

                    {!videoURL && !!thumbnailURL && (
                        <Image
                            src={thumbnailURL}
                            alt={title ?? ""}
                            width={700}
                            height={400}
                            className={cn(
                                "w-full object-cover",
                                props.isExplore && "max-h-[600px]",
                            )}
                        />
                    )}
                </CardContent>
            )}
        </Card>
    )
}

export const PostImage = (props: {
    url: string
    alt: string
    isExplore?: boolean
}) => {
    const { url: imageURL, alt } = props
    return (
        <Image
            src={imageURL}
            alt={alt}
            className={cn(
                "w-full rounded-lg object-cover",
                props.isExplore && "max-h-[600px]",
            )}
            width={672}
            height={672}
        />
    )
}
