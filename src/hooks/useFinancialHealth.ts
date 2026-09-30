import { useQuery } from "@tanstack/react-query";
import { getFinancialHealth } from "../services/financialHealthApi";

export const financialHealthKeys = {
    all: ["financial-health"] as const,
};

export const useFinancialHealth = () => {
    return useQuery({
        queryKey: financialHealthKeys.all,
        queryFn: getFinancialHealth,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: true,
    });
};