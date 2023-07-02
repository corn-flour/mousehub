import { LemmyHttp } from "lemmy-js-client"
import NextAuth from "next-auth"
import { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    callbacks: {
        jwt({ token, user }) {
            // This callback is run everytime the jwt check is called
            // including when the user first signed in
            // this is only relevant since we are using jwt strategy instead of database
            if (user) {
                // the user field here only exist the first time the user sign in
                // it is of User type and the values come from the authorize() return values
                // this function should return the JWT type, which is updated in @/types/next-auth.d.ts
                return {
                    accessToken: user.jwt,
                    instanceURL: user.instanceURL,
                    localUser: user.localUser,
                }
            }
            return token
        },

        session({ session, token }) {
            // This callback returns the session object that we actually use to check if the user is logged in or not
            // we just grab the data from the JWT token and put it to the session object
            // the return type is Session, which is updated in @/types/next-auth.d.ts
            session.localUser = token.localUser
            session.accessToken = token.accessToken
            session.instanceURL = token.instanceURL

            return session
        },
    },
    providers: [
        CredentialsProvider({
            id: "credentials",
            credentials: {
                instanceURL: {
                    label: "Instance URL",
                    type: "text",
                    required: true,
                },
                username: {
                    label: "Username or Email",
                    type: "text",
                    required: true,
                },
                password: {
                    label: "Password",
                    type: "password",
                    required: true,
                },
            },
            authorize: async (credentials) => {
                console.log("credentials provider called")
                // function that handles authorizing the login
                // this will be triggered first when the user submit the login form
                // and is responsible for calling the Lemmy login endpoint
                if (!credentials) return null

                // calls to login endpoint in lemmy server
                const lemmyClient = new LemmyHttp(
                    `https://${credentials.instanceURL}`,
                )
                const authResponse = await lemmyClient.login({
                    username_or_email: credentials.username,
                    password: credentials.password,
                })

                console.log(
                    "cred: login to remote instance called",
                    authResponse,
                )

                // TODO: handle unverified user logins
                if (!authResponse.jwt) return null

                // user is successfully logged in, trying to get user's info...
                const siteData = await lemmyClient.getSite({
                    auth: authResponse.jwt,
                })

                console.log("cred: getSite called", siteData.my_user)

                if (!siteData.my_user) return null
                const myUser = siteData.my_user

                // the return type here matches the User type from next-auth
                // the User type is updated in @/types/next-auth.d.ts to add the needed new fields
                return {
                    id: `${myUser.local_user_view.local_user.id}`,
                    jwt: authResponse.jwt,
                    instanceURL: credentials.instanceURL,
                    localUser: {
                        id: `${siteData.my_user.local_user_view.person.id}`,
                        userName: myUser.local_user_view.person.name,
                        avatar: myUser.local_user_view.person.avatar,
                    },
                }
            },
        }),
        CredentialsProvider({
            id: "account-switch",
            name: "Account Switch",
            credentials: {
                instanceURL: {
                    label: "Instance URL",
                    type: "text",
                    required: true,
                },
                accessToken: {
                    type: "text",
                    required: true,
                },
            },

            async authorize(credentials) {
                console.log("Account switch provider called")

                if (!credentials) throw new Error("Credentials not provided")
                const lemmyClient = new LemmyHttp(
                    `https://${credentials.instanceURL}`,
                )

                const siteData = await lemmyClient.getSite({
                    auth: credentials.accessToken,
                })

                if (!siteData.my_user) throw new Error("Invalid access token")
                return {
                    id: `${siteData.my_user.local_user_view.person.id}`,
                    jwt: credentials.accessToken,
                    instanceURL: credentials.instanceURL,
                    localUser: {
                        id: `${siteData.my_user.local_user_view.person.id}`,
                        userName: siteData.my_user.local_user_view.person.name,
                        avatar: siteData.my_user.local_user_view.person.avatar,
                    },
                }
            },
        }),
    ],
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
