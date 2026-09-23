import api from "@/lib/axios"

// =====================================================
// API URL
// =====================================================

const API_URL = "/transactions"


// =====================================================
// TYPES
// =====================================================

export interface Category {
    id: number
    name: string
}


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


// =====================================================
// GET ALL TRANSACTIONS
// =====================================================

export const getTransactions =
    async (): Promise<Transaction[]> => {

        const response =
            await api.get<Transaction[]>(
                API_URL
            )

        return response.data
    }


// =====================================================
// GET ONE TRANSACTION
// =====================================================

export const getTransaction =
    async (
        id: number
    ): Promise<Transaction> => {

        const response =
            await api.get<Transaction>(
                `${API_URL}/${id}`
)

return response.data
}


// =====================================================
// CREATE TRANSACTION
// =====================================================

export const createTransaction =
    async (
        transaction: TransactionRequest
    ): Promise<Transaction> => {

        const response =
            await api.post<Transaction>(
                API_URL,
                transaction
            )

        return response.data
    }


// =====================================================
// UPDATE TRANSACTION
// =====================================================

export const updateTransaction =
    async (
        id: number,
        transaction: TransactionRequest
    ): Promise<Transaction> => {

        const response =
            await api.put<Transaction>(
                `${API_URL}/${id}`,
                transaction
            )

        return response.data
    }


// =====================================================
// DELETE TRANSACTION
// =====================================================

export const deleteTransaction =
    async (
        id: number
    ): Promise<void> => {

        await api.delete(
            `${API_URL}/${id}`
        )
    }