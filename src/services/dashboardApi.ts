import api from "@/lib/axios"

import type {
    Transaction,
} from "@/services/transactionApi"

import type {
    RecurringTransaction,
} from "@/services/recurringTransactionApi"


// =====================================================
// SUMMARY
// =====================================================

export interface DashboardSummary {

    totalIncome: number

    totalExpense: number

    balance: number
}


// =====================================================
// CATEGORY SPENDING
// =====================================================

export interface CategorySpending {

    category: string

    amount: number

    percentage: number
}


// =====================================================
// MONTHLY TREND
// =====================================================

export interface MonthlyTrend {

    month: string

    income: number

    expense: number

    balance: number
}


// =====================================================
// DASHBOARD DATA
// =====================================================

export interface DashboardData {

    summary: DashboardSummary

    transactions: Transaction[]

    recurring: RecurringTransaction[]

    categorySpending: CategorySpending[]

    monthlyTrend: MonthlyTrend[]
}


// =====================================================
// SUMMARY
// =====================================================

export async function getDashboardSummary():

    Promise<DashboardSummary> {

    const response =
        await api.get<DashboardSummary>(
            "/summary"
        )

    return response.data
}


// =====================================================
// TRANSACTIONS
// =====================================================

export async function getDashboardTransactions():

    Promise<Transaction[]> {

    const response =
        await api.get<Transaction[]>(
            "/transactions"
        )

    return response.data
}


// =====================================================
// RECURRING
// =====================================================

export async function getDashboardRecurring():

    Promise<RecurringTransaction[]> {

    const response =
        await api.get<
            RecurringTransaction[]
        >(
            "/recurring-transactions"
        )

    return response.data
}