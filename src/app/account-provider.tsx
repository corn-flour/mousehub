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
    removeAccount: (id: string) => void
    // eslint-disable-next-line @typescript-eslint/no-empty-function
}>({ accounts: [], removeAccount: () => {} })

export default function AccountManagerProvider({
    children,
}: {
    children: ReactNode
}) {
    const { data: session } = useSession()

    const [accounts, setAccounts] = useState<User[]>([])

    useEffect(() => {
        if (typeof window !== undefined) {
            setAccounts(getInitialStateFromStorage())
        }
    }, [])

    // sync account with localstorage
    useEffect(() => {
        if (typeof window !== undefined) {
            localStorage.setItem(
                "accounts",
                JSON.stringify(Array.from(accounts)),
            )
        }
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
                removeAccount: (id) => {
                    setAccounts((accounts) =>
                        [...accounts].filter((item) => item.id !== id),
                    )
                },
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
