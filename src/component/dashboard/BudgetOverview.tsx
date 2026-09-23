import {
    ArrowRight,
    AlertTriangle,
    CheckCircle2,
    WalletCards,
} from "lucide-react"

import {
    useMemo,
} from "react"

import {
    useQuery,
} from "@tanstack/react-query"

import {
    getBudgets,
} from "@/services/budgetApi"

import {
    Card,
} from "@/components/ui/card"

import {
    useNavigate,
} from "react-router-dom"


interface BudgetOverviewProps {
    month: number
    year: number
}


export default function BudgetOverview({
                                           month,
                                           year,
                                       }: BudgetOverviewProps) {

    const navigate =
        useNavigate()


    const {
        data: budgets = [],
        isLoading,
        isError,
    } = useQuery({

        queryKey: [
            "budgets",
            month,
            year,
        ],

        queryFn: () =>
            getBudgets(
                month,
                year
            ),

        staleTime:
            30 * 1000,

        refetchOnWindowFocus:
            false,

    })


    // =====================================================
    // TOTALS
    // =====================================================

    const totals =
        useMemo(() => {

            const budget =
                budgets.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        item.budget,
                    0
                )


            const spent =
                budgets.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        item.spent,
                    0
                )


            const remaining =
                budget -
                spent


            const percentage =
                budget > 0
                    ? (
                        spent /
                        budget
                    ) *
                    100
                    : 0


            return {
                budget,
                spent,
                remaining,
                percentage,
            }

        }, [budgets])


    // =====================================================
    // INSIGHT
    // =====================================================

    const insight =
        useMemo(() => {

            const overBudget =
                budgets.find(
                    (budget) =>
                        budget.percentage >
                        100
                )


            const nearLimit =
                budgets.find(
                    (budget) =>
                        budget.percentage >=
                        90 &&
                        budget.percentage <=
                        100
                )


            if (overBudget) {

                return {
                    type: "danger",
                    title:
                        "Budget exceeded",
                    message:
                        `${overBudget.category.name} is over its monthly limit.`,
                }

            }


            if (nearLimit) {

                return {
                    type: "warning",
                    title:
                        "Watch your spending",
                    message:
                        `${nearLimit.category.name} is approaching its monthly limit.`,
                }

            }


            if (
                totals.percentage >=
                70
            ) {

                return {
                    type: "warning",
                    title:
                        "You're getting close",
                    message:
                        "You've used a significant portion of your monthly budget.",
                }

            }


            return {
                type: "success",
                title:
                    "You're on track",
                message:
                    "Your spending is comfortably within your monthly budgets.",
            }

        }, [
            budgets,
            totals.percentage,
        ])


    // =====================================================
    // LOADING
    // =====================================================

    if (isLoading) {

        return (

            <Card className="h-[420px] animate-pulse rounded-3xl border-white/[0.08] bg-white/[0.025]" />

        )
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (isError) {

        return (

            <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] p-6">

                <p className="text-sm text-white/40">
                    Unable to load budget overview.
                </p>

            </Card>
        )
    }


    // =====================================================
    // EMPTY
    // =====================================================

    if (budgets.length === 0) {

        return (

            <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] p-6">

                <div className="flex items-start justify-between">

                    <div>

                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-400">
                            Budget overview
                        </p>

                        <h2 className="mt-2 text-lg font-bold text-white">
                            No budgets yet
                        </h2>

                        <p className="mt-1 max-w-sm text-sm text-white/30">
                            Create your first monthly budget to start tracking your spending.
                        </p>

                    </div>

                    <WalletCards
                        size={22}
                        className="text-white/20"
                    />

                </div>


                <button
                    onClick={() =>
                        navigate(
                            "/budgets"
                        )
                    }
                    className="mt-6 flex items-center gap-2 text-xs font-semibold text-white/50 transition hover:text-white"
                >
                    Create a budget

                    <ArrowRight
                        size={14}
                    />

                </button>

            </Card>
        )
    }


    const progressWidth =
        Math.min(
            totals.percentage,
            100
        )


    return (

        <Card className="overflow-hidden rounded-3xl border-white/[0.08] bg-white/[0.025]">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="flex items-start justify-between p-6">

                <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-400">
                        Budget overview
                    </p>

                    <h2 className="mt-2 text-lg font-bold text-white">
                        Monthly spending
                    </h2>

                </div>


                <button
                    onClick={() =>
                        navigate(
                            "/budgets"
                        )
                    }
                    className="flex items-center gap-1 text-xs font-medium text-white/30 transition hover:text-white"
                >
                    View all

                    <ArrowRight
                        size={14}
                    />

                </button>

            </div>


            {/* ================================================= */}
            {/* TOTAL */}
            {/* ================================================= */}

            <div className="px-6">

                <div className="flex items-end justify-between">

                    <div>

                        <p className="text-3xl font-bold text-white">
                            ₹
                            {totals.spent.toLocaleString(
                                "en-IN"
                            )}
                        </p>

                        <p className="mt-1 text-xs text-white/30">
                            of ₹
                            {totals.budget.toLocaleString(
                                "en-IN"
                            )}
                            planned
                        </p>

                    </div>


                    <p className="text-sm font-semibold text-white/50">
                        {totals.percentage.toFixed(
                            1
                        )}
                        %
                    </p>

                </div>


                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">

                    <div
                        className={`h-full rounded-full transition-all duration-700 ${
                            totals.percentage >= 100
                                ? "bg-rose-400"
                                : totals.percentage >= 90
                                    ? "bg-amber-400"
                                    : "bg-violet-400"
                        }`}
                        style={{
                            width:
                                `${progressWidth}%`,
                        }}
                    />

                </div>


                <div className="mt-2 flex justify-between text-xs">

                    <span className="text-white/25">
                        Remaining
                    </span>

                    <span
                        className={
                            totals.remaining >= 0
                                ? "font-medium text-emerald-400"
                                : "font-medium text-rose-400"
                        }
                    >
                        ₹
                        {Math.abs(
                            totals.remaining
                        ).toLocaleString(
                            "en-IN"
                        )}
                    </span>

                </div>

            </div>


            {/* ================================================= */}
            {/* INSIGHT */}
            {/* ================================================= */}

            <div className="mx-6 mt-6">

                <div
                    className={`rounded-2xl border p-4 ${
                        insight.type ===
                        "danger"
                            ? "border-rose-400/10 bg-rose-400/[0.05]"
                            : insight.type ===
                            "warning"
                                ? "border-amber-400/10 bg-amber-400/[0.05]"
                                : "border-emerald-400/10 bg-emerald-400/[0.05]"
                    }`}
                >

                    <div className="flex gap-3">

                        {insight.type ===
                        "success" ? (

                            <CheckCircle2
                                size={18}
                                className="mt-0.5 shrink-0 text-emerald-400"
                            />

                        ) : (

                            <AlertTriangle
                                size={18}
                                className={`mt-0.5 shrink-0 ${
                                    insight.type ===
                                    "danger"
                                        ? "text-rose-400"
                                        : "text-amber-400"
                                }`}
                            />

                        )}


                        <div>

                            <p className="text-xs font-semibold text-white">
                                {insight.title}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-white/35">
                                {insight.message}
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* CATEGORY LIST */}
            {/* ================================================= */}

            <div className="mt-6 divide-y divide-white/[0.05] border-t border-white/[0.06]">

                {budgets
                    .slice(
                        0,
                        4
                    )
                    .map(
                        (
                            budget
                        ) => {

                            const percentage =
                                Math.min(
                                    budget.percentage,
                                    100
                                )


                            const exceeded =
                                budget.percentage >
                                100


                            const nearLimit =
                                budget.percentage >=
                                90


                            return (

                                <div
                                    key={
                                        budget.id
                                    }
                                    className="px-6 py-4"
                                >

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-sm font-medium text-white">
                                                {
                                                    budget.category.name
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-white/25">
                                                ₹
                                                {budget.spent.toLocaleString(
                                                    "en-IN"
                                                )}
                                                {" / "}
                                                ₹
                                                {budget.budget.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>

                                        </div>


                                        <div className="text-right">

                                            <p
                                                className={`text-xs font-semibold ${
                                                    exceeded
                                                        ? "text-rose-400"
                                                        : nearLimit
                                                            ? "text-amber-400"
                                                            : "text-white/50"
                                                }`}
                                            >
                                                {budget.percentage.toFixed(
                                                    0
                                                )}
                                                %
                                            </p>

                                            <p className="mt-1 text-[10px] text-white/20">
                                                used
                                            </p>

                                        </div>

                                    </div>


                                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">

                                        <div
                                            className={`h-full rounded-full ${
                                                exceeded
                                                    ? "bg-rose-400"
                                                    : nearLimit
                                                        ? "bg-amber-400"
                                                        : "bg-violet-400"
                                            }`}
                                            style={{
                                                width:
                                                    `${percentage}%`,
                                            }}
                                        />

                                    </div>

                                </div>
                            )
                        }
                    )}

            </div>

        </Card>
    )
}