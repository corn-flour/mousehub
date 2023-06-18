import "./globals.css"
import { Inter } from "next/font/google"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Mousehub",
    description: "Browse Lemmy with ease",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>
                {children}
                </Providers>
            </body>
        </html>
    )
}
