import type { Transaction } from "@/services/transactionApi"

// =====================================================
// TYPES
// =====================================================

export interface MonthMetrics {
    income: number
    expense: number
    savings: number
}

export interface ComparisonResult {
    current: MonthMetrics
    previous: MonthMetrics
    expenseChange: number
    incomeChange: number
    savingsChange: number
}

// =====================================================
// GET MONTH METRICS
// =====================================================

function getMonthMetrics(
    transactions: Transaction[],
    year: number,
    month: number
): MonthMetrics {
    const monthTransactions =
        transactions.filter((transaction) => {
            if (!transaction.date) {
                return false
            }

            const date = new Date(
                `${transaction.date}T00:00:00`
            )

            return (
                date.getFullYear() === year &&
                date.getMonth() === month
            )
        })

    // =====================================================
    // INCOME
    // =====================================================

    const income =
        monthTransactions
            .filter(
                (transaction) =>
                    transaction.type === "INCOME"
            )
            .reduce(
                (total, transaction) =>
                    total +
                    Math.abs(
                        Number(transaction.amount) || 0
                    ),
                0
            )

    // =====================================================
    // EXPENSE
    // =====================================================

    const expense =
        monthTransactions
            .filter(
                (transaction) =>
                    transaction.type === "EXPENSE"
            )
            .reduce(
                (total, transaction) =>
                    total +
                    Math.abs(
                        Number(transaction.amount) || 0
                    ),
                0
            )

    // =====================================================
    // SAVINGS
    // =====================================================

    const savings =
        income - expense

    return {
        income,
        expense,
        savings,
    }
}

// =====================================================
// PERCENTAGE CHANGE
// =====================================================

function percentageChange(
    current: number,
    previous: number
): number {
    if (previous === 0) {
        if (current === 0) {
            return 0
        }

        return 100
    }

    return (
        (current - previous) /
        Math.abs(previous)
    ) * 100
}

// =====================================================
// SAVINGS CHANGE
// =====================================================

function savingsPercentageChange(
    current: number,
    previous: number
): number {
    // ---------------------------------------------
    // Normal positive savings comparison
    // ---------------------------------------------

    if (previous > 0) {
        return (
            (current - previous) /
            previous
        ) * 100
    }

    // ---------------------------------------------
    // Both are zero
    // ---------------------------------------------

    if (
        previous === 0 &&
        current === 0
    ) {
        return 0
    }

    // ---------------------------------------------
    // Zero → positive savings
    // ---------------------------------------------

    if (
        previous === 0 &&
        current > 0
    ) {
        return 100
    }

    // ---------------------------------------------
    // Previous deficit → improvement
    // ---------------------------------------------

    if (
        previous < 0 &&
        current > previous
    ) {
        return 100
    }

    // ---------------------------------------------
    // Previous deficit → worse deficit
    // ---------------------------------------------

    if (
        previous < 0 &&
        current < previous
    ) {
        return -100
    }

    return 0
}

// =====================================================
// BUILD MONTH COMPARISON
// =====================================================

export function buildMonthComparison(
    transactions: Transaction[],
    year: number,
    month: number
): ComparisonResult {
    // =====================================================
    // CURRENT MONTH
    // =====================================================

    const current =
        getMonthMetrics(
            transactions,
            year,
            month
        )

    // =====================================================
    // PREVIOUS MONTH
    // =====================================================

    const previousDate =
        new Date(
            year,
            month - 1,
            1
        )

    const previous =
        getMonthMetrics(
            transactions,
            previousDate.getFullYear(),
            previousDate.getMonth()
        )

    // =====================================================
    // RETURN
    // =====================================================

    return {
        current,
        previous,

        expenseChange:
            percentageChange(
                current.expense,
                previous.expense
            ),

        incomeChange:
            percentageChange(
                current.income,
                previous.income
            ),

        savingsChange:
            savingsPercentageChange(
                current.savings,
                previous.savings
            ),
    }
}