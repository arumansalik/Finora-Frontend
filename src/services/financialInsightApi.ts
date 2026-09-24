import api from "../lib/axios";

export type InsightSeverity =
    | "INFO"
    | "WARNING"
    | "SUCCESS";

export interface FinancialInsight {
    type: string;
    title: string;
    message: string;
    severity: InsightSeverity;
    amount: number;
    percentage: number;
}

export const getFinancialInsights =
    async (): Promise<FinancialInsight[]> => {

        const response =
            await api.get<FinancialInsight[]>(
                "/insights"
            );

        return response.data;
    };