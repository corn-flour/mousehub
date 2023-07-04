import OverflowMask from "../posts/overflow-mask"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import remarkGfm from "remark-gfm"

import { components } from "./markdown.config"

const Mdx = (props: { text: string; shouldOverflow?: boolean }) => {
    const { text, shouldOverflow } = props

    return (
        <OverflowMask shouldOverflow={shouldOverflow}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {text}
            </ReactMarkdown>
        </OverflowMask>
    )
}

export default Mdx
