"use client"
import { type User } from "next-auth"
import { useSession } from "next-auth/react"
import {
    type ReactNode,
    createContext,
    useContext,
    useState,
    useEffect,
} from "react"

const getInitialStateFromStorage = () => {
    const accounts = localStorage.getItem("accounts")
    return accounts ? (JSON.parse(accounts) as User[]) : []
}

const accountManager = createContext<{
    accounts: User[]
}>({ accounts: [] })

export default function AccountManagerProvider({
    children,
}: {
    children: ReactNode
}) {
    const { data: session } = useSession()

    const [accounts, setAccounts] = useState<User[]>(
        getInitialStateFromStorage(),
    )

    // sync account with localstorage
    useEffect(() => {
        localStorage.setItem("accounts", JSON.stringify(Array.from(accounts)))
    }, [accounts])

    // sync session with account list
    useEffect(() => {
        if (session) {
            const newAccount: User = {
                id: session.localUser.id,
                jwt: session.accessToken,
                instanceURL: session.instanceURL,
                localUser: session.localUser,
            }

            setAccounts((accounts) => {
                const newAccountIndex = accounts.findIndex(
                    (item) => item.id === newAccount.id,
                )
                return newAccountIndex !== -1
                    ? accounts
                    : [...accounts, newAccount]
            })
        }
    }, [session])

    return (
        <accountManager.Provider
            value={{
                accounts,
            }}
        >
            {children}
        </accountManager.Provider>
    )
}

// useAccountManager Hook
export function useAccountManager() {
    return useContext(accountManager)
}
