import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getUserPreferences,
    updateUserPreferences,
    type UpdateUserPreferencesRequest,
} from "../services/preferencesApi";

export const preferencesQueryKey = ["user-preferences"];

export function useUserPreferences() {
    return useQuery({
        queryKey: preferencesQueryKey,
        queryFn: getUserPreferences,
    });
}

export function useUpdateUserPreferences() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            data: UpdateUserPreferencesRequest
        ) => updateUserPreferences(data),

        onSuccess: (updatedPreferences) => {
            queryClient.setQueryData(
                preferencesQueryKey,
                updatedPreferences
            );
        },
    });
}