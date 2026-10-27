import api from "../lib/axios.ts";

export interface UserPreferences {
    id: number;
    currency: string;
    dateFormat: string;
    defaultTransactionType: "INCOME" | "EXPENSE";
    budgetAlerts: boolean;
    savingsAlerts: boolean;
    insightAlerts: boolean;
    emailNotifications: boolean;
}

export interface UpdateUserPreferencesRequest {
    currency: string;
    dateFormat: string;
    defaultTransactionType: "INCOME" | "EXPENSE";
    budgetAlerts: boolean;
    savingsAlerts: boolean;
    insightAlerts: boolean;
    emailNotifications: boolean;
}

export const getUserPreferences = async (): Promise<UserPreferences> => {
    const response = await api.get<UserPreferences>(
        "/users/me/preferences"
    );

    return response.data;
};

export const updateUserPreferences = async (
    data: UpdateUserPreferencesRequest
): Promise<UserPreferences> => {
    const response = await api.put<UserPreferences>(
        "/users/me/preferences",
        data
    );

    return response.data;
};