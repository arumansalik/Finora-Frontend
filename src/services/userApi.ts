import api from "../lib/axios";

export interface UserProfile {
    id: number;
    name: string;
    email: string;
}

export interface UpdateUserRequest {
    name: string;
    email: string;
}

export const getCurrentUser = async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>("/users/me");
    return response.data;
};

export const updateCurrentUser = async (
    data: UpdateUserRequest
): Promise<UserProfile> => {
    const response = await api.put<UserProfile>("/users/me", data);
    return response.data;
};