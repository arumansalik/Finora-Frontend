import type { Transaction } from "@/services/transactionApi"


export interface MonthlyChartData {
    month: string
    income: number
    expense: number
}


export interface CategoryChartData {
    name: string
    value: number
}


const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
]


export function buildMonthlyChartData(
    transactions: Transaction[],
    year: number
): MonthlyChartData[] {

    return monthNames.map(
        (month, index) => {

            const monthTransactions =
                transactions.filter(
                    transaction => {

                        const date =
                            new Date(
                                `${transaction.date}T00:00:00`
                            )

                        return (
                            date.getFullYear() ===
                            year &&
                            date.getMonth() ===
                            index
                        )
                    }
                )


            const income =
                monthTransactions
                    .filter(
                        transaction =>
                            transaction.type ===
                            "INCOME"
                    )
                    .reduce(
                        (
                            total,
                            transaction
                        ) =>
                            total +
                            Math.abs(
                                transaction.amount
                            ),
                        0
                    )


            const expense =
                monthTransactions
                    .filter(
                        transaction =>
                            transaction.type ===
                            "EXPENSE"
                    )
                    .reduce(
                        (
                            total,
                            transaction
                        ) =>
                            total +
                            Math.abs(
                                transaction.amount
                            ),
                        0
                    )


            return {
                month,
                income,
                expense,
            }
        }
    )
}


export function buildCategoryChartData(
    transactions: Transaction[],
    year: number,
    month?: number
): CategoryChartData[] {

    const filtered =
        transactions.filter(
            transaction => {

                const date =
                    new Date(
                        `${transaction.date}T00:00:00`
                    )

                const matchesYear =
                    date.getFullYear() ===
                    year

                const matchesMonth =
                    month === undefined ||
                    date.getMonth() ===
                    month

                return (
                    matchesYear &&
                    matchesMonth &&
                    transaction.type ===
                    "EXPENSE"
                )
            }
        )


    const categoryMap =
        new Map<
            string,
            number
        >()


    filtered.forEach(
        transaction => {

            const category =
                transaction.category ??
                "Uncategorized"


            const amount =
                Math.abs(
                    transaction.amount
                )


            categoryMap.set(
                category,
                (
                    categoryMap.get(
                        category
                    ) ?? 0
                ) + amount
            )
        }
    )


    return Array.from(
        categoryMap.entries()
    )
        .map(
            ([name, value]) => ({
                name,
                value,
            })
        )
        .sort(
            (a, b) =>
                b.value -
                a.value
        )
}