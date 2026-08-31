import api from "@/lib/axios"


// =====================================================
// TYPES
// =====================================================

export interface Category {
    id: number
    name: string
}


export interface Budget {
    id: number

    category: Category

    budget: number

    spent: number

    remaining: number

    percentage: number

    month: number

    year: number
}


export interface BudgetRequest {
    amount: number

    categoryId: number

    month: number

    year: number
}


// =====================================================
// GET BUDGETS
// =====================================================

export async function getBudgets(
    month: number,
    year: number
): Promise<Budget[]> {

    const response =
        await api.get<Budget[]>(
            "/budgets",
            {
                params: {
                    month,
                    year,
                },
            }
        )

    return response.data
}


// =====================================================
// GET ONE
// =====================================================

export async function getBudget(
    id: number
): Promise<Budget> {

    const response =
        await api.get<Budget>(
            `/budgets/${id}`
        )

    return response.data
}


// =====================================================
// CREATE
// =====================================================

export async function createBudget(
    data: BudgetRequest
): Promise<Budget> {

    const response =
        await api.post<Budget>(
            "/budgets",
            data
        )

    return response.data
}


// =====================================================
// UPDATE
// =====================================================

export async function updateBudget(
    id: number,
    data: BudgetRequest
): Promise<Budget> {

    const response =
        await api.put<Budget>(
            `/budgets/${id}`,
            data
        )

    return response.data
}


// =====================================================
// DELETE
// =====================================================

export async function deleteBudget(
    id: number
): Promise<void> {

    await api.delete(
        `/budgets/${id}`
    )
}