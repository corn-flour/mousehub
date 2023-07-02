"use client"
import { useAccountManager } from "../account-provider"

export const TestAccountProviders = () => {
    const { accounts } = useAccountManager()
    console.log(accounts)
    return null
}
