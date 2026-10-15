
import {
    ArrowLeft,
    CalendarDays,
    Info,
    RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useFinancialHealth } from "../hooks/useFinancialHealth";
import FinancialHealthGauge from "../component/health/FinancialHealthGauge";
import HealthFactorCard from "../component/health/HealthFactorCard";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);

const pageClass =
    "min-h-full w-full overflow-x-hidden bg-[#08090d] px-4 py-6 text-white sm:px-6 lg:px-8 xl:px-10";

const containerClass =
    "mx-auto w-full max-w-[1500px] space-y-6 pb-8";

const cardClass =
    "rounded-2xl border border-white/10 bg-[#0d0f15] p-5 sm:p-6";

export default function FinancialHealth() {
    const navigate = useNavigate();

    const {
        data,
        isLoading,
        isError,
        refetch,
        isFetching,
    } = useFinancialHealth();

    if (isLoading) {
        return (
            <div className={pageClass}>
                <div className={containerClass}>
                    <div className={`${cardClass} space-y-4`}>
                        <div className="h-7 w-56 animate-pulse rounded-lg bg-white/[0.06]" />
                        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-white/[0.04]" />
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
                        <div className="h-[400px] animate-pulse rounded-2xl border border-white/10 bg-[#0d0f15]" />

                        <div className="grid gap-4 sm:grid-cols-2">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="h-44 animate-pulse rounded-xl border border-white/10 bg-[#0d0f15]"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-36 animate-pulse rounded-xl border border-white/10 bg-[#0d0f15]"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className={pageClass}>
                <div className={`${containerClass} flex min-h-[60vh] items-center justify-center`}>
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0f15] p-6 text-center sm:p-8">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10">
                            <Info className="h-5 w-5 text-rose-400" />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-white">
                            Unable to load financial health
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-zinc-500">
                            We couldn't retrieve your financial health
                            information. Please try again.
                        </p>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={pageClass}>
            <div className={containerClass}>
                {/* Page header */}
                <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0d0f15] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="mb-4 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-white"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to dashboard
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                                <span className="text-lg text-violet-400">
                                    ✦
                                </span>
                            </div>

                            <div className="min-w-0">
                                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                    Financial Health
                                </h1>

                                <p className="mt-1 text-sm leading-6 text-zinc-500">
                                    Understand the factors shaping your
                                    financial position.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                isFetching ? "animate-spin" : ""
                            }`}
                        />
                        {isFetching ? "Refreshing..." : "Refresh"}
                    </button>
                </section>

                {/* Score overview and key metrics */}
                <section className="grid min-w-0 gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
                    {/* Overall health score */}
                    <div className="relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f15] p-5 sm:p-6">
                        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/[0.08] blur-3xl" />

                        <div className="relative">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                                        Overall health
                                    </p>

                                    <p className="mt-1 text-sm text-zinc-400">
                                        Current financial score
                                    </p>
                                </div>

                                <CalendarDays className="h-5 w-5 shrink-0 text-zinc-500" />
                            </div>

                            <div className="mt-5 min-w-0">
                                <FinancialHealthGauge
                                    score={data.score}
                                    status={data.status}
                                />
                            </div>

                            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                <p className="text-center text-sm leading-6 text-zinc-400">
                                    {data.summary}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Key metrics */}
                    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                        <MetricCard
                            label="Monthly income"
                            value={formatCurrency(data.monthlyIncome)}
                            description="Current month"
                        />

                        <MetricCard
                            label="Monthly expenses"
                            value={formatCurrency(data.monthlyExpenses)}
                            description="Current month"
                        />

                        <MetricCard
                            label="Savings rate"
                            value={`${data.savingsRate.toFixed(1)}%`}
                            description="Income retained"
                        />

                        <MetricCard
                            label="Budget usage"
                            value={`${data.budgetUsagePercentage.toFixed(1)}%`}
                            description="Current monthly budgets"
                        />
                    </div>
                </section>

                {/* Health breakdown */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-white">
                            Health breakdown
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            See exactly which areas are contributing to
                            your score.
                        </p>
                    </div>

                    <div className="grid min-w-0 gap-4 md:grid-cols-2">
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
                </section>

                {/* Spending trend */}
                <section className={cardClass}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Spending trend
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Comparison with your previous month.
                            </p>
                        </div>

                        <div className="sm:text-right">
                            <p
                                className={`text-2xl font-bold tracking-tight sm:text-3xl ${
                                    data.spendingChangePercentage > 0
                                        ? "text-amber-400"
                                        : data.spendingChangePercentage < 0
                                            ? "text-emerald-400"
                                            : "text-white"
                                }`}
                            >
                                {data.spendingChangePercentage > 0
                                    ? "+"
                                    : ""}
                                {data.spendingChangePercentage.toFixed(1)}%
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                                Month-over-month change
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                            className="h-full rounded-full bg-violet-400 transition-all duration-700"
                            style={{
                                width: `${Math.min(
                                    Math.abs(data.spendingChangePercentage),
                                    100
                                )}%`,
                            }}
                        />
                    </div>
                </section>

                {/* Score methodology */}
                <section className={cardClass}>
                    <div className="flex items-start gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                            <Info className="h-5 w-5 text-violet-400" />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-base font-semibold text-white">
                                How your score is calculated
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-zinc-500">
                                Finora calculates your score from four
                                measurable areas. Each area contributes a
                                defined number of points to the overall score.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <MethodCard
                            title="Budget"
                            points="30 points"
                            description="How closely your spending follows your budgets."
                        />

                        <MethodCard
                            title="Savings"
                            points="25 points"
                            description="Progress across your active savings goals."
                        />

                        <MethodCard
                            title="Cash flow"
                            points="25 points"
                            description="Balance between your income and expenses."
                        />

                        <MethodCard
                            title="Spending trend"
                            points="20 points"
                            description="How your spending compares with last month."
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}

function MetricCard({
                        label,
                        value,
                        description,
                    }: {
    label: string;
    value: string;
    description: string;
}) {
    return (
        <div className="min-w-0 rounded-xl border border-white/10 bg-[#0d0f15] p-4 transition hover:border-violet-500/20 sm:p-5">
            <p className="text-xs font-medium text-zinc-500">
                {label}
            </p>

            <p className="mt-3 break-words text-xl font-bold tracking-tight text-white sm:text-2xl">
                {value}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
                {description}
            </p>
        </div>
    );
}

function MethodCard({
                        title,
                        points,
                        description,
                    }: {
    title: string;
    points: string;
    description: string;
}) {
    return (
        <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-violet-500/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium text-white">
                    {title}
                </span>

                <span className="text-xs font-semibold text-violet-400">
                    {points}
                </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
                {description}
            </p>
        </div>
    );
}
