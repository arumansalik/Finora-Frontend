import { useUserPreferences } from "./usePreferences";
import {
    formatCurrency,
    type SupportedCurrency,
} from "../utils/currency";

export function useCurrency() {
    const { data: preferences } = useUserPreferences();

    const currency =
        (preferences?.currency as SupportedCurrency) || "INR";

    return {
        currency,

        formatCurrency: (
            amount: number | string | null | undefined
        ) => formatCurrency(amount, currency),
    };
}