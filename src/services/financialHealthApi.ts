import api from "../lib/axios";

export type HealthStatus =
    | "EXCELLENT"
    | "GOOD"
    | "FAIR"
    | "NEEDS_ATTENTION";

export interface HealthFactor {
    key: string;
    title: string;
    description: string;
    score: number;
    maxScore: number;
    status: "GOOD" | "FAIR" | "NEEDS_ATTENTION";
}

export interface FinancialHealth {
    score: number;
    status: HealthStatus;
    summary: string;

    budgetScore: number;
    savingsScore: number;
    cashFlowScore: number;
    spendingTrendScore: number;

    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
    budgetUsagePercentage: number;
    spendingChangePercentage: number;

    factors: HealthFactor[];
}

export const getFinancialHealth =
    async (): Promise<FinancialHealth> => {
        const response =
            await api.get<FinancialHealth>(
                "/financial-health"
            );

        return response.data;
    };