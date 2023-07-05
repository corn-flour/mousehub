import { RightColumnLayout } from "@/components/right-column-layout"
import Mdx from "@/components/markdown/mdx"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { createLemmyClient } from "@/lib/lemmy"
import Image from "next/image"
import { Suspense, type ReactNode } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const InstanceInfo = async ({ instanceURL }: { instanceURL: string }) => {
    const session = await getServerSession(authOptions)
    const lemmyClient = createLemmyClient(instanceURL)
    const site = await lemmyClient.getSite({
        auth: session?.accessToken,
    })

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
        <RightColumnLayout>
            <main className="flex-[2] space-y-4">{children}</main>
            <aside className="sticky top-[117px] hidden flex-1 xl:block">
                <Suspense fallback={<InstanceInfoSkeletion />}>
                    <InstanceInfo instanceURL={params.instance_url} />
                </Suspense>
            </aside>
        </RightColumnLayout>
    )
}

export default ExploreLayout
