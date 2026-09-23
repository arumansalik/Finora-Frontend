// src/utils/exportAnalytics.ts

interface MonthlyAnalytics {
    month: string
    income: number
    expense: number
    savings?: number
}

interface CategoryAnalytics {
    category: string
    amount: number
    percentage: number
}

interface AnalyticsData {
    income?: number
    expense?: number
    savings?: number
    savingsRate?: number
    categoryBreakdown?: CategoryAnalytics[]
    monthlyTrend?: MonthlyAnalytics[]
}

const escapeCSV = (
    value: unknown
): string => {
    const stringValue =
        String(value ?? "")

    if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
    ) {
        return `"${stringValue.replace(
            /"/g,
            '""'
        )}"`
    }

    return stringValue
}

export function exportAnalyticsCSV(
    analytics: AnalyticsData,
    month: number,
    year: number
): void {

    const income =
        Number(analytics.income) || 0

    const expense =
        Number(analytics.expense) || 0

    const savings =
        Number(analytics.savings) || 0

    const savingsRate =
        Number(analytics.savingsRate) || 0

    const categoryBreakdown =
        analytics.categoryBreakdown ?? []

    const monthlyTrend =
        analytics.monthlyTrend ?? []

    const rows: string[][] = [
        ["Expense Tracker Analytics"],
        ["Month", `${month}/${year}`],
        [],
        ["SUMMARY"],
        ["Income", String(income)],
        ["Expenses", String(expense)],
        ["Savings", String(savings)],
        ["Savings Rate", String(savingsRate)],
        [],
        ["CATEGORY BREAKDOWN"],
        [
            "Category",
            "Amount",
            "Percentage",
        ],
    ]

    categoryBreakdown.forEach(
        (category) => {
            rows.push([
                category.category,
                String(
                    Number(
                        category.amount
                    ) || 0
                ),
                String(
                    Number(
                        category.percentage
                    ) || 0
                ),
            ])
        }
    )

    rows.push([])

    rows.push([
        "MONTHLY TREND",
    ])

    rows.push([
        "Month",
        "Income",
        "Expense",
        "Savings",
    ])

    monthlyTrend.forEach(
        (item) => {

            const itemIncome =
                Number(item.income) || 0

            const itemExpense =
                Number(item.expense) || 0

            const itemSavings =
                item.savings !== undefined
                    ? Number(
                    item.savings
                ) || 0
                    : itemIncome -
                    itemExpense

            rows.push([
                item.month,
                String(itemIncome),
                String(itemExpense),
                String(itemSavings),
            ])
        }
    )

    const csvContent =
        "\uFEFF" +
        rows
            .map(
                (row) =>
                    row
                        .map(escapeCSV)
                        .join(",")
            )
            .join("\r\n")

    const blob =
        new Blob(
            [csvContent],
            {
                type:
                    "text/csv;charset=utf-8;",
            }
        )

    const url =
        URL.createObjectURL(blob)

    const link =
        document.createElement("a")

    link.href = url

    link.download =
        `financial-report-${year}-${String(
            month
        ).padStart(2, "0")}.csv`

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(url)
}