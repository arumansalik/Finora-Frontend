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


export interface FinancialInsight {
    type: "positive" | "warning" | "neutral"
    title: string
    description: string
}


// =====================================================
// CALCULATE FINANCIAL INSIGHTS METRICS
// =====================================================

export function calculateFinancialInsights(
    transactions: Transaction[]
): FinancialInsights {

    let totalIncome = 0
    let totalExpense = 0

    let incomeCount = 0
    let expenseCount = 0

    const categoryTotals =
        new Map<string, number>()


    transactions.forEach(
        (transaction) => {

            const amount =
                Math.abs(
                    Number(
                        transaction.amount
                    ) || 0
                )


            // =================================================
            // INCOME
            // =================================================

            if (
                transaction.type ===
                "INCOME"
            ) {

                totalIncome += amount

                incomeCount++

                return
            }


            // =================================================
            // EXPENSE
            // =================================================

            if (
                transaction.type ===
                "EXPENSE"
            ) {

                totalExpense += amount

                expenseCount++


                const category =
                    transaction.category?.trim() ||
                    "Other"


                categoryTotals.set(
                    category,
                    (
                        categoryTotals.get(
                            category
                        ) ?? 0
                    ) + amount
                )
            }
        }
    )


    // =====================================================
    // BALANCE
    // =====================================================

    const balance =
        totalIncome -
        totalExpense


    // =====================================================
    // SAVINGS RATE
    // =====================================================

    const savingsRate =
        totalIncome > 0
            ? (
                balance /
                totalIncome
            ) * 100
            : 0


    // =====================================================
    // TOP SPENDING CATEGORY
    // =====================================================

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


    // =====================================================
    // RETURN METRICS
    // =====================================================

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


// =====================================================
// GENERATE FINANCIAL INSIGHTS
// =====================================================

export function generateFinancialInsights(
    metrics: FinancialInsights
): FinancialInsight[] {

    const insights:
        FinancialInsight[] = []


    // =====================================================
    // NO TRANSACTIONS
    // =====================================================

    if (
        metrics.transactionCount === 0
    ) {

        return [

            {
                type: "neutral",

                title:
                    "Start tracking your finances",

                description:
                    "Add your income and expenses to start receiving personalized financial insights.",
            },

        ]
    }


    // =====================================================
    // NO INCOME
    // =====================================================

    if (
        metrics.totalIncome === 0
    ) {

        insights.push({

            type: "warning",

            title:
                "Income data is missing",

            description:
                "Add your income records so your savings rate and overall cash-flow health can be calculated accurately.",
        })
    }


    // =====================================================
    // NEGATIVE BALANCE
    // =====================================================

    if (
        metrics.balance < 0
    ) {

        insights.push({

            type: "warning",

            title:
                "Expenses exceed income",

            description:
                `You spent ₹${Math.abs(
    metrics.balance
).toLocaleString(
    "en-IN"
)} more than you earned. Consider reviewing your largest expense categories.`,
        })
    }


    // =====================================================
    // HEALTHY BALANCE
    // =====================================================

    else if (
        metrics.balance > 0
    ) {

        insights.push({

            type: "positive",

            title:
                "Positive cash flow",

            description:
                `You have ₹${metrics.balance.toLocaleString(
    "en-IN"
)} left after expenses this period.`,
        })
    }


    // =====================================================
    // SAVINGS RATE
    // =====================================================

    if (
        metrics.totalIncome > 0
    ) {

        if (
            metrics.savingsRate >= 30
        ) {

            insights.push({

                type: "positive",

                title:
                    "Excellent savings rate",

                description:
                    `You're saving ${metrics.savingsRate.toFixed(
1
)}% of your income. That's a strong savings habit.`,
})

} else if (
    metrics.savingsRate >= 20
) {

    insights.push({

        type: "positive",

        title:
            "Healthy savings rate",

        description:
            `You're saving ${metrics.savingsRate.toFixed(
                1
            )}% of your income. Keep building this habit.`,
    })

} else if (
    metrics.savingsRate >= 10
) {

    insights.push({

        type: "neutral",

        title:
            "Room to increase savings",

        description:
            `Your current savings rate is ${metrics.savingsRate.toFixed(
                1
            )}%. Consider gradually increasing the amount you save each month.`,
    })

} else {

    insights.push({

        type: "warning",

        title:
            "Low savings rate",

        description:
            `Only ${Math.max(
                0,
                metrics.savingsRate
            ).toFixed(
                1
            )}% of your income remains after expenses. Review your recurring and non-essential spending.`,
    })
}
}


// =====================================================
// TOP CATEGORY
// =====================================================

if (
    metrics.topCategory !== null &&
    metrics.topCategoryAmount > 0
) {

    const percentage =
        metrics.totalExpense > 0
            ? (
            metrics.topCategoryAmount /
            metrics.totalExpense
        ) * 100
            : 0


    if (
        percentage >= 40
    ) {

        insights.push({

            type: "warning",

            title:
                `High spending on ${metrics.topCategory}`,

            description:
                `${metrics.topCategory} accounts for ${percentage.toFixed(
                    1
                )}% of your total expenses. This may be the best category to review for potential savings.`,
        })

    } else {

        insights.push({

            type: "neutral",

            title:
                `Top category: ${metrics.topCategory}`,

            description:
                `You spent ₹${metrics.topCategoryAmount.toLocaleString(
                    "en-IN"
                )} on ${metrics.topCategory}, making it your largest spending category.`,
        })
    }
}


// =====================================================
// TRANSACTION ACTIVITY
// =====================================================

if (
    metrics.expenseCount > 0 &&
    metrics.incomeCount > 0
) {

    insights.push({

        type: "neutral",

        title:
            "Good transaction coverage",

        description:
            `You've recorded ${metrics.incomeCount} income transaction${
                metrics.incomeCount === 1
                    ? ""
                    : "s"
            } and ${metrics.expenseCount} expense transaction${
                metrics.expenseCount === 1
                    ? ""
                    : "s"
            }.`,
    })
}


// =====================================================
// FALLBACK
// =====================================================

if (
    insights.length === 0
) {

    insights.push({

        type: "neutral",

        title:
            "Keep tracking",

        description:
            "Continue recording your transactions to build a clearer picture of your financial behavior.",
    })
}


return insights
}


// =====================================================
// CONVENIENCE FUNCTION
// =====================================================

export function buildFinancialInsights(
    transactions: Transaction[]
): FinancialInsight[] {

    const metrics =
        calculateFinancialInsights(
            transactions
        )


    return generateFinancialInsights(
        metrics
    )
}