import {
    ArrowDownRight,
    ArrowUpRight,
    Info,
    PiggyBank,
    Wallet,
} from "lucide-react";

import { useFinancialHealth } from "../../hooks/useFinancialHealth";
import FinancialHealthGauge from "./FinancialHealthGauge";
import HealthFactorCard from "./HealthFactorCard";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);

export default function FinancialHealth() {
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useFinancialHealth();

    if (isLoading) {
        return (
            <section className="animate-pulse space-y-5">
                <div className="h-6 w-48 rounded bg-white/[0.06]" />

                <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
                    <div className="h-[330px] rounded-3xl bg-white/[0.04]" />

                    <div className="grid gap-4 sm:grid-cols-2">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-36 rounded-2xl bg-white/[0.04]"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError || !data) {
        return (
            <section className="rounded-3xl border border-rose-400/10 bg-rose-400/[0.03] p-6">
                <p className="text-sm text-zinc-400">
                    Unable to load your financial health score.
                </p>

                <button
                    onClick={() => refetch()}
                    className="mt-3 text-sm font-medium text-violet-400 hover:text-violet-300"
                >
                    Try again
                </button>
            </section>
        );
    }

    const spendingIncreasing =
        data.spendingChangePercentage > 0;

    return (
        <section className="space-y-5">

            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-400/10">
                            <Wallet className="h-4 w-4 text-violet-400" />
                        </div>

                        <h2 className="text-lg font-semibold text-white">
                            Financial Health
                        </h2>
                    </div>

                    <p className="mt-1 text-sm text-zinc-500">
                        A transparent view of your current financial position.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Info className="h-3.5 w-3.5" />
                    Updated from your latest transactions
                </div>
            </div>

            {/* Main section */}
            <div className="grid gap-5 xl:grid-cols-[360px_1fr]">

                {/* Score */}
                <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-violet-500/[0.10] via-white/[0.025] to-white/[0.02] p-6">

                    <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

                    <div className="relative">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                            Overall Score
                        </p>

                        <div className="mt-3">
                            <FinancialHealthGauge
                                score={data.score}
                                status={data.status}
                            />
                        </div>

                        <p className="mx-auto mt-2 max-w-xs text-center text-sm leading-6 text-zinc-400">
                            {data.summary}
                        </p>
                    </div>
                </div>

                {/* Factors */}
                <div className="grid gap-4 sm:grid-cols-2">
                    {data.factors.map((factor) => (
                        <HealthFactorCard
                            key={factor.key}
                            title={factor.title}
                            description={factor.description}
                            score={factor.score}
                            maxScore={factor.maxScore}
                            status={factor.status}
                        />
                    ))}
                </div>
            </div>

            {/* Financial metrics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {/* Income */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Wallet className="h-4 w-4 text-emerald-400" />
                        Monthly Income
                    </div>

                    <p className="mt-3 text-xl font-semibold text-white">
                        {formatCurrency(data.monthlyIncome)}
                    </p>
                </div>

                {/* Expenses */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Wallet className="h-4 w-4 text-rose-400" />
                        Monthly Expenses
                    </div>

                    <p className="mt-3 text-xl font-semibold text-white">
                        {formatCurrency(data.monthlyExpenses)}
                    </p>
                </div>

                {/* Savings */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <PiggyBank className="h-4 w-4 text-violet-400" />
                        Savings Rate
                    </div>

                    <p className="mt-3 text-xl font-semibold text-white">
                        {data.savingsRate.toFixed(1)}%
                    </p>
                </div>

                {/* Spending */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        {spendingIncreasing ? (
                            <ArrowUpRight className="h-4 w-4 text-rose-400" />
                        ) : (
                            <ArrowDownRight className="h-4 w-4 text-emerald-400" />
                        )}

                        Spending Trend
                    </div>

                    <p
                        className={`mt-3 text-xl font-semibold ${
                            spendingIncreasing
                                ? "text-rose-400"
                                : "text-emerald-400"
                        }`}
                    >
                        {spendingIncreasing ? "+" : ""}
                        {data.spendingChangePercentage.toFixed(1)}%
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                        vs previous month
                    </p>
                </div>
            </div>

            {/* Score explanation */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="flex items-start gap-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />

                    <div>
                        <h3 className="text-sm font-medium text-white">
                            How your score works
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-zinc-500">
                            Your score combines budget adherence,
                            savings progress, income versus expenses,
                            and your month-over-month spending trend.
                            Each factor has a defined weight, so you can
                            see exactly what is influencing your score.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}