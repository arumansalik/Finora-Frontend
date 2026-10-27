export type SupportedCurrency = "INR" | "USD" | "EUR" | "GBP";

const currencyLocales: Record<SupportedCurrency, string> = {
    INR: "en-IN",
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
};

export function formatCurrency(
    amount: number | string | null | undefined,
    currency: string = "INR"
): string {
    const numericAmount = Number(amount ?? 0);

    const supportedCurrency: SupportedCurrency =
        currency in currencyLocales
            ? (currency as SupportedCurrency)
            : "INR";

    return new Intl.NumberFormat(
        currencyLocales[supportedCurrency],
        {
            style: "currency",
            currency: supportedCurrency,
            maximumFractionDigits: 2,
        }
    ).format(Number.isFinite(numericAmount) ? numericAmount : 0);
}555555555555555555555