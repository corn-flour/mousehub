import Image from "next/image"

// renders an image of the post
// blur the image if it is nsfw
export const PostImage = (props: {
    imageURL: string
    nsfw?: boolean
    alt: string
}) => {
    const { imageURL, nsfw, alt } = props

    if (nsfw) {
        return (
            <Image
                src={imageURL}
                alt={alt}
                className="max-h-[600px] rounded-lg object-cover object-top transition-all"
                width={672}
                height={672}
            />
        )
    }

    return (
        <Image
            src={imageURL}
            alt={alt}
            className="max-h-[600px] rounded-lg object-cover object-top transition-all"
            width={672}
            height={672}
        />
    )
}
