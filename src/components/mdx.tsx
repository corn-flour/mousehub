import { default as MarkdownIt } from "markdown-it"
import OverflowMask from "./posts/overflow-mask"
const md = new MarkdownIt()

// TODO: figure out custom markdown render rules
const Mdx = (props: { text: string; shouldOverflow?: boolean }) => {
    const { text, shouldOverflow } = props

    return (
        <OverflowMask shouldOverflow={shouldOverflow}>
            <article
                className="prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: md.render(text) }}
            />
        </OverflowMask>
    )
}

export default Mdx
