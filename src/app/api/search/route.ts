import { createLemmyClient } from "@/lib/lemmy"
import { z } from "zod"

// TODO: extend for other search
const searchRouteSchema = z.object({
    instanceURL: z.string(),
    query: z.string(),
})

export const GET = async (request: Request) => {
    const { searchParams } = new URL(request.url)
    const validatedRequests = searchRouteSchema.parse(
        Object.fromEntries(searchParams),
    )

    if (!validatedRequests.query)
        return new Response(JSON.stringify([]), {
            status: 200,
        })

    const lemmyClient = createLemmyClient(validatedRequests.instanceURL)

    const searchResults = await lemmyClient.search({
        q: validatedRequests.query,
        type_: "Communities",
        limit: 10,
    })

    return new Response(JSON.stringify(searchResults.communities), {
        status: 200,
    })
}
