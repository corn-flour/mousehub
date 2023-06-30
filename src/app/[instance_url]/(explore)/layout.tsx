import { ColumnLayout } from "@/components/column-layout"
import Mdx from "@/components/mdx"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { LemmyHttp } from "lemmy-js-client"
import Image from "next/image"
import { Suspense, type ReactNode } from "react"

const InstanceInfo = async ({ instanceURL }: { instanceURL: string }) => {
    const lemmyClient = new LemmyHttp(`https://${instanceURL}`)
    const site = await lemmyClient.getSite({})

    return (
        <Card>
            <CardHeader>
                <CardTitle>{site.site_view.site.name}</CardTitle>
                <CardDescription>
                    {site.site_view.site.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!!site.site_view.site.banner && (
                    <Image
                        src={site.site_view.site.banner}
                        alt="Site banner"
                        width={420}
                        height={280}
                    />
                )}
                {!!site.site_view.site.sidebar && (
                    <Mdx text={site.site_view.site.sidebar} />
                )}
            </CardContent>
        </Card>
    )
}

const InstanceInfoSkeletion = () => {
    return (
        <Card>
            <CardHeader className="space-y-4">
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-16" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
            </CardContent>
        </Card>
    )
}

const ExploreLayout = ({
    params,
    children,
}: {
    params: {
        instance_url: string
    }
    children: ReactNode
}) => {
    return (
        <ColumnLayout>
            <main className="flex-[2] space-y-4">{children}</main>
            <aside className="sticky hidden flex-1 lg:block">
                <Suspense fallback={<InstanceInfoSkeletion />}>
                    <InstanceInfo instanceURL={params.instance_url} />
                </Suspense>
            </aside>
        </ColumnLayout>
    )
}

export default ExploreLayout
