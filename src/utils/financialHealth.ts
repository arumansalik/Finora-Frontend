export function calculateFinancialHealth(
    income: number,
    expense: number
) {

    if (income <= 0) {

        return {
            score: 0,
            label: "No income data",
        }
    }


    const savingsRate =
        (
            (income - expense) /
            income
        ) *
        100


    let score = 0


    if (
        savingsRate >= 50
    ) {

        score = 95

    } else if (
        savingsRate >= 30
    ) {

        score = 85

    } else if (
        savingsRate >= 20
    ) {

        score = 75

    } else if (
        savingsRate >= 10
    ) {

        score = 60

    } else if (
        savingsRate >= 0
    ) {

        score = 45

    } else {

        score = 25
    }


    let label = "Needs attention"


    if (
        score >= 85
    ) {

        label =
            "Excellent"

    } else if (
        score >= 70
    ) {

        label =
            "Healthy"

    } else if (
        score >= 50
    ) {

        label =
            "Moderate"
    }


    return {
        score,
        label,
    }
}