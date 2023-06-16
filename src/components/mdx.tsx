import { default as MarkdownIt } from "markdown-it"

const md = new MarkdownIt()

const Mdx = (props: { text: string }) => {
    return (
        <article
            className="mask-gradient prose max-h-40 overflow-hidden dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: md.render(props.text) }}
        />
    )
}

export default Mdx
