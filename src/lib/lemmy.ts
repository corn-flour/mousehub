import { type Person } from "lemmy-js-client"

export const formatUserInfo = (user: Person) => {
    // regex to extract domain name from URL. This is to get the instance domain of the user
    const match = /^(?:https?:\/\/)?([^\/\r\n]+)/.exec(user.actor_id)
    const domain = match? match[1] : '' // This should never fail considering the domain is taken from the API directly
    const userName = user.local ? user.name : `${user.name}@${domain}`

    return {
        userName
    }
}
