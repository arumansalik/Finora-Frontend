import api from "../lib/axios";

export interface SavingsGoal {
    id: number;
    name: string;

    targetAmount: number;
    currentAmount: number;

    remaining: number;
    percentage: number;

    targetDate: string;

    daysRemaining: number;

    requiredPerDay: number;
    requiredPerMonth: number;

    status: "COMPLETED" | "OVERDUE" | "DUE_SOON" | "ON_TRACK";

    createdAt: string;
    updatedAt: string;
}

export interface SavingsGoalRequest {
    name: string;
    targetAmount: number;
    currentAmount?: number;
    targetDate: string;
}

// GET ALL
export const getSavingsGoals = async (): Promise<SavingsGoal[]> => {
    const response = await api.get<SavingsGoal[]>("/savings-goals");

    return response.data;
};

// GET ONE
export const getSavingsGoal = async (
    id: number
): Promise<SavingsGoal> => {
    const response = await api.get<SavingsGoal>(
        `/savings-goals/${id}`
    );

    return response.data;
};

// CREATE
export const createSavingsGoal = async (
    data: SavingsGoalRequest
): Promise<SavingsGoal> => {
    const response = await api.post<SavingsGoal>(
        "/savings-goals",
        data
    );

    return response.data;
};

// UPDATE
export const updateSavingsGoal = async (
    id: number,
    data: SavingsGoalRequest
): Promise<SavingsGoal> => {
    const response = await api.put<SavingsGoal>(
        `/savings-goals/${id}`,
        data
    );

    return response.data;
};

// DELETE
export const deleteSavingsGoal = async (
    id: number
): Promise<void> => {
    await api.delete(`/savings-goals/${id}`);
};