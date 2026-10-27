import {
    AlertCircle,
    ArrowRight,
    BarChart3,
    CheckCircle2,
    ChevronRight,
    Lightbulb,
    Sparkles,
} from "lucide-react";

import {
    useFinancialInsights,
} from "../../hooks/useFinancialInsights";

import FinancialInsightCard from "./FinancialInsightCard";

export default function FinancialInsights() {
    const {
        data: insights = [],
        isLoading,
        isError,
        refetch,
    } = useFinancialInsights();

    return (
        <section className="mt-10">
            {/* =========================================================
                SECTION HEADER
            ========================================================= */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-violet-400/20 bg-violet-400/[0.08]">
                            <div className="absolute inset-0 bg-violet-500/10 blur-xl" />

                            <Lightbulb
                                size={19}
                                className="relative text-violet-300"
                            />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-lg font-semibold tracking-tight text-white">
                                    Financial Insights
                                </h2>

                                {!isLoading && !isError && insights.length > 0 && (
                                    <span className="rounded-full border border-violet-400/15 bg-violet-400/[0.07] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                                        {insights.length} insights
                                    </span>
                                )}
                            </div>

                            <p className="mt-1 text-xs text-zinc-500">
                                Smart observations from your financial activity
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    className="
                        group hidden shrink-0 items-center gap-2
                        rounded-xl border border-white/[0.07]
                        bg-white/[0.025]
                        px-3.5 py-2
                        text-xs font-medium text-zinc-400
                        transition-all duration-200
                        hover:border-white/[0.12]
                        hover:bg-white/[0.05]
                        hover:text-white
                        sm:flex
                    "
                >
                    <BarChart3
                        size={14}
                        className="text-zinc-500 transition-colors group-hover:text-violet-300"
                    />

                    View analytics

                    <ArrowRight
                        size={13}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                </button>
            </div>

            {/* =========================================================
                LOADING
            ========================================================= */}

            {isLoading && (
                <div className="grid gap-4 xl:grid-cols-3">
                    {/* Featured skeleton */}
                    <div className="relative h-[290px] overflow-hidden rounded-3xl border border-white/[0.05] bg-white/[0.025] xl:col-span-2">
                        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-violet-500/[0.05] via-transparent to-transparent" />

                        <div className="relative p-6">
                            <div className="h-10 w-10 animate-pulse rounded-xl bg-white/[0.06]" />

                            <div className="mt-6 h-3 w-24 animate-pulse rounded bg-white/[0.06]" />

                            <div className="mt-3 h-6 w-3/4 animate-pulse rounded bg-white/[0.06]" />

                            <div className="mt-4 space-y-2">
                                <div className="h-3 w-full animate-pulse rounded bg-white/[0.05]" />
                                <div className="h-3 w-5/6 animate-pulse rounded bg-white/[0.05]" />
                            </div>
                        </div>
                    </div>

                    {/* Small skeletons */}
                    {[1, 2].map((item) => (
                        <div
                            key={item}
                            className="h-[290px] animate-pulse rounded-3xl border border-white/[0.05] bg-white/[0.025]"
                        />
                    ))}
                </div>
            )}

            {/* =========================================================
                ERROR
            ========================================================= */}

            {isError && !isLoading && (
                <div className="relative overflow-hidden rounded-3xl border border-rose-400/10 bg-rose-400/[0.035]">
                    <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-rose-500/[0.06] blur-3xl" />

                    <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-400/15 bg-rose-400/[0.08]">
                            <AlertCircle
                                size={19}
                                className="text-rose-400"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white">
                                Couldn't load your financial insights
                            </p>

                            <p className="mt-1 text-xs leading-5 text-zinc-500">
                                Something went wrong while retrieving your
                                latest financial patterns.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="
                                inline-flex shrink-0 items-center justify-center
                                gap-2 rounded-xl
                                border border-white/[0.08]
                                bg-white/[0.04]
                                px-4 py-2.5
                                text-xs font-semibold text-zinc-300
                                transition-all
                                hover:border-white/[0.14]
                                hover:bg-white/[0.07]
                                hover:text-white
                            "
                        >
                            Try again
                            <ArrowRight size={13} />
                        </button>
                    </div>
                </div>
            )}

            {/* =========================================================
                EMPTY STATE
            ========================================================= */}

            {!isLoading &&
                !isError &&
                insights.length === 0 && (
                    <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.015]">
                        {/* Decorative glow */}
                        <div className="absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-violet-500/[0.06] blur-3xl" />

                        <div className="relative flex flex-col items-center justify-center px-6 py-16 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-400/[0.05]">
                                <Sparkles
                                    size={22}
                                    className="text-violet-300/70"
                                />
                            </div>

                            <h3 className="mt-5 text-sm font-semibold text-zinc-200">
                                Your financial story is still unfolding
                            </h3>

                            <p className="mt-2 max-w-md text-xs leading-6 text-zinc-600">
                                Keep tracking your income, expenses, budgets,
                                and savings. Finora will surface useful
                                patterns as more activity builds up.
                            </p>
                        </div>
                    </div>
                )}

            {/* =========================================================
                INSIGHTS
            ========================================================= */}

            {!isLoading &&
                !isError &&
                insights.length > 0 && (
                    <div className="grid gap-4 xl:grid-cols-3">
                        {/* =================================================
                            FEATURED INSIGHT
                        ================================================= */}

                        {insights[0] && (
                            <div className="xl:col-span-2">
                                <FinancialInsightCard
                                    insight={insights[0]}
                                    featured
                                />
                            </div>
                        )}

                        {/* =================================================
                            SECONDARY INSIGHTS
                        ================================================= */}

                        {insights.slice(1, 6).map((insight, index) => (
                            <FinancialInsightCard
                                key={`${insight.type}-${insight.title}-${index}`}
                                insight={insight}
                            />
                        ))}
                    </div>
                )}

            {/* =========================================================
                FOOTER
            ========================================================= */}

            {!isLoading &&
                !isError &&
                insights.length > 0 && (
                    <div className="mt-4 flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <CheckCircle2
                                size={13}
                                className="text-emerald-400/70"
                            />

                            <span className="text-[11px] text-zinc-600">
                                Insights are based on your recent activity
                            </span>
                        </div>

                        {insights.length > 6 && (
                            <button
                                type="button"
                                className="group flex items-center gap-1 text-[11px] font-medium text-zinc-500 transition hover:text-white"
                            >
                                View all
                                <ChevronRight
                                    size={13}
                                    className="transition-transform group-hover:translate-x-0.5"
                                />
                            </button>
                        )}
                    </div>
                )}
        </section>
    );
}