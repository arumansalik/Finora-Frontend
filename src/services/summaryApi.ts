import api from "./api"

export interface Summary {
    totalIncome: number
    totalExpense: number
    balance: number
}

export const getSummary = async (): Promise<Summary> => {

    const response = await api.get<Summary>(
        "/summary"
    )

    return response.data
}