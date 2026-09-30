import {
    ArrowDownRight,
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Plus,
    Wallet,
    Utensils,
    Bus,
    ShoppingBag,
    Receipt,
    CircleDollarSign,
    MoreHorizontal,
    TrendingUp,
    TrendingDown,
    Sparkles,
    RefreshCw,
} from "lucide-react"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

import DashboardSkeleton from "@/component/dashboard/DashboardSkeleton"
import AnimatedNumber from "@/component/dashboard/AnimatedNumber"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import { getSummary } from "@/services/summaryApi"

import {
    getTransactions,
    type Transaction,
} from "@/services/transactionApi"

import {
    getBudgets,
    type Budget,
} from "@/services/budgetApi"

import {
    buildMonthComparison,
} from "@/utils/monthComparison"


function Dashboard() {
    // =====================================================
    // SELECTED MONTH
    // =====================================================

    const [selectedDate, setSelectedDate] = useState(
        () => new Date()
    )

    const selectedYear = selectedDate.getFullYear()
    const selectedMonth = selectedDate.getMonth()

    // =====================================================
    // API — SUMMARY
    // =====================================================

    const {
        data: summary,
        isLoading: summaryLoading,
        isError: summaryError,
        refetch: refetchSummary,
    } = useQuery({
        queryKey: ["summary"],
        queryFn: getSummary,
    })

    // =====================================================
    // API — TRANSACTIONS
    // =====================================================

    const {
        data: transactions = [],
        isLoading: transactionsLoading,
        isError: transactionsError,
        refetch: refetchTransactions,
    } = useQuery<Transaction[]>({
        queryKey: ["transactions"],
        queryFn: getTransactions,
    })

    // =====================================================
    // API — BUDGETS
    // =====================================================

    const {
        data: budgetResponse,
        isLoading: budgetsLoading,
        isError: budgetsError,
        refetch: refetchBudgets,
    } = useQuery<Budget[]>({
        queryKey: [
            "dashboard-budgets",
            selectedMonth,
            selectedYear,
        ],
        queryFn: () =>
            getBudgets(
                selectedMonth + 1,
                selectedYear
            ),
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
    })

    // =====================================================
    // DASHBOARD REFRESH
    // =====================================================

    const refreshDashboard = () => {
        void Promise.all([
            refetchSummary(),
            refetchTransactions(),
            refetchBudgets(),
        ])
    }

    // =====================================================
    // DASHBOARD LOADING
    // =====================================================

    const dashboardLoading =
        summaryLoading ||
        transactionsLoading ||
        budgetsLoading

    // =====================================================
    // MONTH LABEL
    // =====================================================

    const selectedMonthLabel = useMemo(() => {
        return new Intl.DateTimeFormat("en-IN", {
            month: "long",
            year: "numeric",
        }).format(selectedDate)
    }, [selectedDate])

    // =====================================================
    // PREVIOUS MONTH LABEL
    // =====================================================

    const previousMonthLabel = useMemo(() => {
        return new Date(
            selectedYear,
            selectedMonth - 1,
            1
        ).toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
        })
    }, [selectedYear, selectedMonth])

    // =====================================================
    // NORMALIZE BUDGET RESPONSE
    // =====================================================

    const budgets = useMemo<Budget[]>(() => {
        return budgetResponse ?? []
    }, [budgetResponse])

    // =====================================================
    // FILTER TRANSACTIONS BY MONTH
    // =====================================================

    const monthlyTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            if (!transaction.date) {
                return false
            }

            const date = new Date(
                `${transaction.date}T00:00:00`
            )

            return (
                date.getFullYear() === selectedYear &&
                date.getMonth() === selectedMonth
            )
        })
    }, [
        transactions,
        selectedYear,
        selectedMonth,
    ])

    // =====================================================
    // MONTHLY INCOME
    // =====================================================

    const selectedMonthIncome = useMemo(() => {
        return monthlyTransactions
            .filter(
                (transaction) =>
                    transaction.type === "INCOME"
            )
            .reduce(
                (total, transaction) =>
                    total +
                    Math.abs(
                        Number(transaction.amount) || 0
                    ),
                0
            )
    }, [monthlyTransactions])

    // =====================================================
    // MONTHLY EXPENSE
    // =====================================================

    const selectedMonthExpense = useMemo(() => {
        return monthlyTransactions
            .filter(
                (transaction) =>
                    transaction.type === "EXPENSE"
            )
            .reduce(
                (total, transaction) =>
                    total +
                    Math.abs(
                        Number(transaction.amount) || 0
                    ),
                0
            )
    }, [monthlyTransactions])

    // =====================================================
    // MONTHLY SAVINGS RATE
    // =====================================================

    const monthlySavingsRate = useMemo(() => {
        if (selectedMonthIncome <= 0) {
            return 0
        }

        return (
            ((selectedMonthIncome -
                    selectedMonthExpense) /
                selectedMonthIncome) *
            100
        )
    }, [
        selectedMonthIncome,
        selectedMonthExpense,
    ])

    // =====================================================
    // BUDGET HEALTH
    // =====================================================

    const budgetHealth = useMemo(() => {
        return budgets.map((budget) => {
            const limit =
                Number(budget.budget) || 0

            const spent =
                Number(budget.spent) || 0

            const remaining =
                budget.remaining !== undefined &&
                budget.remaining !== null
                    ? Number(budget.remaining) || 0
                    : limit - spent

            const percentage =
                limit > 0
                    ? (spent / limit) * 100
                    : 0

            return {
                ...budget,
                limit,
                spent,
                remaining,
                percentage: Math.max(0, percentage),
                displayPercentage: Math.min(
                    100,
                    Math.max(0, percentage)
                ),
            }
        })
    }, [budgets])

    // =====================================================
    // TOTAL BUDGET
    // =====================================================

    const totalBudget = useMemo(() => {
        return budgetHealth.reduce(
            (total, budget) =>
                total + budget.limit,
            0
        )
    }, [budgetHealth])

    // =====================================================
    // TOTAL BUDGET SPENT
    // =====================================================

    const totalBudgetSpent = useMemo(() => {
        return budgetHealth.reduce(
            (total, budget) =>
                total + budget.spent,
            0
        )
    }, [budgetHealth])

    // =====================================================
    // OVERALL BUDGET %
    // =====================================================

    const overallBudgetPercentage =
        totalBudget > 0
            ? (totalBudgetSpent / totalBudget) * 100
            : 0

    const displayOverallBudgetPercentage =
        Math.min(
            100,
            Math.max(
                0,
                overallBudgetPercentage
            )
        )

    // =====================================================
    // BUDGET STATUS
    // =====================================================

    const getBudgetStatus = (
        percentage: number
    ) => {
        if (percentage >= 100) {
            return {
                label: "Over budget",
                className: "text-rose-400",
            }
        }

        if (percentage >= 85) {
            return {
                label: "Near limit",
                className: "text-amber-400",
            }
        }

        return {
            label: "On track",
            className: "text-emerald-400",
        }
    }

    // =====================================================
    // FINANCIAL HEALTH
    // =====================================================

    const financialHealth = useMemo(() => {
        let savingsScore = 0

        if (selectedMonthIncome > 0) {
            const savingsRate =
                monthlySavingsRate

            if (savingsRate >= 50) {
                savingsScore = 70
            } else if (savingsRate >= 30) {
                savingsScore = 60
            } else if (savingsRate >= 20) {
                savingsScore = 50
            } else if (savingsRate >= 10) {
                savingsScore = 35
            } else if (savingsRate > 0) {
                savingsScore = 20
            } else {
                savingsScore = 5
            }
        }

        let budgetScore = 30

        if (totalBudget > 0) {
            if (overallBudgetPercentage <= 50) {
                budgetScore = 30
            } else if (overallBudgetPercentage <= 70) {
                budgetScore = 25
            } else if (overallBudgetPercentage <= 85) {
                budgetScore = 18
            } else if (overallBudgetPercentage < 100) {
                budgetScore = 10
            } else {
                budgetScore = 0
            }
        }

        const score = Math.min(
            100,
            Math.max(
                0,
                Math.round(
                    savingsScore + budgetScore
                )
            )
        )

        let label = "Needs attention"

        if (score >= 85) {
            label = "Excellent"
        } else if (score >= 70) {
            label = "Healthy"
        } else if (score >= 50) {
            label = "Fair"
        } else if (score >= 30) {
            label = "Needs attention"
        } else {
            label = "At risk"
        }

        return {
            score,
            label,
        }
    }, [
        monthlySavingsRate,
        selectedMonthIncome,
        totalBudget,
        overallBudgetPercentage,
    ])

    // =====================================================
    // MONTH COMPARISON
    // =====================================================

    const comparison = useMemo(
        () =>
            buildMonthComparison(
                transactions,
                selectedYear,
                selectedMonth
            ),
        [
            transactions,
            selectedYear,
            selectedMonth,
        ]
    )

    // =====================================================
    // EXPENSE INSIGHT
    // =====================================================

    const expenseInsight =
        comparison.expenseChange > 0
            ? `Your spending increased by ${Math.abs(
                comparison.expenseChange
            ).toFixed(
                1
            )}% compared with ${previousMonthLabel}.`
            : comparison.expenseChange < 0
                ? `Your spending decreased by ${Math.abs(
                    comparison.expenseChange
                ).toFixed(
                    1
                )}% compared with ${previousMonthLabel}.`
                : `Your spending is unchanged compared with ${previousMonthLabel}.`

    // =====================================================
    // SAVINGS INSIGHT
    // =====================================================

    const savingsInsight =
        comparison.savingsChange > 0
            ? `Your savings improved by ${Math.abs(
                comparison.savingsChange
            ).toFixed(1)}%.`
            : comparison.savingsChange < 0
                ? `Your savings decreased by ${Math.abs(
                    comparison.savingsChange
                ).toFixed(1)}%.`
                : `Your savings are unchanged compared with ${previousMonthLabel}.`

    // =====================================================
    // CURRENT MONTH CATEGORY TOTALS
    // =====================================================

    const currentMonthCategoryTotals =
        useMemo(() => {
            const map = new Map<string, number>()

            monthlyTransactions
                .filter(
                    (transaction) =>
                        transaction.type === "EXPENSE"
                )
                .forEach((transaction) => {
                    const category =
                        transaction.category ||
                        "Uncategorized"

                    map.set(
                        category,
                        (map.get(category) ?? 0) +
                        Math.abs(
                            Number(transaction.amount) || 0
                        )
                    )
                })

            return Array.from(map.entries())
                .map(
                    ([category, amount]) => ({
                        category,
                        amount,
                    })
                )
                .sort(
                    (a, b) =>
                        b.amount - a.amount
                )
        }, [monthlyTransactions])

    // =====================================================
    // BIGGEST CATEGORY
    // =====================================================

    const biggestCategory =
        currentMonthCategoryTotals[0]

    // =====================================================
    // SAVINGS / DEFICIT
    // =====================================================

    const savingsLabel =
        comparison.current.savings >= 0
            ? "Savings"
            : "Deficit"

    // =====================================================
    // INCOME / EXPENSE DATA
    // =====================================================

    const incomeExpenseData = useMemo(
        () => [
            {
                name: "Income",
                amount: selectedMonthIncome,
            },
            {
                name: "Expenses",
                amount: selectedMonthExpense,
            },
        ],
        [
            selectedMonthIncome,
            selectedMonthExpense,
        ]
    )

    // =====================================================
    // CASH FLOW TIMELINE
    // =====================================================

    const cashFlowData = useMemo(() => {
        const grouped: Record<
            string,
            {
                income: number
                expense: number
            }
        > = {}

        monthlyTransactions.forEach(
            (transaction) => {
                const date = transaction.date

                if (!date) {
                    return
                }

                if (!grouped[date]) {
                    grouped[date] = {
                        income: 0,
                        expense: 0,
                    }
                }

                const amount =
                    Math.abs(
                        Number(transaction.amount) || 0
                    )

                if (
                    transaction.type === "INCOME"
                ) {
                    grouped[date].income += amount
                } else {
                    grouped[date].expense += amount
                }
            }
        )

        return Object.entries(grouped)
            .sort((a, b) =>
                a[0].localeCompare(b[0])
            )
            .map(
                ([date, values]) => ({
                    date,
                    income: values.income,
                    expense: values.expense,
                    net:
                        values.income -
                        values.expense,
                })
            )
    }, [monthlyTransactions])

    // =====================================================
    // CATEGORY BREAKDOWN
    // =====================================================

    const categoryData = useMemo(() => {
        const totals: Record<
            string,
            number
        > = {}

        monthlyTransactions
            .filter(
                (transaction) =>
                    transaction.type === "EXPENSE"
            )
            .forEach((transaction) => {
                const category =
                    transaction.category ||
                    "Other"

                totals[category] =
                    (totals[category] ?? 0) +
                    Math.abs(
                        Number(transaction.amount) || 0
                    )
            })

        return Object.entries(totals)
            .map(([name, value]) => ({
                name,
                value,
            }))
            .sort(
                (a, b) =>
                    b.value - a.value
            )
    }, [monthlyTransactions])

    // =====================================================
    // CATEGORY ICON
    // =====================================================

    const getCategoryIcon = (
        category?: string
    ) => {
        const value =
            (category ?? "").toLowerCase()

        if (
            value.includes("food") ||
            value.includes("restaurant") ||
            value.includes("dining")
        ) {
            return <Utensils size={18} />
        }

        if (
            value.includes("travel") ||
            value.includes("transport") ||
            value.includes("bus") ||
            value.includes("uber") ||
            value.includes("fuel")
        ) {
            return <Bus size={18} />
        }

        if (
            value.includes("shopping")
        ) {
            return (
                <ShoppingBag size={18} />
            )
        }

        if (
            value.includes("salary") ||
            value.includes("income")
        ) {
            return (
                <CircleDollarSign size={18} />
            )
        }

        if (value.includes("bill")) {
            return <Receipt size={18} />
        }

        return <Wallet size={18} />
    }

    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (
        amount: number,
        decimals = false
    ) => {
        return Number(amount || 0).toLocaleString(
            "en-IN",
            decimals
                ? {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }
                : undefined
        )
    }

    // =====================================================
    // CURRENT DATE
    // =====================================================

    const currentDate = useMemo(() => {
        return new Intl.DateTimeFormat(
            "en-IN",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
            }
        ).format(new Date())
    }, [])

    // =====================================================
    // MONTH NAVIGATION
    // =====================================================

    const goToPreviousMonth = () => {
        setSelectedDate(
            (current) =>
                new Date(
                    current.getFullYear(),
                    current.getMonth() - 1,
                    1
                )
        )
    }

    const goToNextMonth = () => {
        setSelectedDate(
            (current) =>
                new Date(
                    current.getFullYear(),
                    current.getMonth() + 1,
                    1
                )
        )
    }

    // =====================================================
    // PERCENTAGE FORMATTER
    // =====================================================

    const formatChange = (
        value: number
    ) => {
        const absolute =
            Math.abs(value).toFixed(1)

        if (value > 0) {
            return `↑ ${absolute}%`
        }

        if (value < 0) {
            return `↓ ${absolute}%`
        }

        return "— 0%"
    }

    // =====================================================
    // LOADING STATE
    // =====================================================

    if (dashboardLoading) {
        return <DashboardSkeleton />
    }

    // =====================================================
    // ERROR STATE
    // =====================================================

    if (
        summaryError ||
        transactionsError
    ) {
        return (
            <div className="min-h-screen bg-[#07080c] text-white">
                <div className="flex min-h-screen items-center justify-center p-6">
                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center shadow-2xl backdrop-blur-xl">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
                            <ArrowDownRight size={24} />
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-white">
                            Unable to load dashboard
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-white/45">
                            We couldn't retrieve your financial
                            information. Make sure your Spring
                            Boot backend is running.
                        </p>

                        <Button
                            className="mt-6 rounded-xl bg-white text-black hover:bg-white/90"
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Try again
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // =====================================================
    // DASHBOARD
    // =====================================================
    return (
        <div className="min-h-screen overflow-x-hidden bg-[#05060a] text-white">
            {/* Ambient background */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-violet-600/[0.08] blur-[120px]" />
                <div className="absolute right-[-180px] top-[18%] h-[520px] w-[520px] rounded-full bg-indigo-500/[0.06] blur-[130px]" />
                <div className="absolute bottom-[-220px] left-[28%] h-[500px] w-[500px] rounded-full bg-emerald-500/[0.035] blur-[120px]" />
            </div>

            <div className="relative mx-auto w-full max-w-[1700px] px-4 pb-10 sm:px-6 lg:px-8 xl:px-10">
                {/* TOP BAR */}
                <header className="sticky top-0 z-30 -mx-4 border-b border-white/[0.06] bg-[#05060a]/80 px-4 backdrop-blur-2xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:-mx-10 xl:px-10">
                    <div className="mx-auto flex min-h-[78px] max-w-[1700px] items-center justify-between gap-4">
                        <div className="min-w-0">
                            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-300/60">
                                {currentDate}
                            </p>
                            <h1 className="mt-1 truncate text-2xl font-bold tracking-[-0.04em] text-white sm:text-[28px]">
                                Good evening <span className="ml-1">👋</span>
                            </h1>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <button
                                onClick={refreshDashboard}
                                disabled={dashboardLoading}
                                className="hidden h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 text-xs font-medium text-white/45 transition hover:border-white/15 hover:bg-white/[0.05] hover:text-white disabled:opacity-40 sm:flex"
                            >
                                <RefreshCw size={14} className={dashboardLoading ? "animate-spin" : ""} />
                                Refresh
                            </button>
                            <Button className="h-10 rounded-xl bg-white px-4 text-xs font-semibold text-black shadow-lg shadow-white/[0.04] transition hover:-translate-y-0.5 hover:bg-white/90">
                                <Plus size={15} className="mr-1.5" />
                                Add transaction
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="space-y-6 pt-7 lg:space-y-7 lg:pt-9">
                    {/* MONTH CONTROL */}
                    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/25">Financial overview</p>
                            <div className="mt-2 flex flex-wrap items-baseline gap-3">
                                <h2 className="text-2xl font-bold tracking-[-0.035em] text-white sm:text-3xl">{selectedMonthLabel}</h2>
                                <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[10px] text-white/35">
                                    {monthlyTransactions.length} transactions
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-start rounded-2xl border border-white/[0.08] bg-white/[0.025] p-1 sm:self-auto">
                            <button onClick={goToPreviousMonth} className="flex h-9 w-9 items-center justify-center rounded-xl text-white/35 transition hover:bg-white/[0.06] hover:text-white" aria-label="Previous month">
                                <ArrowLeft size={16} />
                            </button>
                            <div className="min-w-[145px] px-2 text-center text-xs font-semibold text-white/70">{selectedMonthLabel}</div>
                            <button onClick={goToNextMonth} className="flex h-9 w-9 items-center justify-center rounded-xl text-white/35 transition hover:bg-white/[0.06] hover:text-white" aria-label="Next month">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </section>

                    {/* HERO BENTO */}
                    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,.75fr)]">
                        <Card className="relative min-w-0 overflow-hidden rounded-[30px] border-white/[0.08] bg-gradient-to-br from-white/[0.055] via-white/[0.025] to-violet-500/[0.045] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8">
                            <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-violet-500/[0.12] blur-[80px]" />
                            <div className="pointer-events-none absolute bottom-[-100px] left-[20%] h-56 w-56 rounded-full bg-emerald-400/[0.06] blur-[70px]" />

                            <div className="relative">
                                <div className="flex items-start justify-between gap-5">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">Available balance</p>
                                        </div>
                                        <div className="mt-4 text-4xl font-bold tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
                                            <AnimatedNumber value={Number(summary?.balance) || 0} prefix="₹" />
                                        </div>
                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.08] px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                                                <TrendingUp size={12} /> Healthy
                                            </span>
                                            <span className="text-[11px] text-white/30">Current available balance</span>
                                        </div>
                                    </div>
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.045] text-white/75 shadow-xl shadow-black/10">
                                        <Wallet size={21} />
                                    </div>
                                </div>

                                <div className="mt-9 h-[150px] min-w-0">
                                    {cashFlowData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={cashFlowData} barGap={4}>
                                                <XAxis dataKey="date" hide />
                                                <YAxis hide />
                                                <Tooltip
                                                    cursor={{ fill: "rgba(255,255,255,0.025)" }}
                                                    contentStyle={{ background: "#101116", border: "1px solid rgba(255,255,255,.09)", borderRadius: "16px", color: "white", fontSize: 12 }}
                                                />
                                                <Bar dataKey="income" name="Income" fill="#34d399" radius={[7,7,3,3]} />
                                                <Bar dataKey="expense" name="Expenses" fill="#fb7185" radius={[7,7,3,3]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/[0.08] text-xs text-white/25">No cash-flow data for {selectedMonthLabel}.</div>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center gap-5 text-[10px] text-white/30">
                                    <span className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Income</span>
                                    <span className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-rose-400" />Expenses</span>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <Card className="group relative overflow-hidden rounded-[26px] border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.04]">
                                <div className="flex items-center justify-between"><p className="text-xs font-medium text-white/35">Income</p><span className="rounded-xl bg-emerald-400/10 p-2 text-emerald-400"><ArrowUpRight size={16}/></span></div>
                                <p className="mt-6 text-2xl font-bold tracking-[-0.04em] text-white"><AnimatedNumber value={selectedMonthIncome} prefix="₹" /></p>
                                <p className="mt-2 text-[10px] text-emerald-400/70">{selectedMonthLabel}</p>
                            </Card>
                            <Card className="group relative overflow-hidden rounded-[26px] border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.04]">
                                <div className="flex items-center justify-between"><p className="text-xs font-medium text-white/35">Expenses</p><span className="rounded-xl bg-rose-400/10 p-2 text-rose-400"><ArrowDownRight size={16}/></span></div>
                                <p className="mt-6 text-2xl font-bold tracking-[-0.04em] text-white"><AnimatedNumber value={selectedMonthExpense} prefix="₹" /></p>
                                <p className="mt-2 text-[10px] text-rose-400/70">{selectedMonthLabel}</p>
                            </Card>
                            <Card className="group relative overflow-hidden rounded-[26px] border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.04]">
                                <div className="flex items-center justify-between"><p className="text-xs font-medium text-white/35">Savings rate</p><span className="rounded-xl bg-violet-400/10 p-2 text-violet-300"><Sparkles size={16}/></span></div>
                                <p className="mt-6 text-2xl font-bold tracking-[-0.04em] text-white">{monthlySavingsRate.toFixed(1)}%</p>
                                <p className="mt-2 text-[10px] text-white/25">{monthlySavingsRate >= 50 ? "Excellent savings" : monthlySavingsRate >= 30 ? "Healthy savings" : monthlySavingsRate >= 15 ? "Good progress" : "Needs attention"}</p>
                            </Card>
                            <Card className="group relative overflow-hidden rounded-[26px] border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.04]">
                                <div className="flex items-center justify-between"><p className="text-xs font-medium text-white/35">Health score</p><span className="rounded-xl bg-indigo-400/10 p-2 text-indigo-300"><Sparkles size={16}/></span></div>
                                <p className="mt-6 text-2xl font-bold tracking-[-0.04em] text-white">{financialHealth.score}<span className="ml-1 text-xs font-medium text-white/25">/100</span></p>
                                <p className="mt-2 text-[10px] text-white/25">{financialHealth.label}</p>
                            </Card>
                        </div>
                    </section>

                    {/* MONTH COMPARISON */}
                    <section className="grid gap-4 md:grid-cols-3">
                        {[
                            { label: "Expenses", amount: comparison.current.expense, change: comparison.expenseChange, positive: comparison.expenseChange < 0, icon: TrendingDown },
                            { label: "Income", amount: comparison.current.income, change: comparison.incomeChange, positive: comparison.incomeChange > 0, icon: TrendingUp },
                            { label: savingsLabel, amount: Math.abs(comparison.current.savings), change: comparison.savingsChange, positive: comparison.current.savings >= 0 ? comparison.savingsChange > 0 : comparison.savingsChange < 0, icon: Sparkles },
                        ].map((item) => {
                            const Icon = item.icon
                            return (
                                <div key={item.label} className="rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-5 transition hover:border-white/[0.12] hover:bg-white/[0.03]">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">{item.label}</p>
                                            <p className={`mt-3 text-2xl font-bold tracking-[-0.04em] ${item.label === savingsLabel ? (comparison.current.savings >= 0 ? "text-emerald-400" : "text-rose-400") : "text-white"}`}>₹{item.amount.toLocaleString("en-IN")}</p>
                                        </div>
                                        <span className={`rounded-xl p-2.5 ${item.positive ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"}`}><Icon size={16}/></span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <p className={`text-xs font-semibold ${item.positive ? "text-emerald-400" : "text-rose-400"}`}>{formatChange(item.change)}</p>
                                        <p className="text-[10px] text-white/20">vs {previousMonthLabel}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </section>

                    {/* FINANCIAL INTELLIGENCE */}
                    <section className="relative overflow-hidden rounded-[28px] border border-violet-400/[0.10] bg-gradient-to-br from-violet-500/[0.07] via-white/[0.025] to-transparent p-6 sm:p-7">
                        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-violet-500/[0.08] blur-[70px]" />
                        <div className="relative">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/10 text-violet-300"><Sparkles size={17}/></div>
                                <div><p className="text-[9px] font-bold uppercase tracking-[0.24em] text-violet-300/70">Financial intelligence</p><h2 className="mt-1 text-lg font-bold">What's changing?</h2></div>
                            </div>
                            <div className="mt-6 grid gap-3 lg:grid-cols-3">
                                <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-5"><p className="text-[10px] uppercase tracking-[0.15em] text-white/25">Spending trend</p><p className="mt-3 text-sm leading-6 text-white/60">{expenseInsight}</p></div>
                                <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-5"><p className="text-[10px] uppercase tracking-[0.15em] text-white/25">Savings trend</p><p className="mt-3 text-sm leading-6 text-white/60">{savingsInsight}</p></div>
                                <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-5"><p className="text-[10px] uppercase tracking-[0.15em] text-white/25">Largest category</p>{biggestCategory ? <><p className="mt-3 text-base font-bold text-white">{biggestCategory.category}</p><p className="mt-1 text-xs text-white/35">₹{formatMoney(biggestCategory.amount)} spent this month</p></> : <p className="mt-3 text-sm text-white/30">No expense data yet</p>}</div>
                            </div>
                        </div>
                    </section>

                    {/* ANALYTICS GRID */}
                    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(350px,.7fr)]">
                        <Card className="min-w-0 rounded-[28px] border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl sm:p-7">
                            <div className="flex items-end justify-between gap-4"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">Cash flow</p><h3 className="mt-1 text-lg font-semibold">Income vs expenses</h3></div><div className="hidden items-center gap-4 text-[10px] text-white/30 sm:flex"><span className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>Income</span><span className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-rose-400"/>Expenses</span></div></div>
                            <div className="mt-7 h-[290px] min-w-0 sm:h-[330px]">
                                {cashFlowData.length > 0 ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={cashFlowData} margin={{top:10,right:4,left:-18,bottom:0}}><CartesianGrid stroke="rgba(255,255,255,.055)" vertical={false}/><XAxis dataKey="date" tick={{fill:"#71717a",fontSize:10}} tickFormatter={(v)=>String(v).slice(5)} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#71717a",fontSize:10}} tickFormatter={(v)=>`₹${v}`} axisLine={false} tickLine={false}/><Tooltip cursor={{fill:"rgba(255,255,255,.02)"}} contentStyle={{background:"#101116",border:"1px solid rgba(255,255,255,.09)",borderRadius:"16px",fontSize:12}}/><Area type="monotone" dataKey="income" name="Income" fill="#34d399" fillOpacity={0.10} stroke="#34d399" strokeWidth={2.5}/><Area type="monotone" dataKey="expense" name="Expenses" fill="#fb7185" fillOpacity={0.08} stroke="#fb7185" strokeWidth={2.5}/></AreaChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/[0.08] text-xs text-white/25">No transaction data available.</div>}
                            </div>
                        </Card>

                        <Card className="min-w-0 rounded-[28px] border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl sm:p-7">
                            <div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">Spending breakdown</p><h3 className="mt-1 text-lg font-semibold">Where your money goes</h3></div>
                            <div className="relative mt-3 h-[230px] min-w-0">
                                {categoryData.length > 0 ? <><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={62} outerRadius={88} paddingAngle={4} stroke="none">{categoryData.map((entry,index)=><Cell key={`${entry.name}-${index}`} fill={["#a78bfa","#34d399","#60a5fa","#fb7185","#fbbf24"][index%5]}/>)}</Pie><Tooltip contentStyle={{background:"#101116",border:"1px solid rgba(255,255,255,.09)",borderRadius:"16px",fontSize:12}}/></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex items-center justify-center"><div className="text-center"><p className="text-xl font-bold tracking-[-.04em]">₹{formatMoney(selectedMonthExpense)}</p><p className="mt-0.5 text-[9px] uppercase tracking-[.18em] text-white/25">spent</p></div></div></> : <div className="flex h-full items-center justify-center text-xs text-white/25">No spending data yet.</div>}
                            </div>
                            <div className="mt-3 space-y-2.5">
                                {categoryData.slice(0,4).map((category,index)=>{ const percentage=selectedMonthExpense>0?(category.value/selectedMonthExpense)*100:0; return <div key={category.name} className="flex items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.045] text-violet-300">{getCategoryIcon(category.name)}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="truncate text-xs font-medium text-white/70">{category.name}</p><p className="shrink-0 text-xs font-semibold text-white/65">₹{formatMoney(category.value)}</p></div><div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.05]"><div className="h-full rounded-full bg-violet-400/70" style={{width:`${Math.min(100,percentage)}%`}}/></div></div></div>})}
                            </div>
                        </Card>
                    </section>

                    {/* INCOME / EXPENSE BAR */}
                    <Card className="min-w-0 rounded-[28px] border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl sm:p-7">
                        <div className="flex flex-col gap-1"><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">Monthly comparison</p><h3 className="text-lg font-semibold">Income vs expenses</h3><p className="text-xs text-white/30">Total money coming in compared with money going out</p></div>
                        <div className="mt-6 h-[270px] min-w-0 sm:h-[310px]">{incomeExpenseData.some(item=>item.amount>0) ? <ResponsiveContainer width="100%" height="100%"><BarChart data={incomeExpenseData} margin={{top:10,right:5,left:-15,bottom:0}}><CartesianGrid stroke="rgba(255,255,255,.055)" vertical={false}/><XAxis dataKey="name" tick={{fill:"#71717a",fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#71717a",fontSize:10}} tickFormatter={(v)=>`₹${v}`} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:"#101116",border:"1px solid rgba(255,255,255,.09)",borderRadius:"16px",fontSize:12}}/><Bar dataKey="amount" name="Amount" fill="#a78bfa" radius={[8,8,2,2]} barSize={54}/></BarChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/[0.08] text-xs text-white/25">No income or expense data yet.</div>}</div>
                    </Card>

                    {/* INTELLIGENCE MODULES */}


                    {/* BUDGET */}
                    <section className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl sm:p-7">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div><div className="flex items-center gap-2"><p className="text-[9px] font-bold uppercase tracking-[0.22em] text-violet-300/70">Budget health</p><span className="rounded-full bg-violet-400/10 px-2 py-0.5 text-[9px] text-violet-300">{selectedMonthLabel}</span></div><h2 className="mt-2 text-xl font-bold tracking-[-.025em]">Stay within your limits</h2><p className="mt-1 text-xs text-white/30">Track your spending against your monthly budgets.</p></div>
                            <div className="min-w-[170px] lg:text-right"><p className="text-[10px] text-white/25">Overall usage</p><p className="mt-1 text-2xl font-bold">{overallBudgetPercentage.toFixed(0)}%</p><p className="mt-1 text-[10px] text-white/25">₹{formatMoney(totalBudgetSpent)} / ₹{formatMoney(totalBudget)}</p></div>
                        </div>
                        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.05]"><div className={`h-full rounded-full transition-all duration-700 ${overallBudgetPercentage>=100?"bg-rose-400":overallBudgetPercentage>=85?"bg-amber-400":"bg-emerald-400"}`} style={{width:`${displayOverallBudgetPercentage}%`}}/></div>
                        <div className="mt-6 grid gap-3 lg:grid-cols-2">
                            {budgetsError ? <div className="lg:col-span-2 rounded-2xl border border-rose-500/10 bg-rose-500/5 p-8 text-center text-sm text-rose-300">Unable to load budgets.</div> : budgetHealth.length===0 ? <div className="lg:col-span-2 rounded-2xl border border-dashed border-white/[0.08] p-10 text-center"><Wallet size={20} className="mx-auto text-violet-400"/><p className="mt-3 text-sm font-medium">No budgets created</p><p className="mt-1 text-xs text-white/25">Create a budget for {selectedMonthLabel} to start tracking your limits.</p></div> : budgetHealth.map((budget)=>{ const status=getBudgetStatus(budget.percentage); const categoryName=typeof budget.category==="string"?budget.category:budget.category&&typeof budget.category==="object"?budget.category.name??"Uncategorized":"Uncategorized"; return <div key={budget.id} className="rounded-2xl border border-white/[0.07] bg-black/10 p-5 transition hover:border-white/[0.12] hover:bg-white/[0.025]"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="truncate text-sm font-semibold">{categoryName}</p><p className="mt-1 text-[10px] text-white/25">₹{formatMoney(budget.spent)} / ₹{formatMoney(budget.limit)}</p></div><div className="text-right"><p className="text-sm font-bold">{budget.percentage.toFixed(0)}%</p><p className={`mt-1 text-[10px] font-semibold ${status.className}`}>{status.label}</p></div></div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.05]"><div className={`h-full rounded-full ${budget.percentage>=100?"bg-rose-400":budget.percentage>=85?"bg-amber-400":"bg-emerald-400"}`} style={{width:`${budget.displayPercentage}%`}}/></div><div className="mt-3 flex justify-between text-[10px]"><span className="text-white/20">Remaining</span><span className={budget.remaining<0?"text-rose-400":"text-white/45"}>₹{formatMoney(Math.abs(budget.remaining))}{budget.remaining<0?" over":""}</span></div></div>})}
                        </div>
                    </section>

                    {/* FINANCIAL HEALTH SCORE */}
                    <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.06] to-white/[0.02] p-6 backdrop-blur-xl sm:p-7">
                            <div className="flex items-center justify-between gap-4"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">Financial health</p><h2 className="mt-2 text-2xl font-bold tracking-[-.035em]">{financialHealth.label}</h2><p className="mt-1 text-xs text-white/30">A quick snapshot of your savings and budget discipline.</p></div><div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-violet-400/20 bg-violet-400/[0.06] shadow-[0_0_60px_rgba(139,92,246,.08)]"><div className="text-center"><p className="text-xl font-bold">{financialHealth.score}</p><p className="text-[8px] uppercase tracking-[.18em] text-white/25">score</p></div></div></div>
                            <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/[0.05]"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-emerald-400 transition-all duration-700" style={{width:`${financialHealth.score}%`}}/></div><div className="mt-2 flex justify-between text-[9px] text-white/20"><span>Needs attention</span><span>Excellent</span></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"><p className="text-[10px] text-white/25">Savings rate</p><p className="mt-3 text-2xl font-bold">{monthlySavingsRate.toFixed(0)}%</p></div>
                            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"><p className="text-[10px] text-white/25">Budget use</p><p className="mt-3 text-2xl font-bold">{overallBudgetPercentage.toFixed(0)}%</p></div>
                            <div className="col-span-2 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"><p className="text-[10px] text-white/25">Monthly net</p><p className={`mt-2 text-xl font-bold ${comparison.current.savings>=0?"text-emerald-400":"text-rose-400"}`}>{comparison.current.savings>=0?"+":"-"}₹{formatMoney(Math.abs(comparison.current.savings))}</p></div>
                        </div>
                    </section>

                    {/* RECENT TRANSACTIONS */}
                    <Card className="overflow-hidden rounded-[28px] border-white/[0.08] bg-white/[0.025] backdrop-blur-xl">
                        <div className="flex flex-col gap-4 border-b border-white/[0.07] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7"><div><div className="flex items-center gap-2"><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">Activity</p><span className="rounded-full border border-white/[0.07] bg-white/5 px-2 py-0.5 text-[9px] text-white/30">{monthlyTransactions.length}</span></div><h3 className="mt-2 text-lg font-semibold">Recent transactions</h3><p className="mt-1 text-xs text-white/30">Your latest financial activity for {selectedMonthLabel}.</p></div><button className="self-start rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2 text-xs font-semibold text-white/45 transition hover:border-white/15 hover:bg-white/[0.05] hover:text-white">View all <span className="ml-1">→</span></button></div>
                        <div className="divide-y divide-white/[0.05]">
                            {monthlyTransactions.length===0 ? <div className="px-6 py-16 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-white/25"><Wallet size={22}/></div><p className="mt-4 font-medium">No transactions in {selectedMonthLabel}</p><p className="mt-1 text-xs text-white/30">Add a transaction or select another month.</p><Button className="mt-5 rounded-xl bg-white text-black hover:bg-white/90"><Plus size={15} className="mr-1.5"/>Add transaction</Button></div> : monthlyTransactions.slice(0,6).map((transaction,index)=><div key={transaction.id} className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 transition hover:bg-white/[0.025] sm:px-7"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${transaction.type==="INCOME"?"border-emerald-400/10 bg-emerald-400/[0.08] text-emerald-400":"border-white/[0.08] bg-white/[0.035] text-white/50"}`}>{getCategoryIcon(transaction.category)}</div><div className="min-w-0"><div className="flex min-w-0 items-center gap-2"><p className="truncate text-sm font-semibold text-white">{transaction.title||"Untitled transaction"}</p>{index===0&&<span className="hidden shrink-0 rounded-full bg-violet-400/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-violet-300 sm:inline-flex">Latest</span>}</div><p className="mt-1 truncate text-[10px] text-white/25">{transaction.category||"Other"} · {transaction.date}</p></div><div className="text-right"><p className={`text-sm font-semibold ${transaction.type==="INCOME"?"text-emerald-400":"text-white/85"}`}>{transaction.type==="INCOME"?"+":"-"}₹{formatMoney(Math.abs(Number(transaction.amount)||0))}</p><p className="mt-1 text-[8px] uppercase tracking-[.16em] text-white/20">{transaction.type}</p></div></div>)}
                        </div>
                    </Card>

                    <footer className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.015] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400"><Sparkles size={15}/></div><div><p className="text-xs font-medium text-white/60">Financial snapshot</p><p className="text-[10px] text-white/25">Keep tracking your spending to improve your financial health.</p></div></div><span className="text-[9px] font-bold tracking-[0.24em] text-white/20">FINORA</span></footer>
                </main>
            </div>
        </div>
    )
}

export default Dashboard
