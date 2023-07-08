import { createLemmyClient } from "@/lib/lemmy"
import { z } from "zod"

// TODO: extend for other search
const searchRouteSchema = z.object({
    instanceURL: z.string(),
    query: z.string(),
    limit: z.coerce.number(),
    type: z.enum(["All", "Comments", "Posts", "Communities"]),
})

export const GET = async (request: Request) => {
    const { searchParams } = new URL(request.url)

    const validatedRequests = searchRouteSchema.parse(
        Object.fromEntries(searchParams),
    )

    // no query passed, return null
    if (!validatedRequests.query)
        return new Response(JSON.stringify(null), {
            status: 404,
        })

    const lemmyClient = createLemmyClient(validatedRequests.instanceURL)

    const searchResults = await lemmyClient.search({
        q: validatedRequests.query,
        type_: validatedRequests.type,
        limit: validatedRequests.limit,
    })

    return new Response(JSON.stringify(searchResults), {
        status: 200,
    })
}
