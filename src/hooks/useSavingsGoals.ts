import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createSavingsGoal,
    deleteSavingsGoal,
    getSavingsGoal,
    getSavingsGoals,
    updateSavingsGoal,
} from "../services/savingsGoalApi";

export const savingsGoalKeys = {
    all: ["savings-goals"] as const,

    lists: () =>
        [...savingsGoalKeys.all, "list"] as const,

    list: () =>
        [...savingsGoalKeys.lists()] as const,

    details: () =>
        [...savingsGoalKeys.all, "detail"] as const,

    detail: (id: number) =>
        [...savingsGoalKeys.details(), id] as const,
};

// =========================================================
// GET ALL
// =========================================================

export const useSavingsGoals = () => {
    return useQuery({
        queryKey: savingsGoalKeys.list(),
        queryFn: getSavingsGoals,
    });
};

// =========================================================
// GET ONE
// =========================================================

export const useSavingsGoal = (id: number) => {
    return useQuery({
        queryKey: savingsGoalKeys.detail(id),
        queryFn: () => getSavingsGoal(id),
        enabled: !!id,
    });
};

// =========================================================
// CREATE
// =========================================================

export const useCreateSavingsGoal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SavingsGoalRequest) =>
            createSavingsGoal(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: savingsGoalKeys.lists(),
            });
        },
    });
};

// =========================================================
// UPDATE
// =========================================================

export const useUpdateSavingsGoal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         id,
                         data,
                     }: {
            id: number;
            data: SavingsGoalRequest;
        }) => updateSavingsGoal(id, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: savingsGoalKeys.lists(),
            });

            queryClient.invalidateQueries({
                queryKey: savingsGoalKeys.detail(variables.id),
            });
        },
    });
};

// =========================================================
// DELETE
// =========================================================

export const useDeleteSavingsGoal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            deleteSavingsGoal(id),

        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: savingsGoalKeys.lists(),
            });

            queryClient.removeQueries({
                queryKey: savingsGoalKeys.detail(id),
            });
        },
    });
};