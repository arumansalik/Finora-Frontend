import type { Transaction } from "@/services/transactionApi"

// =====================================================
// FINANCIAL INSIGHTS TYPES
// =====================================================

export interface FinancialInsights {
    totalIncome: number
    totalExpense: number
    balance: number
    savingsRate: number
    topCategory: string | null
    topCategoryAmount: number
    transactionCount: number
    expenseCount: number
    incomeCount: number
}

// =====================================================
// CALCULATE FINANCIAL INSIGHTS
// =====================================================

export function calculateFinancialInsights(
    transactions: Transaction[]
): FinancialInsights {
    let totalIncome = 0
    let totalExpense = 0
    let incomeCount = 0
    let expenseCount = 0

    const categoryTotals = new Map<string, number>()

    transactions.forEach((transaction) => {
        const amount =
            Math.abs(Number(transaction.amount) || 0)

        // -------------------------------
        // INCOME
        // -------------------------------

        if (transaction.type === "INCOME") {
            totalIncome += amount
            incomeCount++
            return
        }

        // -------------------------------
        // EXPENSE
        // -------------------------------

        if (transaction.type === "EXPENSE") {
            totalExpense += amount
            expenseCount++

            const category =
                transaction.category?.trim() || "Other"

            categoryTotals.set(
                category,
                (categoryTotals.get(category) ?? 0) + amount
            )
        }
    })

    // =====================================================
    // BALANCE
    // =====================================================

    const balance =
        totalIncome - totalExpense

    // =====================================================
    // SAVINGS RATE
    // =====================================================

    const savingsRate =
        totalIncome > 0
            ? (balance / totalIncome) * 100
            : 0

    // =====================================================
    // TOP SPENDING CATEGORY
    // =====================================================

    let topCategory: string | null = null
    let topCategoryAmount = 0

    categoryTotals.forEach(
        (amount, category) => {
            if (amount > topCategoryAmount) {
                topCategory = category
                topCategoryAmount = amount
            }
        }
    )

    // =====================================================
    // RETURN
    // =====================================================

    return {
        totalIncome,
        totalExpense,
        balance,
        savingsRate,
        topCategory,
        topCategoryAmount,
        transactionCount: transactions.length,
        expenseCount,
        incomeCount,
    }
}