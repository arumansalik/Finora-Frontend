export const queryKeys = {
    transactions: ["transactions"] as const,

    transaction: (id: number) =>
        ["transactions", id] as const,

    summary: ["summary"] as const,

    categories: ["categories"] as const,

    budgets: (
        month: number,
        year: number
    ) =>
        ["budgets", month, year] as const,

    recurringTransactions:
        ["recurring-transactions"] as const,

    analytics: (
        year: number,
        month: number
    ) =>
        ["analytics", year, month] as const,
}