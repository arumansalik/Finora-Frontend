import type {
    AnalyticsResponse,
} from "@/services/analyticsApi"

export interface FinancialInsight {
    type:
        | "positive"
        | "warning"
        | "neutral"

    title: string

    description: string
}


// =====================================================
// GENERATE FINANCIAL INSIGHTS
// =====================================================

export function generateFinancialInsights(
    analytics: AnalyticsResponse
): FinancialInsight[] {

    const insights: FinancialInsight[] = []


    const savingsRate =
        Number(
            analytics.savingsRate
        ) || 0

    const expenseChange =
        Number(
            analytics.expenseChange
        ) || 0

    const savings =
        Number(
            analytics.savings
        ) || 0

    const expense =
        Number(
            analytics.expense
        ) || 0


    // =====================================================
    // SAVINGS
    // =====================================================

    if (savingsRate >= 30) {

        insights.push({
            type: "positive",

            title:
                "Strong savings rate",

            description:
                `You saved ${savingsRate.toFixed(
                    1
                )}% of your income this month.`,
        })

    } else if (savingsRate >= 15) {

        insights.push({
            type: "neutral",

            title:
                "Healthy savings",

            description:
                `Your savings rate is ${savingsRate.toFixed(
                    1
                )}% this month.`,
        })

    } else if (savingsRate >= 0) {

        insights.push({
            type: "warning",

            title:
                "Savings need attention",

            description:
                `Your current savings rate is ${savingsRate.toFixed(
                    1
                )}%. Consider reviewing discretionary spending.`,
        })

    } else {

        insights.push({
            type: "warning",

            title:
                "Expenses exceed income",

            description:
                `Your expenses are ₹${Math.abs(
                    savings
                ).toLocaleString(
                    "en-IN"
                )} higher than your income this month.`,
        })
    }


    // =====================================================
    // EXPENSE TREND
    // =====================================================

    if (expenseChange < -5) {

        insights.push({
            type: "positive",

            title:
                "Spending decreased",

            description:
                `Your expenses decreased by ${Math.abs(
                    expenseChange
                ).toFixed(
                    1
                )}% compared with the previous month.`,
        })

    } else if (expenseChange > 10) {

        insights.push({
            type: "warning",

            title:
                "Spending increased",

            description:
                `Your expenses increased by ${expenseChange.toFixed(
                    1
                )}% compared with the previous month.`,
        })

    } else {

        insights.push({
            type: "neutral",

            title:
                "Spending is stable",

            description:
                "Your spending has remained relatively stable compared with the previous month.",
        })
    }


    // =====================================================
    // TOP CATEGORY
    // =====================================================

    if (
        analytics.topCategory
    ) {

        const topCategory =
            analytics.topCategory

        const topCategoryData =
            analytics.categoryBreakdown?.find(
                category =>
                    category.category ===
                    topCategory
            )

        const percentage =
            Number(
                topCategoryData?.percentage
            ) || 0


        if (percentage >= 40) {

            insights.push({
                type: "warning",

                title:
                    `High spending on ${topCategory}`,

                description:
                    `${topCategory} represents ${percentage.toFixed(
                        1
                    )}% of your expenses. This may be the best category to review.`,
            })

        } else {

            insights.push({
                type: "neutral",

                title:
                    "Largest spending category",

                description:
                    `${topCategory} is currently your largest expense category.`,
            })
        }
    }


    // =====================================================
    // NO EXPENSES
    // =====================================================

    if (
        expense === 0
    ) {

        insights.push({
            type: "neutral",

            title:
                "No expenses recorded",

            description:
                "There are no recorded expenses for this month yet.",
        })
    }


    // =====================================================
    // LIMIT INSIGHTS
    // =====================================================

    return insights.slice(
        0,
        4
    )
}