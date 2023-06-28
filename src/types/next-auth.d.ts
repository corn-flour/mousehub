import type { LocalUser, MyUserInfo, Person } from "lemmy-js-client"

declare module "next-auth" {
    interface Session {
        accessToken: string
        localUser: MyUserInfo
        instanceURL: string
    }

    interface User {
        id: string
        jwt: string
        instanceURL: string
        localUser: MyUserInfo
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string
        instanceURL: string
        localUser: MyUserInfo
    }
}
