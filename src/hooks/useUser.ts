import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getCurrentUser,
    updateCurrentUser,
    type UpdateUserRequest,
} from "../services/userApi";

export const userQueryKey = ["current-user"];

export function useCurrentUser() {
    return useQuery({
        queryKey: userQueryKey,
        queryFn: getCurrentUser,
    });
}

export function useUpdateCurrentUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateUserRequest) =>
            updateCurrentUser(data),

        onSuccess: (updatedUser) => {
            queryClient.setQueryData(
                userQueryKey,
                updatedUser
            );
        },
    });
}
