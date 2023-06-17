import { type Person } from "lemmy-js-client"

const LEMMY_INSTANCES_CSV_URL =
    "https://github.com/maltfield/awesome-lemmy-instances/blob/main/awesome-lemmy-instances.csv"

export const formatUserInfo = (user: Person) => {
    // regex to extract domain name from URL. This is to get the instance domain of the user
    const match = /^(?:https?:\/\/)?([^\/\r\n]+)/.exec(user.actor_id)
    const domain = match ? match[1] : "" // This should never fail considering the domain is taken from the API directly
    const userName = user.local ? user.name : `${user.name}@${domain}`

    return {
        userName,
    }
}


type LemmyInstance = {
    url: string
    name: string
}

// fetch all lemmy instances
// data taken from https://github.com/maltfield/awesome-lemmy-instances
export const fetchLemmyInstances = async () => {
    const response = await fetch(LEMMY_INSTANCES_CSV_URL)
    const csvData = await response.text()
    const lines = csvData.split("\n")
    
    const jsonData: LemmyInstance[] = []

    // as of writing, the data columns in the csv are
    // instance/NU/NC/Fed/Adult/V/Users/BI/BB/UT/Version
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',')
        const instance = values[0]
        const match = instance.match(/\[(.+?)\]\((https?:\/\/.+?)\)/)
        if (match) {
            const name = match[1]
            let url = match[2]
            if (url.startsWith('https://')){
                url = url.slice(8)
            }
            jsonData.push({
                url,
                name
            })
        }
    }
    return jsonData
}
