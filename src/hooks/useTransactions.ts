import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query"

import {
    createTransaction,
    deleteTransaction,
    getTransactions,
    updateTransaction,
    type TransactionRequest,
} from "@/services/transactionApi"

import {
    queryKeys,
} from "@/lib/queryKeys"


export function useTransactions() {

    return useQuery({
        queryKey:
        queryKeys.transactions,

        queryFn:
        getTransactions,

        staleTime:
            30 * 1000,

        refetchOnWindowFocus:
            false,
    })
}


export function useCreateTransaction() {

    const queryClient =
        useQueryClient()


    return useMutation({

        mutationFn:
            (
                data: TransactionRequest
            ) =>
                createTransaction(
                    data
                ),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey:
                queryKeys.transactions,
            })

            queryClient.invalidateQueries({
                queryKey:
                queryKeys.summary,
            })

        },

    })
}


export function useUpdateTransaction() {

    const queryClient =
        useQueryClient()


    return useMutation({

        mutationFn:
            ({
                 id,
                 data,
             }: {
                id: number
                data: TransactionRequest
            }) =>
                updateTransaction(
                    id,
                    data
                ),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey:
                queryKeys.transactions,
            })

            queryClient.invalidateQueries({
                queryKey:
                queryKeys.summary,
            })

        },

    })
}


export function useDeleteTransaction() {

    const queryClient =
        useQueryClient()


    return useMutation({

        mutationFn:
        deleteTransaction,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey:
                queryKeys.transactions,
            })

            queryClient.invalidateQueries({
                queryKey:
                queryKeys.summary,
            })

        },

    })
}