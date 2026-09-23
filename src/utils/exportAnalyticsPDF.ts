import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import type {
    AnalyticsResponse,
} from "@/services/analyticsApi"


function formatCurrency(
    value: number
): string {

    return `Rs. ${value.toLocaleString(
        "en-IN"
    )}`
}


export function exportAnalyticsPDF(
    analytics: AnalyticsResponse,
    month: number,
    year: number,
    insights: string[] = []
) {

    const doc =
        new jsPDF()


    const monthName =
        new Date(
            year,
            month - 1,
            1
        ).toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric",
            }
        )


    // =====================================================
    // HEADER
    // =====================================================

    doc.setFontSize(22)

    doc.setFont(
        "helvetica",
        "bold"
    )

    doc.text(
        "Expense Tracker",
        20,
        22
    )


    doc.setFontSize(11)

    doc.setFont(
        "helvetica",
        "normal"
    )

    doc.text(
        "Monthly Financial Report",
        20,
        30
    )


    doc.setFontSize(12)

    doc.text(
        monthName,
        190,
        30,
        {
            align: "right",
        }
    )


    // =====================================================
    // SUMMARY
    // =====================================================

    autoTable(doc, {

        startY: 42,

        head: [
            [
                "Income",
                "Expenses",
                "Savings",
                "Savings Rate",
            ],
        ],

        body: [
            [
                formatCurrency(
                    analytics.income
                ),

                formatCurrency(
                    analytics.expense
                ),

                formatCurrency(
                    analytics.savings
                ),

                `${analytics.savingsRate.toFixed(
                    1
                )}%`,
            ],
        ],

        theme: "grid",

        styles: {
            fontSize: 10,
            cellPadding: 5,
        },

    })


    // =====================================================
    // MONTH COMPARISON
    // =====================================================

    const comparisonStart =
        (
            doc as unknown as {
                lastAutoTable: {
                    finalY: number
                }
            }
        ).lastAutoTable.finalY + 12


    doc.setFontSize(14)

    doc.setFont(
        "helvetica",
        "bold"
    )

    doc.text(
        "Month Comparison",
        20,
        comparisonStart
    )


    autoTable(doc, {

        startY:
            comparisonStart + 5,

        head: [
            [
                "Metric",
                "Current",
                "Previous",
                "Change",
            ],
        ],

        body: [

            [
                "Income",

                formatCurrency(
                    analytics.income
                ),

                formatCurrency(
                    analytics.previousMonthIncome
                ),

                `${analytics.incomeChange.toFixed(
                    1
                )}%`,
            ],

            [
                "Expenses",

                formatCurrency(
                    analytics.expense
                ),

                formatCurrency(
                    analytics.previousMonthExpense
                ),

                `${analytics.expenseChange.toFixed(
                    1
                )}%`,
            ],

        ],

        theme: "grid",

        styles: {
            fontSize: 9,
            cellPadding: 4,
        },

    })


    // =====================================================
    // CATEGORY BREAKDOWN
    // =====================================================

    const categoryStart =
        (
            doc as unknown as {
                lastAutoTable: {
                    finalY: number
                }
            }
        ).lastAutoTable.finalY + 12


    doc.setFontSize(14)

    doc.setFont(
        "helvetica",
        "bold"
    )

    doc.text(
        "Category Breakdown",
        20,
        categoryStart
    )


    autoTable(doc, {

        startY:
            categoryStart + 5,

        head: [
            [
                "Category",
                "Amount",
                "Percentage",
            ],
        ],

        body:
            analytics.categoryBreakdown.map(
                category => [

                    category.category,

                    formatCurrency(
                        category.amount
                    ),

                    `${category.percentage.toFixed(
                        1
                    )}%`,
                ]
            ),

        theme: "striped",

        styles: {
            fontSize: 9,
            cellPadding: 4,
        },

    })


    // =====================================================
    // MONTHLY TREND
    // =====================================================

    const trendStart =
        (
            doc as unknown as {
                lastAutoTable: {
                    finalY: number
                }
            }
        ).lastAutoTable.finalY + 12


    if (
        trendStart > 250
    ) {

        doc.addPage()

        doc.setFontSize(14)

        doc.setFont(
            "helvetica",
            "bold"
        )

        doc.text(
            "Monthly Trend",
            20,
            20
        )

        autoTable(doc, {

            startY: 27,

            head: [
                [
                    "Month",
                    "Income",
                    "Expenses",
                    "Savings",
                ],
            ],

            body:
                analytics.monthlyTrend.map(
                    data => [

                        data.month,

                        formatCurrency(
                            data.income
                        ),

                        formatCurrency(
                            data.expense
                        ),

                        formatCurrency(
                            data.savings
                        ),

                    ]
                ),

            theme: "grid",

            styles: {
                fontSize: 9,
                cellPadding: 4,
            },

        })

    } else {

        doc.setFontSize(14)

        doc.setFont(
            "helvetica",
            "bold"
        )

        doc.text(
            "Monthly Trend",
            20,
            trendStart
        )

        autoTable(doc, {

            startY:
                trendStart + 5,

            head: [
                [
                    "Month",
                    "Income",
                    "Expenses",
                    "Savings",
                ],
            ],

            body:
                analytics.monthlyTrend.map(
                    data => [

                        data.month,

                        formatCurrency(
                            data.income
                        ),

                        formatCurrency(
                            data.expense
                        ),

                        formatCurrency(
                            data.savings
                        ),

                    ]
                ),

            theme: "grid",

            styles: {
                fontSize: 9,
                cellPadding: 4,
            },

        })

    }


    // =====================================================
    // INSIGHTS
    // =====================================================

    let finalY =
        (
            doc as unknown as {
                lastAutoTable: {
                    finalY: number
                }
            }
        ).lastAutoTable.finalY


    if (
        insights.length > 0
    ) {

        if (
            finalY > 245
        ) {

            doc.addPage()

            finalY = 20

        } else {

            finalY += 12

        }


        doc.setFontSize(14)

        doc.setFont(
            "helvetica",
            "bold"
        )

        doc.text(
            "Financial Insights",
            20,
            finalY
        )


        doc.setFontSize(10)

        doc.setFont(
            "helvetica",
            "normal"
        )


        insights.forEach(
            (insight, index) => {

                doc.text(
                    `• ${insight}`,
                    25,
                    finalY +
                    8 +
                    index * 7
                )

            }
        )

    }


    // =====================================================
    // FOOTER
    // =====================================================

    const pageCount =
        doc.getNumberOfPages()


    for (
        let page = 1;
        page <= pageCount;
        page++
    ) {

        doc.setPage(
            page
        )

        doc.setFontSize(8)

        doc.setFont(
            "helvetica",
            "normal"
        )

        doc.text(
            `Expense Tracker • ${monthName}`,
            20,
            290
        )

        doc.text(
            `Page ${page} of ${pageCount}`,
            190,
            290,
            {
                align: "right",
            }
        )

    }


    // =====================================================
    // SAVE
    // =====================================================

    doc.save(
        `financial-report-${year}-${String(
            month
        ).padStart(
            2,
            "0"
        )}.pdf`
    )
}