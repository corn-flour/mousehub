import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatNumber = (n: number) =>
    Intl.NumberFormat(undefined, {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(n)
