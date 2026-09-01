import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query"

import {
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    type Budget,
    type BudgetRequest,
} from "@/services/budgetApi"

import {
    queryKeys,
} from "@/lib/queryKeys"


// =====================================================
// GET BUDGETS
// =====================================================

export const useBudgets = (
    month: number,
    year: number
) => {

    return useQuery<Budget[]>({
        queryKey:
            queryKeys.budgets(
                month,
                year
            ),

        queryFn:
            () =>
                getBudgets(
                    month,
                    year
                ),

        staleTime:
            30 * 1000,

        refetchOnWindowFocus:
            false,
    })
}


// =====================================================
// CREATE BUDGET
// =====================================================

export const useCreateBudget = () => {

    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn:
            (data: BudgetRequest) =>
                createBudget(data),

        onSuccess: async () => {

            await queryClient.invalidateQueries({
                queryKey: ["budgets"],
            })
        },
    })
}


// =====================================================
// UPDATE BUDGET
// =====================================================

export const useUpdateBudget = () => {

    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn:
            ({
                 id,
                 data,
             }: {
                id: number
                data: BudgetRequest
            }) =>
                updateBudget(
                    id,
                    data
                ),

        onSuccess: async () => {

            await queryClient.invalidateQueries({
                queryKey: ["budgets"],
            })
        },
    })
}


// =====================================================
// DELETE BUDGET
// =====================================================

export const useDeleteBudget = () => {

    const queryClient =
        useQueryClient()

    return useMutation({
        mutationFn:
            (id: number) =>
                deleteBudget(id),

        onSuccess: async () => {

            await queryClient.invalidateQueries({
                queryKey: ["budgets"],
            })
        },
    })
}