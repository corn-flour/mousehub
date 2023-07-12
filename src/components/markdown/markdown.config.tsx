/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils"
import Link from "next/link"
import { type SpecialComponents } from "react-markdown/lib/ast-to-react"
import { type NormalComponents } from "react-markdown/lib/complex-types"

// the component transformer
export const components: Partial<
    Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents
> = {
    h1: ({ className, node, ...props }) => (
        <h1
            className={cn(
                "mt-2 scroll-m-20 text-2xl font-bold tracking-tight",
                className,
            )}
            {...props}
        />
    ),
    h2: ({ className, node, ...props }) => (
        <h2
            className={cn(
                "mt-10 scroll-m-20 border-b pb-1 text-xl font-semibold tracking-tight first:mt-0",
                className,
            )}
            {...props}
        />
    ),
    h3: ({ className, ...props }) => (
        <h3
            className={cn(
                "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
                className,
            )}
            {...props}
        />
    ),
    h4: ({ className, node, ...props }) => (
        <h4
            className={cn(
                "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
                className,
            )}
            {...props}
        />
    ),
    h5: ({ className, node, ...props }) => (
        <h5
            className={cn(
                "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
                className,
            )}
            {...props}
        />
    ),
    h6: ({ className, node, ...props }) => (
        <h6
            className={cn(
                "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
                className,
            )}
            {...props}
        />
    ),
    a: ({ className, href, node, ...props }) => {
        // TODO: transform link href. If non lemmy link, add _
        return (
            <Link
                className={cn(
                    "break-words font-medium underline underline-offset-4",
                    className,
                )}
                href={href ?? ""}
                {...props}
            />
        )
    },
    p: ({ className, node, ...props }) => (
        <p
            className={cn("leading-7 [&:not(:first-child)]:mt-4", className)}
            {...props}
        />
    ),
    ul: ({ className, ordered, node, ...props }) => (
        <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
    ),
    ol: ({ className, ordered, node, ...props }) => (
        <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
    ),
    li: ({ className, ordered, node, ...props }) => {
        return <li className={cn("mt-2", className)} {...props} />
    },
    blockquote: ({ className, node, ...props }) => (
        <blockquote
            className={cn(
                "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
                className,
            )}
            {...props}
        />
    ),
    img: ({ className, node, alt, ...props }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            className={cn("rounded-md border", className)}
            alt={alt}
            {...props}
        />
    ),
    hr: ({ node, ...props }) => <hr className="my-4 md:my-8" {...props} />,
    table: ({ className, node, ...props }) => (
        <div className="my-6 w-full overflow-y-auto">
            <table className={cn("w-full", className)} {...props} />
        </div>
    ),
    tr: ({ className, isHeader, node, ...props }) => (
        <tr
            className={cn("m-0 border-t p-0 even:bg-muted", className)}
            {...props}
        />
    ),
    th: ({ className, isHeader, node, ...props }) => (
        <th
            className={cn(
                "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
                className,
            )}
            {...props}
        />
    ),
    td: ({ className, isHeader, node, ...props }) => (
        <td
            className={cn(
                "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
                className,
            )}
            {...props}
        />
    ),
    pre: ({ className, node, ...props }) => (
        <pre
            className={cn(
                "mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4",
                className,
            )}
            {...props}
        />
    ),
    code: ({ className, node, inline, ...props }) => (
        <code
            className={cn(
                "relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm",
                className,
            )}
            {...props}
        />
    ),
}
