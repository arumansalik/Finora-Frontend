import api from "@/lib/axios"


export interface SummaryResponse {
    totalIncome: number
    totalExpense: number
    balance: number
}


// =====================================================
// GET SUMMARY
// =====================================================

export async function getSummary(): Promise<SummaryResponse> {

    const response =
        await api.get<SummaryResponse>(
            "/summary"
        )

    return response.data
}