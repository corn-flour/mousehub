import Image from "next/image"

// renders an image of the post
export const PostImage = (props: { imageURL: string; alt: string }) => {
    const { imageURL, alt } = props

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
