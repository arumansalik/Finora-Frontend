import { useQuery } from "@tanstack/react-query";
import { getFinancialInsights } from "../services/financialInsightApi";

export const financialInsightKeys = {
    all: ["financial-insights"] as const,
};

export const useFinancialInsights = () => {

    return useQuery({
        queryKey: financialInsightKeys.all,
        queryFn: getFinancialInsights,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: true,
    });
};