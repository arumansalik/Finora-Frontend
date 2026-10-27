import type { Transaction } from "@/services/transactionApi"

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

function getMonthMetrics(
    transactions: Transaction[],
    year: number,
    month: number
): MonthMetrics {
    const monthTransactions = transactions.filter((transaction) => {
        if (!transaction.date) {
            return false
        }

        const date = new Date(`${transaction.date}T00:00:00`)

        return (
            date.getFullYear() === year &&
            date.getMonth() === month
        )
    })

    const income = monthTransactions
        .filter((transaction) => transaction.type === "INCOME")
        .reduce(
            (total, transaction) =>
                total + Math.abs(Number(transaction.amount) || 0),
            0
        )

    const expense = monthTransactions
        .filter((transaction) => transaction.type === "EXPENSE")
        .reduce(
            (total, transaction) =>
                total + Math.abs(Number(transaction.amount) || 0),
            0
        )

    return {
        income,
        expense,
        savings: income - expense,
    }
}

function percentageChange(current: number, previous: number): number {
    if (previous === 0) {
        return current === 0 ? 0 : 100
    }

    return ((current - previous) / Math.abs(previous)) * 100
}

function savingsPercentageChange(
    current: number,
    previous: number
): number {
    if (previous > 0) {
        return ((current - previous) / previous) * 100
    }

    if (previous === 0 && current === 0) {
        return 0
    }

    if (previous === 0 && current > 0) {
        return 100
    }

    if (previous < 0 && current > previous) {
        return 100
    }

    if (previous < 0 && current < previous) {
        return -100
    }

    return 0
}

export function buildMonthComparison(
    transactions: Transaction[],
    year: number,
    month: number
): ComparisonResult {
    const current = getMonthMetrics(transactions, year, month)

    const previousDate = new Date(year, month - 1, 1)

    const previous = getMonthMetrics(
        transactions,
        previousDate.getFullYear(),
        previousDate.getMonth()
    )

    return {
        current,
        previous,
        expenseChange: percentageChange(
            current.expense,
            previous.expense
        ),
        incomeChange: percentageChange(
            current.income,
            previous.income
        ),
        savingsChange: savingsPercentageChange(
            current.savings,
            previous.savings
        ),
    }
}