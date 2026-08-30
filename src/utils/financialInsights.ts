import type { Transaction } from "@/services/transactionApi"


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


    const categoryTotals =
        new Map<
            string,
            number
        >()


    // =================================================
    // PROCESS TRANSACTIONS
    // =================================================

    transactions.forEach(
        (transaction) => {

            const amount =
                Number(
                    transaction.amount
                ) || 0


            if (
                transaction.type ===
                "INCOME"
            ) {

                totalIncome +=
                    amount

                incomeCount++

                return
            }


            totalExpense +=
                amount

            expenseCount++


            const category =
                transaction.category
                     ||
                "Other"


            categoryTotals.set(
                category,
                (
                    categoryTotals.get(
                        category
                    ) || 0
                ) +
                amount
            )
        }
    )


    // =================================================
    // BALANCE
    // =================================================

    const balance =
        totalIncome -
        totalExpense


    // =================================================
    // SAVINGS RATE
    // =================================================

    const savingsRate =
        totalIncome > 0
            ? (
                balance /
                totalIncome
            ) *
            100
            : 0


    // =================================================
    // TOP CATEGORY
    // =================================================

    let topCategory:
        string | null = null

    let topCategoryAmount = 0


    categoryTotals.forEach(
        (
            amount,
            category
        ) => {

            if (
                amount >
                topCategoryAmount
            ) {

                topCategory =
                    category

                topCategoryAmount =
                    amount
            }
        }
    )


    return {

        totalIncome,

        totalExpense,

        balance,

        savingsRate,

        topCategory,

        topCategoryAmount,

        transactionCount:
        transactions.length,

        expenseCount,

        incomeCount,
    }
}