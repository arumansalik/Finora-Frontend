export interface FinancialHealth {
    score: number
    label: string
}


export function calculateFinancialHealth(
    savingsRate: number,
    expenseChange: number,
    budgetPercentage: number
): FinancialHealth {

    let score = 50


    // Savings rate

    if (savingsRate >= 30) {

        score += 25

    } else if (savingsRate >= 20) {

        score += 18

    } else if (savingsRate >= 10) {

        score += 10

    } else if (savingsRate < 0) {

        score -= 20
    }


    // Expense trend

    if (expenseChange < 0) {

        score += 10

    } else if (expenseChange > 20) {

        score -= 10
    }


    // Budget usage

    if (budgetPercentage <= 70) {

        score += 15

    } else if (budgetPercentage <= 85) {

        score += 8

    } else if (
        budgetPercentage >= 100
    ) {

        score -= 20
    }


    score = Math.max(
        0,
        Math.min(
            100,
            score
        )
    )


    let label =
        "Needs attention"


    if (score >= 85) {

        label =
            "Excellent"

    } else if (score >= 70) {

        label =
            "Healthy"

    } else if (score >= 50) {

        label =
            "Fair"
    }


    return {
        score,
        label,
    }
}