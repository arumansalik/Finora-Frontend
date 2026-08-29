import api from "./api"

export interface Transaction {
    id: number
    title: string
    amount: number
    type: "INCOME" | "EXPENSE"
    category: string
    date: string
}

export interface TransactionRequest {
    title: string
    amount: number
    type: "INCOME" | "EXPENSE"
    category: string
    date: string
}

export const getTransactions = async (): Promise<Transaction[]> => {

    const response = await api.get<Transaction[]>(
        "/transactions"
    )

    return response.data
}

export const getTransaction = async (
    id: number
): Promise<Transaction> => {

    const response = await api.get<Transaction>(
        `/transactions/${id}`
    )

    return response.data
}

export const createTransaction = async (
    transaction: TransactionRequest
): Promise<Transaction> => {

    const response = await api.post<Transaction>(
        "/transactions",
        transaction
    )

    return response.data
}

export const updateTransaction = async (
    id: number,
    transaction: TransactionRequest
): Promise<Transaction> => {

    const response = await api.put<Transaction>(
        `/transactions/${id}`,
        transaction
    )

    return response.data
}

export const deleteTransaction = async (
    id: number
): Promise<void> => {

    await api.delete(`/transactions/${id}`)
}