"use server"

import { LemmyHttp } from "lemmy-js-client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const login = async (formData: FormData) => {
    const instanceURL = formData.get("instance_url") as string
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    const lemmyClient = new LemmyHttp(`https://${instanceURL}`)

    const authResponse = await lemmyClient.login({
        username_or_email: username,
        password,
    })

    cookies().set({
        name: "jwt",
        value: authResponse.jwt ?? "",
        path: `/${instanceURL}`,
        httpOnly: true,
    })

    redirect(`/${instanceURL}`)
}

// server actions needs to be async functions
// eslint-disable-next-line @typescript-eslint/require-await
export const signOut = async (instanceURL: string) => {
    cookies().set({
        name: "jwt",
        value: "",
        path: `/${instanceURL}`,
    })
}
