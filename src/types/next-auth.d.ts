// this import is needed for the types in /api/auth/[...nextauth] to work :/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type NextAuthOptions } from "next-auth"
declare module "next-auth" {
    interface Session {
        accessToken: string
        localUser: {
            id: string
            userName: string
            avatar?: string
        }
        instanceURL: string
    }

    interface User {
        id: string
        jwt: string
        instanceURL: string
        localUser: {
            id: string
            userName: string
            avatar?: string
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string
        instanceURL: string
        localUser: {
            id: string
            userName: string
            avatar?: string
        }
    }
}
