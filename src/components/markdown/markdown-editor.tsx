"use client"

import MDEditor from "@uiw/react-md-editor"
import rehypeSanitize from "rehype-sanitize"
import { useFormField } from "../ui/form"
import Mdx from "./mdx"

export const FormMarkdownEditor = (props: {
    value?: string
    onChange: (v: string) => void
}) => {
    const { error, formItemId, formDescriptionId, formMessageId } =
        useFormField()

    return (
        <MDEditor
            textareaProps={{
                id: formItemId,
                "aria-describedby": !error
                    ? `${formDescriptionId}`
                    : `${formDescriptionId} ${formMessageId}`,
                "aria-invalid": !!error,
            }}
            value={props.value}
            onChange={(v) => props.onChange(v ?? "")}
            preview="live"
            previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
            }}
            components={{
                preview: (source) => <Mdx text={source} />,
            }}
        />
    )
}
