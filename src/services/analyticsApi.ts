import api from "@/lib/axios"

export interface CategoryAnalytics {
    category: string
    amount: number
    percentage: number
}

export interface MonthlyAnalytics {
    month: string
    income: number
    expense: number
    savings: number
}

export interface AnalyticsResponse {
    income: number
    expense: number
    savings: number
    savingsRate: number

    previousMonthExpense: number
    expenseChange: number

    previousMonthIncome: number
    incomeChange: number

    topCategory: string | null

    categoryBreakdown:
        CategoryAnalytics[]

    monthlyTrend:
        MonthlyAnalytics[]
}


export async function getAnalytics(
    month: number,
    year: number
): Promise<AnalyticsResponse> {

    const response =
        await api.get<AnalyticsResponse>(
            "/analytics",
            {
                params: {
                    month,
                    year,
                },
            }
        )

    return response.data
}