import {
    Activity,
    ArrowDownRight,
    ArrowLeft,
    ArrowUpRight,
    BarChart3,
    CheckCircle2,
    Info,
    RefreshCw,
    ShieldCheck,
    Sparkles,
    Target,
    Wallet,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useFinancialHealth } from "../../hooks/useFinancialHealth.ts";
import FinancialHealthGauge from "../health/FinancialHealthGauge.tsx";
import HealthFactorCard from "../health/HealthFactorCard";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);

export default function FinancialHealth() {
    const navigate = useNavigate();

    const {
        data,
        isLoading,
        isError,
        refetch,
        isFetching,
    } = useFinancialHealth();

    /* ================================================================
       LOADING
    ================================================================= */

    if (isLoading) {
        return (
            <div className="space-y-7">
                {/* Header skeleton */}
                <div className="flex items-center justify-between">
                    <div className="space-y-3">
                        <div className="h-3 w-24 animate-pulse rounded bg-white/[0.06]" />
                        <div className="h-8 w-56 animate-pulse rounded-lg bg-white/[0.06]" />
                        <div className="h-3 w-80 animate-pulse rounded bg-white/[0.04]" />
                    </div>

                    <div className="hidden h-10 w-28 animate-pulse rounded-xl bg-white/[0.05] sm:block" />
                </div>

                {/* Hero */}
                <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                    <div className="h-[430px] animate-pulse rounded-[28px] border border-white/[0.05] bg-white/[0.025]" />

                    <div className="grid gap-4 sm:grid-cols-2">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-[205px] animate-pulse rounded-2xl border border-white/[0.05] bg-white/[0.025]"
                            />
                        ))}
                    </div>
                </div>

                {/* Factors */}
                <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-44 animate-pulse rounded-2xl border border-white/[0.05] bg-white/[0.025]"
                        />
                    ))}
                </div>
            </div>
        );
    }

    /* ================================================================
       ERROR
    ================================================================= */

    if (isError || !data) {
        return (
            <div className="flex min-h-[620px] items-center justify-center px-4">
                <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0c0e13] p-8 text-center shadow-2xl">
                    <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-rose-500/[0.06] blur-3xl" />

                    <div className="relative">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-400/15 bg-rose-400/[0.07]">
                            <Info className="h-6 w-6 text-rose-400" />
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-white">
                            Unable to load financial health
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                            We couldn't retrieve your latest financial health
                            information. Please try again.
                        </p>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="
                                mt-7 inline-flex items-center gap-2
                                rounded-xl
                                bg-violet-500
                                px-5 py-2.5
                                text-sm font-semibold text-white
                                transition
                                hover:bg-violet-400
                            "
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const spendingChange = Number(data.spendingChangePercentage) || 0;
    const isSpendingUp = spendingChange > 0;

    const scoreStatus = data.status
        ? data.status.replaceAll("_", " ")
        : "UNKNOWN";

    return (
        <div className="space-y-8 pb-10">
            {/* ============================================================
                HEADER
            ============================================================= */}

            <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="
                            mb-5 inline-flex items-center gap-2
                            text-xs font-medium text-zinc-500
                            transition
                            hover:text-white
                        "
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to dashboard
                    </button>

                    <div className="flex items-start gap-4">
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-violet-400/15 bg-violet-400/[0.07]">
                            <div className="absolute inset-0 bg-violet-500/10 blur-xl" />

                            <ShieldCheck
                                className="relative h-5 w-5 text-violet-300"
                            />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                    Financial Health
                                </h1>

                                <span className="rounded-full border border-violet-400/15 bg-violet-400/[0.06] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-violet-300">
                                    Live score
                                </span>
                            </div>

                            <p className="mt-1.5 max-w-xl text-sm leading-6 text-zinc-500">
                                A clear view of the financial factors shaping
                                your current position.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="
                        inline-flex shrink-0 items-center justify-center gap-2
                        rounded-xl
                        border border-white/[0.08]
                        bg-white/[0.025]
                        px-4 py-2.5
                        text-sm font-medium text-zinc-300
                        transition-all
                        hover:border-white/[0.13]
                        hover:bg-white/[0.05]
                        hover:text-white
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    <RefreshCw
                        className={`h-4 w-4 ${
                            isFetching ? "animate-spin" : ""
                        }`}
                    />

                    {isFetching ? "Refreshing..." : "Refresh"}
                </button>
            </header>

            {/* ============================================================
                SCORE HERO + METRICS
            ============================================================= */}

            <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                {/* ========================================================
                    SCORE HERO
                ========================================================= */}

                <div className="relative min-h-[430px] overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0b0d12]">
                    {/* Ambient glow */}
                    <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-500/[0.10] blur-3xl" />

                    <div className="pointer-events-none absolute -bottom-40 -left-20 h-72 w-72 rounded-full bg-indigo-500/[0.05] blur-3xl" />

                    {/* Top shine */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />

                    <div className="relative flex h-full flex-col p-6 sm:p-8">
                        {/* Hero top */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-violet-300" />

                                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                                        Financial overview
                                    </span>
                                </div>

                                <h2 className="mt-2 text-lg font-semibold text-white">
                                    Your financial health
                                </h2>

                                <p className="mt-1 text-xs text-zinc-500">
                                    Based on your current financial activity
                                </p>
                            </div>

                            <div className="hidden items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 sm:flex">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                                <span className="text-[10px] font-medium text-zinc-500">
                                    Updated now
                                </span>
                            </div>
                        </div>

                        {/* Gauge */}
                        <div className="flex flex-1 items-center justify-center py-6">
                            <FinancialHealthGauge
                                score={data.score}
                                status={data.status}
                            />
                        </div>

                        {/* Status */}
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 sm:p-5">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-400/[0.08]">
                                    <Activity className="h-4 w-4 text-violet-300" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
                                            Current status
                                        </span>

                                        <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-400">
                                            {scoreStatus}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                                        {data.summary}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================
                    METRICS
                ========================================================= */}

                <div className="grid gap-4 sm:grid-cols-2">
                    <HealthMetric
                        icon={Wallet}
                        label="Monthly income"
                        value={formatCurrency(data.monthlyIncome)}
                        description="Current month"
                        iconClass="text-emerald-300"
                        iconBg="bg-emerald-400/[0.07]"
                    />

                    <HealthMetric
                        icon={ArrowDownRight}
                        label="Monthly expenses"
                        value={formatCurrency(data.monthlyExpenses)}
                        description="Current month"
                        iconClass="text-rose-300"
                        iconBg="bg-rose-400/[0.07]"
                    />

                    <HealthMetric
                        icon={Target}
                        label="Savings rate"
                        value={`${data.savingsRate.toFixed(1)}%`}
                        description="Income retained"
                        iconClass="text-violet-300"
                        iconBg="bg-violet-400/[0.07]"
                    />

                    <HealthMetric
                        icon={BarChart3}
                        label="Budget usage"
                        value={`${data.budgetUsagePercentage.toFixed(1)}%`}
                        description="Current monthly budgets"
                        iconClass="text-amber-300"
                        iconBg="bg-amber-400/[0.07]"
                    />
                </div>
            </section>

            {/* ============================================================
                HEALTH BREAKDOWN
            ============================================================= */}

            <section>
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold tracking-tight text-white">
                                Health breakdown
                            </h2>

                            <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-2 py-0.5 text-[9px] font-semibold text-zinc-600">
                                {data.factors.length} factors
                            </span>
                        </div>

                        <p className="mt-1 text-sm text-zinc-500">
                            See which areas are contributing to your overall
                            financial score.
                        </p>
                    </div>

                    <div className="hidden items-center gap-2 text-[10px] text-zinc-600 sm:flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                        Score contribution
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
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

            {/* ============================================================
                SPENDING TREND
            ============================================================= */}

            <section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0b0d12]">
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/[0.06] blur-3xl" />

                <div className="relative p-6 sm:p-7">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/[0.07]">
                                    <BarChart3 className="h-4 w-4 text-violet-300" />
                                </div>

                                <div>
                                    <h2 className="text-base font-semibold text-white">
                                        Spending trend
                                    </h2>

                                    <p className="text-xs text-zinc-600">
                                        Compared with your previous month
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Change */}
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p
                                    className={`text-2xl font-bold tracking-tight ${
                                        isSpendingUp
                                            ? "text-amber-300"
                                            : "text-emerald-300"
                                    }`}
                                >
                                    {spendingChange > 0 ? "+" : ""}
                                    {spendingChange.toFixed(1)}%
                                </p>

                                <p className="mt-0.5 text-[10px] text-zinc-600">
                                    month-over-month
                                </p>
                            </div>

                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                    isSpendingUp
                                        ? "bg-amber-400/[0.08] text-amber-300"
                                        : "bg-emerald-400/[0.08] text-emerald-300"
                                }`}
                            >
                                {isSpendingUp ? (
                                    <ArrowUpRight className="h-5 w-5" />
                                ) : (
                                    <ArrowDownRight className="h-5 w-5" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Trend visualization */}
                    <div className="mt-7">
                        <div className="flex items-center justify-between text-[10px] text-zinc-600">
                            <span>Lower spending</span>
                            <span>Higher spending</span>
                        </div>

                        <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-white/[0.05]">
                            {/* background segments */}
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-violet-400/20 to-amber-400/20" />

                            {/* current value */}
                            <div
                                className={`relative h-full rounded-full transition-all duration-700 ${
                                    isSpendingUp
                                        ? "bg-amber-400"
                                        : "bg-emerald-400"
                                }`}
                                style={{
                                    width: `${Math.min(
                                        Math.abs(spendingChange),
                                        100
                                    )}%`,
                                }}
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-3 text-[10px]">
                            <div className="text-left text-emerald-400/60">
                                Improving
                            </div>

                            <div className="text-center text-zinc-600">
                                Stable
                            </div>

                            <div className="text-right text-amber-400/60">
                                Increasing
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                SCORE METHODOLOGY
            ============================================================= */}

            <section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.018]">
                <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-violet-500/[0.04] blur-3xl" />

                <div className="relative p-6 sm:p-7">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/[0.06]">
                            <Info className="h-4 w-4 text-violet-300" />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-white">
                                How your score works
                            </h2>

                            <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-600">
                                Finora evaluates four measurable areas to build
                                your overall financial health score.
                            </p>
                        </div>
                    </div>

                    {/* Methods */}
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <MethodCard
                            icon={Wallet}
                            title="Budget"
                            points="30 points"
                            description="How closely your spending follows your budgets."
                        />

                        <MethodCard
                            icon={Target}
                            title="Savings"
                            points="25 points"
                            description="Progress across your active savings goals."
                        />

                        <MethodCard
                            icon={Activity}
                            title="Cash flow"
                            points="25 points"
                            description="Balance between your income and expenses."
                        />

                        <MethodCard
                            icon={BarChart3}
                            title="Spending trend"
                            points="20 points"
                            description="How your spending compares with last month."
                        />
                    </div>
                </div>
            </section>

            {/* ============================================================
                FOOTER NOTE
            ============================================================= */}

            <div className="flex items-center justify-center gap-2 pb-2 text-[10px] text-zinc-700">
                <CheckCircle2 className="h-3.5 w-3.5" />

                Financial health is calculated from your current account
                activity.
            </div>
        </div>
    );
}

/* ========================================================================
   HEALTH METRIC
======================================================================== */

function HealthMetric({
                          icon: Icon,
                          label,
                          value,
                          description,
                          iconClass,
                          iconBg,
                      }: {
    icon: typeof Wallet;
    label: string;
    value: string;
    description: string;
    iconClass: string;
    iconBg: string;
}) {
    return (
        <div
            className="
                group relative overflow-hidden
                rounded-2xl
                border border-white/[0.07]
                bg-[#0c0e13]
                p-5
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-white/[0.12]
            "
        >
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/[0.02] blur-2xl transition-transform duration-500 group-hover:scale-125" />

            <div className="relative">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                            {label}
                        </p>

                        <p className="mt-3 text-2xl font-bold tracking-tight text-white">
                            {value}
                        </p>

                        <p className="mt-1 text-[11px] text-zinc-600">
                            {description}
                        </p>
                    </div>

                    <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                    >
                        <Icon className={`h-4 w-4 ${iconClass}`} />
                    </div>
                </div>

                <div className="mt-5 h-px bg-white/[0.05]" />

                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-zinc-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                    Financial health metric
                </div>
            </div>
        </div>
    );
}

/* ========================================================================
   METHOD CARD
======================================================================== */

function MethodCard({
                        icon: Icon,
                        title,
                        points,
                        description,
                    }: {
    icon: typeof Wallet;
    title: string;
    points: string;
    description: string;
}) {
    return (
        <div
            className="
                group
                rounded-2xl
                border border-white/[0.06]
                bg-white/[0.018]
                p-4
                transition-all duration-300
                hover:border-violet-400/10
                hover:bg-white/[0.03]
            "
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/[0.06]">
                        <Icon className="h-3.5 w-3.5 text-violet-300" />
                    </div>

                    <span className="text-sm font-medium text-white">
                        {title}
                    </span>
                </div>

                <span className="shrink-0 text-[10px] font-semibold text-violet-300">
                    {points}
                </span>
            </div>

            <p className="mt-3 text-[11px] leading-5 text-zinc-600">
                {description}
            </p>
        </div>
    );
}