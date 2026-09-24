// src/hooks/useAnalytics.ts

import { useQuery } from "@tanstack/react-query"

import {
    getAnalytics,
} from "@/services/analyticsApi"


export function useAnalytics(
    month: number,
    year: number
) {
    return useQuery({
        queryKey: [
            "analytics",
            month,
            year,
        ],

        queryFn: () =>
            getAnalytics(
                month,
                year
            ),

        // FIX:
        // The app stores the JWT as "finora_token",
        // not "token".
        enabled: Boolean(
            localStorage.getItem(
                "finora_token"
            )
        ),

        staleTime:
            30 * 1000,

        refetchOnWindowFocus:
            false,
    })
}