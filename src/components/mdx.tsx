import { default as MarkdownIt } from "markdown-it"

const md = new MarkdownIt()

const Mdx = (props: { text: string }) => {
    return (
        <div
            className="mask-gradient prose max-h-40 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: md.render(props.text) }}
        />
    )
}

export default Mdx
