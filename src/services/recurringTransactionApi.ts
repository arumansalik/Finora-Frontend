import api from "@/lib/axios"


// =====================================================
// TYPES
// =====================================================

export type RecurrenceType =
    | "DAILY"
    | "WEEKLY"
    | "MONTHLY"
    | "YEARLY"


export type TransactionType =
    | "INCOME"
    | "EXPENSE"


export interface Category {
    id: number
    name: string
}


export interface RecurringTransaction {
    id: number
    title: string
    amount: number
    type: TransactionType
    category: Category
    recurrence: RecurrenceType
    nextDate: string
    active: boolean
}


export interface RecurringTransactionRequest {
    title: string
    amount: number
    type: TransactionType
    category: string
    recurrence: RecurrenceType
    nextDate: string
}


// =====================================================
// GET ALL
// =====================================================

export async function getRecurringTransactions():

    Promise<RecurringTransaction[]> {

    const response =
        await api.get<
            RecurringTransaction[]
        >(
            "/recurring-transactions"
        )

    return response.data
}


// =====================================================
// CREATE
// =====================================================

export async function createRecurringTransaction(
    data: RecurringTransactionRequest
): Promise<RecurringTransaction> {

    const response =
        await api.post<
            RecurringTransaction
        >(
            "/recurring-transactions",
            data
        )

    return response.data
}


// =====================================================
// DELETE
// =====================================================

export async function deleteRecurringTransaction(
    id: number
): Promise<void> {

    await api.delete(
        `/recurring-transactions/${id}`
    )
}