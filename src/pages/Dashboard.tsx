import {
    ArrowDownRight,
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
} from "lucide-react"
import {
    calculateFinancialHealth,
} from "@/utils/financialHealth"
import {

    calculateFinancialInsights,
} from "@/utils/financialInsights"
import { useMemo } from "react"
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

import { getSummary } from "@/services/summaryApi"
import { getTransactions } from "@/services/transactionApi"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

function Dashboard() {

    // =====================================================
    // API — SUMMARY
    // =====================================================

    const {
        data: summary,
        isLoading: summaryLoading,
        isError: summaryError,
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
    } = useQuery({
        queryKey: ["transactions"],
        queryFn: getTransactions,
    })

    console.log("TRANSACTIONS:", transactions)


    // =====================================================
    // SAVINGS RATE
    // =====================================================

    const savingsRate = useMemo(() => {

        if (!summary || summary.totalIncome <= 0) {
            return 0
        }

        return (
            (
                (summary.totalIncome -
                    summary.totalExpense) /
                summary.totalIncome
            ) * 100
        )

    }, [summary])

    const insights =
        useMemo(
            () =>
                calculateFinancialInsights(
                    transactions
                ),
            [transactions]
        )

    const health =
        useMemo(
            () =>
                calculateFinancialHealth(
                    insights.totalIncome,
                    insights.totalExpense
                ),
            [
                insights.totalIncome,
                insights.totalExpense,
            ]
        )


    // =====================================================
    // CATEGORY BREAKDOWN
    // =====================================================

    const categoryData = useMemo(() => {

        const totals: Record<string, number> = {}

        transactions
            .filter(
                (transaction) =>
                    transaction.type === "EXPENSE"
            )
            .forEach(
                (transaction) => {

                    const category =
                        transaction.category ??
                        "Other"

                    totals[category] =
                        (
                            totals[category] ??
                            0
                        ) +
                        transaction.amount
                }
            )

        return Object.entries(totals)
            .map(
                ([
                    name,
                    value,
                ]) => ({
                    name,
                    value,
                })
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    b.value -
                    a.value
            )

    }, [transactions])


    // =====================================================
    // INCOME / EXPENSE DATA
    // =====================================================

    const incomeExpenseData = useMemo(() => {

        const income =
            transactions
                .filter(
                    (transaction) =>
                        transaction.type ===
                        "INCOME"
                )
                .reduce(
                    (
                        total,
                        transaction
                    ) =>
                        total +
                        transaction.amount,
                    0
                )

        const expense =
            transactions
                .filter(
                    (transaction) =>
                        transaction.type ===
                        "EXPENSE"
                )
                .reduce(
                    (
                        total,
                        transaction
                    ) =>
                        total +
                        transaction.amount,
                    0
                )

        return [
            {
                name: "Income",
                amount: income,
            },
            {
                name: "Expenses",
                amount: expense,
            },
        ]

    }, [transactions])


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

        transactions.forEach(
            (transaction) => {

                const date =
                    transaction.date

                if (!grouped[date]) {

                    grouped[date] = {
                        income: 0,
                        expense: 0,
                    }
                }

                if (
                    transaction.type ===
                    "INCOME"
                ) {

                    grouped[date].income +=
                        transaction.amount

                } else {

                    grouped[date].expense +=
                        transaction.amount
                }
            }
        )

        return Object.entries(grouped)
            .sort(
                (
                    a,
                    b
                ) =>
                    a[0].localeCompare(
                        b[0]
                    )
            )
            .map(
                ([
                    date,
                    values,
                ]) => ({

                    date,

                    income:
                        values.income,

                    expense:
                        values.expense,

                    net:
                        values.income -
                        values.expense,

                })
            )

    }, [transactions])


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
            value.includes("restaurant")
        ) {

            return (
                <Utensils
                    size={18}
                />
            )
        }

        if (
            value.includes("travel") ||
            value.includes("transport") ||
            value.includes("bus")
        ) {

            return (
                <Bus
                    size={18}
                />
            )
        }

        if (
            value.includes("shopping")
        ) {

            return (
                <ShoppingBag
                    size={18}
                />
            )
        }

        if (
            value.includes("salary") ||
            value.includes("income")
        ) {

            return (
                <CircleDollarSign
                    size={18}
                />
            )
        }

        if (
            value.includes("bill")
        ) {

            return (
                <Receipt
                    size={18}
                />
            )
        }

        return (
            <Wallet
                size={18}
            />
        )
    }


    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (
        amount: number,
        decimals = false
    ) => {

        return amount.toLocaleString(
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

                            <ArrowDownRight
                                size={24}
                            />

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

        <div className="min-h-screen bg-[#07080c] text-white">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#07080c]/85 backdrop-blur-xl">

                <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">

                    <div>

                        <div className="flex items-center gap-2">

                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
                                {currentDate}
                            </p>

                        </div>

                        <h1 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
                            Good evening 👋
                        </h1>

                        <p className="mt-1 text-sm text-white/40">
                            Here's your financial overview.
                        </p>

                    </div>

                    <Button className="group w-fit rounded-xl bg-white px-4 text-black shadow-lg shadow-white/5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-xl">

                        <Plus
                            size={17}
                            className="transition-transform duration-300 group-hover:rotate-90"
                        />

                        Add transaction

                    </Button>

                </div>

            </header>


            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            <main className="space-y-6 p-6 lg:p-10">


                {/* ================================================= */}
                {/* BALANCE HERO */}
                {/* ================================================= */}

                <Card
                    className="group relative overflow-hidden rounded-3xl border-white/[0.08] bg-white/[0.025] backdrop-blur-xl">

                    <div
                        className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl transition duration-700 group-hover:bg-violet-500/15"/>

                    <div
                        className="pointer-events-none absolute -bottom-40 -left-20 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl"/>


                    <div className="relative p-7 sm:p-8">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                                    Total balance
                                </p>

                                <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl">

                                    {summaryLoading
                                        ? "Loading..."
                                        : `₹${formatMoney(
                                            summary?.balance ?? 0,
                                            true
                                        )}`}

                                </h2>

                                <div className="mt-4 flex flex-wrap items-center gap-2">

                                    <span
                                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-400">

                                        <TrendingUp
                                            size={13}
                                        />

                                        Healthy

                                    </span>

                                    <span className="text-xs text-white/30">
                                        Current available balance
                                    </span>

                                </div>

                            </div>


                            <div
                                className="rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 text-white shadow-xl shadow-black/10">

                                <Wallet
                                    size={22}
                                />

                            </div>

                        </div>


                        {/* Mini chart */}

                        <div className="mt-10 h-28 sm:h-32">

                            {cashFlowData.length > 0 ? (

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <BarChart
                                        data={cashFlowData}
                                        barGap={3}
                                    >

                                        <XAxis
                                            dataKey="date"
                                            hide
                                        />

                                        <YAxis
                                            hide
                                        />

                                        <Tooltip
                                            cursor={{
                                                fill: "rgba(255,255,255,0.03)",
                                            }}
                                            contentStyle={{
                                                background: "#111318",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "14px",
                                                color: "white",
                                            }}
                                        />

                                        <Bar
                                            dataKey="income"
                                            name="Income"
                                            fill="#34d399"
                                            radius={[
                                                6,
                                                6,
                                                2,
                                                2,
                                            ]}
                                        />

                                        <Bar
                                            dataKey="expense"
                                            name="Expenses"
                                            fill="#fb7185"
                                            radius={[
                                                6,
                                                6,
                                                2,
                                                2,
                                            ]}
                                        />

                                    </BarChart>

                                </ResponsiveContainer>

                            ) : (

                                <div
                                    className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-white/25">
                                    No cash-flow data yet.
                                </div>

                            )}

                        </div>

                    </div>

                </Card>


                {/* ================================================= */}
                {/* METRICS */}
                {/* ================================================= */}

                <div className="grid gap-4 md:grid-cols-3">


                    {/* INCOME */}

                    <Card
                        className="group rounded-2xl border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.04]">

                        <div className="flex items-center justify-between">

                            <p className="text-sm font-medium text-white/45">
                                Income
                            </p>

                            <div
                                className="rounded-xl border border-emerald-400/10 bg-emerald-400/10 p-2.5 text-emerald-400">

                                <ArrowUpRight
                                    size={17}
                                />

                            </div>

                        </div>


                        <p className="mt-5 text-2xl font-bold tracking-tight text-white">

                            {summaryLoading
                                ? "Loading..."
                                : `₹${formatMoney(
                                    summary?.totalIncome ?? 0
                                )}`}

                        </p>


                        <div className="mt-2 flex items-center gap-1.5">

                            <TrendingUp
                                size={13}
                                className="text-emerald-400"
                            />

                            <p className="text-xs text-emerald-400">
                                Total income
                            </p>

                        </div>

                    </Card>


                    {/* EXPENSE */}

                    <Card
                        className="group rounded-2xl border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.04]">

                        <div className="flex items-center justify-between">

                            <p className="text-sm font-medium text-white/45">
                                Expenses
                            </p>

                            <div className="rounded-xl border border-rose-400/10 bg-rose-400/10 p-2.5 text-rose-400">

                                <ArrowDownRight
                                    size={17}
                                />

                            </div>

                        </div>


                        <p className="mt-5 text-2xl font-bold tracking-tight text-white">

                            {summaryLoading
                                ? "Loading..."
                                : `₹${formatMoney(
                                    summary?.totalExpense ?? 0
                                )}`}

                        </p>


                        <div className="mt-2 flex items-center gap-1.5">

                            <TrendingDown
                                size={13}
                                className="text-rose-400"
                            />

                            <p className="text-xs text-rose-400">
                                Total expenses
                            </p>

                        </div>

                    </Card>


                    {/* SAVINGS */}

                    <Card
                        className="group rounded-2xl border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.04]">

                        <div className="flex items-center justify-between">

                            <p className="text-sm font-medium text-white/45">
                                Savings rate
                            </p>

                            <div
                                className="rounded-xl border border-violet-400/10 bg-violet-400/10 p-2.5 text-violet-400">

                                <Sparkles
                                    size={17}
                                />

                            </div>

                        </div>


                        <p className="mt-5 text-2xl font-bold tracking-tight text-white">

                            {summaryLoading
                                ? "Loading..."
                                : `${savingsRate.toFixed(1)}%`}

                        </p>


                        <p className="mt-2 text-xs text-white/35">

                            {savingsRate >= 50
                                ? "Excellent savings"
                                : savingsRate >= 30
                                    ? "Healthy savings"
                                    : savingsRate >= 15
                                        ? "Good progress"
                                        : "Needs attention"}

                        </p>

                    </Card>

                </div>


                {/* ================================================= */}
                {/* ANALYTICS */}
                {/* ================================================= */}

                <div className="grid gap-6 xl:grid-cols-3">


                    {/* ================================================= */}
                    {/* CASH FLOW */}
                    {/* ================================================= */}

                    <Card
                        className="rounded-3xl border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl xl:col-span-2">

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <div className="flex items-center gap-2">

                                    <h3 className="font-semibold text-white">
                                        Cash flow
                                    </h3>

                                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/35">
                                        LIVE
                                    </span>

                                </div>

                                <p className="mt-1 text-sm text-white/35">
                                    Income vs expenses over time
                                </p>

                            </div>


                            <button
                                className="w-fit rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-medium text-white/50 transition hover:border-white/20 hover:text-white">
                                August 2026
                            </button>

                        </div>


                        <div className="mt-8 h-64">

                            {cashFlowData.length > 0 ? (

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <AreaChart
                                        data={cashFlowData}
                                        margin={{
                                            top: 5,
                                            right: 5,
                                            left: -20,
                                            bottom: 0,
                                        }}
                                    >

                                        <CartesianGrid
                                            stroke="rgba(255,255,255,0.06)"
                                            vertical={false}
                                        />

                                        <XAxis
                                            dataKey="date"
                                            tick={{
                                                fill: "#71717a",
                                                fontSize: 11,
                                            }}
                                            tickFormatter={(
                                                value
                                            ) =>
                                                String(
                                                    value
                                                ).slice(5)
                                            }
                                            axisLine={false}
                                            tickLine={false}
                                        />

                                        <YAxis
                                            tick={{
                                                fill: "#71717a",
                                                fontSize: 11,
                                            }}
                                            tickFormatter={(
                                                value
                                            ) =>
                                                `₹${value}`
                                            }
                                            axisLine={false}
                                            tickLine={false}
                                        />

                                        <Tooltip
                                            cursor={{
                                                fill: "rgba(255,255,255,0.025)",
                                            }}
                                            contentStyle={{
                                                background: "#111318",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "14px",
                                            }}
                                            labelStyle={{
                                                color: "#a1a1aa",
                                                marginBottom: "6px",
                                            }}
                                            formatter={(
                                                value,
                                                name
                                            ) => [
                                                `₹${Number(
                                                    value
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}`,
                                                name ===
                                                "income"
                                                    ? "Income"
                                                    : "Expenses",
                                            ]}
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="income"
                                            name="Income"
                                            fill="#34d399"
                                            fillOpacity={0.15}
                                            stroke="#34d399"
                                            strokeWidth={2}
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="expense"
                                            name="Expenses"
                                            fill="#fb7185"
                                            fillOpacity={0.15}
                                            stroke="#fb7185"
                                            strokeWidth={2}
                                        />

                                    </AreaChart>

                                </ResponsiveContainer>

                            ) : (

                                <div
                                    className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-white/25">
                                    No transaction data available.
                                </div>

                            )}

                        </div>


                        <div className="mt-5 flex items-center gap-5 text-xs">

                            <div className="flex items-center gap-2 text-white/40">

                                <span className="h-2 w-2 rounded-full bg-emerald-400"/>

                                Income

                            </div>


                            <div className="flex items-center gap-2 text-white/40">

                                <span className="h-2 w-2 rounded-full bg-rose-400"/>

                                Expenses

                            </div>

                        </div>

                    </Card>


                    {/* ================================================= */}
                    {/* SPENDING */}
                    {/* ================================================= */}

                    <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl">

                        <div>

                            <h3 className="font-semibold text-white">
                                Spending breakdown
                            </h3>

                            <p className="mt-1 text-sm text-white/35">
                                Where your money goes
                            </p>

                        </div>


                        <div className="relative mt-4 h-48">

                            {categoryData.length === 0 ? (

                                <div
                                    className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">

                                    <div
                                        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
                                        📊
                                    </div>

                                    <h3 className="mt-4 text-sm font-semibold text-white">
                                        No spending data yet
                                    </h3>

                                    <p className="mt-1 max-w-xs text-xs text-white/30">
                                        Add an expense to see your
                                        spending breakdown.
                                    </p>

                                </div>

                            ) : (

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <PieChart>

                                        <Pie
                                            data={categoryData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={58}
                                            outerRadius={82}
                                            paddingAngle={4}
                                            stroke="none"
                                        >

                                            {categoryData.map(
                                                (
                                                    entry,
                                                    index
                                                ) => (

                                                    <Cell
                                                        key={`${entry.name}-${index}`}
                                                        fill={
                                                            [
                                                                "#a78bfa",
                                                                "#34d399",
                                                                "#60a5fa",
                                                                "#fb7185",
                                                                "#fbbf24",
                                                            ][
                                                            index % 5
                                                                ]
                                                        }
                                                    />

                                                )
                                            )}

                                        </Pie>


                                        <Tooltip
                                            contentStyle={{
                                                background: "#111318",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "14px",
                                            }}
                                            formatter={(
                                                value
                                            ) =>
                                                `₹${Number(
                                                    value
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}`
                                            }
                                        />

                                    </PieChart>

                                </ResponsiveContainer>

                            )}


                            {categoryData.length > 0 && (

                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                                    <div className="text-center">

                                        <p className="text-lg font-bold text-white">
                                            ₹{formatMoney(
                                            summary?.totalExpense ?? 0
                                        )}
                                        </p>

                                        <p className="text-[10px] uppercase tracking-wider text-white/30">
                                            spent
                                        </p>

                                    </div>

                                </div>

                            )}

                        </div>


                        <div className="mt-4 space-y-3">

                            {categoryData
                                .slice(0, 4)
                                .map(
                                    (
                                        category,
                                        index
                                    ) => {

                                        const percentage =
                                            summary &&
                                            summary.totalExpense > 0
                                                ? (
                                                    (
                                                        category.value /
                                                        summary.totalExpense
                                                    ) *
                                                    100
                                                )
                                                : 0

                                        return (

                                            <div
                                                key={category.name}
                                                className="flex items-center justify-between"
                                            >

                                                <div className="flex min-w-0 items-center gap-3">

                                                    <div
                                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                                                        style={{
                                                            background:
                                                                [
                                                                    "rgba(167,139,250,0.1)",
                                                                    "rgba(52,211,153,0.1)",
                                                                    "rgba(96,165,250,0.1)",
                                                                    "rgba(251,113,133,0.1)",
                                                                    "rgba(251,191,36,0.1)",
                                                                ][
                                                                index % 5
                                                                    ],
                                                        }}
                                                    >

                                                        <span
                                                            style={{
                                                                color:
                                                                    [
                                                                        "#a78bfa",
                                                                        "#34d399",
                                                                        "#60a5fa",
                                                                        "#fb7185",
                                                                        "#fbbf24",
                                                                    ][
                                                                    index % 5
                                                                        ],
                                                            }}
                                                        >

                                                            {getCategoryIcon(
                                                                category.name
                                                            )}

                                                        </span>

                                                    </div>


                                                    <div className="min-w-0">

                                                        <p className="truncate text-sm font-medium text-white/75">
                                                            {category.name}
                                                        </p>

                                                        <p className="text-[11px] text-white/30">
                                                            {percentage.toFixed(
                                                                0
                                                            )}
                                                            %
                                                        </p>

                                                    </div>

                                                </div>


                                                <p className="shrink-0 text-sm font-semibold text-white">
                                                    ₹{formatMoney(
                                                    category.value
                                                )}
                                                </p>

                                            </div>

                                        )
                                    }
                                )}

                        </div>

                    </Card>

                </div>


                {/* ================================================= */}
                {/* INCOME / EXPENSE SUMMARY */}
                {/* ================================================= */}

                <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl">

                    <div>

                        <h3 className="font-semibold text-white">
                            Income vs expenses
                        </h3>

                        <p className="mt-1 text-sm text-white/35">
                            Total money coming in compared with money going out
                        </p>

                    </div>


                    <div className="mt-8 h-[280px]">

                        {incomeExpenseData.some(
                            (item) =>
                                item.amount > 0
                        ) ? (

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <BarChart
                                    data={incomeExpenseData}
                                    margin={{
                                        top: 5,
                                        right: 5,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >

                                    <CartesianGrid
                                        stroke="rgba(255,255,255,0.06)"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="name"
                                        tick={{
                                            fill: "#71717a",
                                            fontSize: 11,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        tick={{
                                            fill: "#71717a",
                                            fontSize: 11,
                                        }}
                                        tickFormatter={(
                                            value
                                        ) =>
                                            `₹${value}`
                                        }
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <Tooltip
                                        cursor={{
                                            fill: "rgba(255,255,255,0.025)",
                                        }}
                                        contentStyle={{
                                            background: "#111318",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: "14px",
                                        }}
                                        formatter={(
                                            value
                                        ) =>
                                            `₹${Number(
                                                value
                                            ).toLocaleString(
                                                "en-IN"
                                            )}`
                                        }
                                    />

                                    <Bar
                                        dataKey="amount"
                                        name="Amount"
                                        fill="#a78bfa"
                                        radius={[
                                            6,
                                            6,
                                            0,
                                            0,
                                        ]}
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        ) : (

                            <div
                                className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-white/25">
                                No income or expense data yet.
                            </div>

                        )}

                    </div>

                </Card>

                <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl">

                    <div className="flex items-center gap-3">

                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">

                            ✨

                        </div>

                        <div>

                            <h2 className="text-sm font-semibold text-white">
                                Smart Insights
                            </h2>

                            <p className="mt-0.5 text-xs text-white/30">
                                Based on your transaction activity
                            </p>

                        </div>

                    </div>


                    <div className="mt-6 grid gap-3 md:grid-cols-3">


                        {/* ================================================= */}
                        {/* TOP CATEGORY */}
                        {/* ================================================= */}

                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">

                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                                Biggest spending
                            </p>


                            {insights.topCategory ? (

                                <>

                                    <p className="mt-3 text-lg font-bold text-white">

                                        {insights.topCategory}

                                    </p>

                                    <p className="mt-1 text-xs text-white/35">

                                        ₹
                                        {insights.topCategoryAmount.toLocaleString(
                                            "en-IN"
                                        )}

                                        {" "}spent

                                    </p>

                                </>

                            ) : (

                                <p className="mt-3 text-sm text-white/30">
                                    No expense data yet
                                </p>

                            )}

                        </div>


                        {/* ================================================= */}
                        {/* SAVINGS RATE */}
                        {/* ================================================= */}

                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">

                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                                Savings rate
                            </p>


                            <p className="mt-3 text-lg font-bold text-emerald-400">

                                {insights.savingsRate.toFixed(
                                    1
                                )}
                                %

                            </p>


                            <p className="mt-1 text-xs text-white/35">

                                of your income remains

                            </p>

                        </div>


                        {/* ================================================= */}
                        {/* CASH FLOW */}
                        {/* ================================================= */}

                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">

                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                                Net cash flow
                            </p>


                            <p
                                className={`mt-3 text-lg font-bold ${
                                    insights.balance >= 0
                                        ? "text-emerald-400"
                                        : "text-rose-400"
                                }`}
                            >

                                {insights.balance >=
                                0
                                    ? "+"
                                    : "-"}

                                ₹
                                {Math.abs(
                                    insights.balance
                                ).toLocaleString(
                                    "en-IN"
                                )}

                            </p>


                            <p className="mt-1 text-xs text-white/35">

                                after expenses

                            </p>

                        </div>

                    </div>

                </section>

                <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
                                Financial health
                            </p>

                            <h2 className="mt-2 text-xl font-bold text-white">
                                {health.label}
                            </h2>

                        </div>


                        <div
                            className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10">

                            <div className="text-center">

                                <p className="text-xl font-bold text-white">
                                    {health.score}
                                </p>

                                <p className="text-[9px] uppercase tracking-wider text-white/25">
                                    score
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="mt-6">

                        <div className="h-2 overflow-hidden rounded-full bg-white/5">

                            <div
                                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-700"
                                style={{
                                    width:
                                        `${health.score}%`,
                                }}
                            />

                        </div>


                        <div className="mt-2 flex justify-between text-[10px] text-white/20">

            <span>
                Needs attention
            </span>

                            <span>
                Excellent
            </span>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* RECENT TRANSACTIONS */}
                {/* ================================================= */}

                <Card className="overflow-hidden rounded-3xl border-white/[0.08] bg-white/[0.025] backdrop-blur-xl">

                    <div
                        className="flex flex-col gap-4 border-b border-white/[0.07] p-6 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <div className="flex items-center gap-2">

                                <h3 className="font-semibold text-white">
                                    Recent transactions
                                </h3>

                                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/30">
                                    {transactions.length}
                                </span>

                            </div>

                            <p className="mt-1 text-sm text-white/35">
                                Your latest financial activity
                            </p>

                        </div>


                        <button className="w-fit text-sm font-medium text-white/40 transition hover:text-white">
                            View all →
                        </button>

                    </div>


                    <div className="divide-y divide-white/[0.05]">

                        {transactionsLoading ? (

                            <>

                                <div className="flex h-20 animate-pulse items-center gap-4 px-6">

                                    <div className="h-10 w-10 rounded-xl bg-white/5"/>

                                    <div className="space-y-2">

                                        <div className="h-3 w-32 rounded bg-white/5"/>

                                        <div className="h-2 w-24 rounded bg-white/5"/>

                                    </div>

                                </div>


                                <div className="flex h-20 animate-pulse items-center gap-4 px-6">

                                    <div className="h-10 w-10 rounded-xl bg-white/5"/>

                                    <div className="space-y-2">

                                        <div className="h-3 w-32 rounded bg-white/5"/>

                                        <div className="h-2 w-24 rounded bg-white/5"/>

                                    </div>

                                </div>


                                <div className="flex h-20 animate-pulse items-center gap-4 px-6">

                                    <div className="h-10 w-10 rounded-xl bg-white/5"/>

                                    <div className="space-y-2">

                                        <div className="h-3 w-32 rounded bg-white/5"/>

                                        <div className="h-2 w-24 rounded bg-white/5"/>

                                    </div>

                                </div>

                            </>

                        ) : transactions.length === 0 ? (

                            <div className="px-6 py-14 text-center">

                                <div
                                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/30">

                                    <Wallet
                                        size={22}
                                    />

                                </div>

                                <p className="mt-4 font-medium text-white">
                                    No transactions yet
                                </p>

                                <p className="mt-1 text-sm text-white/35">
                                    Add your first transaction to get started.
                                </p>

                                <Button className="mt-5 rounded-xl bg-white text-black hover:bg-white/90">

                                    <Plus
                                        size={16}
                                    />

                                    Add transaction

                                </Button>

                            </div>

                        ) : (

                            transactions
                                .slice(0, 5)
                                .map(
                                    (
                                        transaction
                                    ) => (

                                        <div
                                            key={transaction.id}
                                            className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors duration-200 hover:bg-white/[0.025]"
                                        >

                                            {/* LEFT */}

                                            <div className="flex min-w-0 items-center gap-4">

                                                <div
                                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-white/55 transition group-hover:border-white/15 group-hover:text-white">

                                                    {getCategoryIcon(
                                                        transaction.category ??
                                                        "Other"
                                                    )}

                                                </div>


                                                <div className="min-w-0">

                                                    <p className="truncate text-sm font-semibold text-white">

                                                        {transaction.title ||
                                                            "Untitled transaction"}

                                                    </p>

                                                    <p className="mt-1 truncate text-xs text-white/30">

                                                        {transaction.category ??
                                                            "Other"}

                                                        {" · "}

                                                        {transaction.date}

                                                    </p>

                                                </div>

                                            </div>


                                            {/* RIGHT */}

                                            <div className="flex shrink-0 items-center gap-4">

                                                <div className="text-right">

                                                    <p
                                                        className={
                                                            transaction.type ===
                                                            "INCOME"
                                                                ? "text-sm font-bold text-emerald-400"
                                                                : "text-sm font-bold text-white"
                                                        }
                                                    >

                                                        {transaction.type ===
                                                        "INCOME"
                                                            ? "+"
                                                            : "-"}

                                                        ₹{formatMoney(
                                                        transaction.amount
                                                    )}

                                                    </p>

                                                    <p className="mt-1 text-[10px] uppercase tracking-wider text-white/20">

                                                        {transaction.type}

                                                    </p>

                                                </div>


                                                <button
                                                    className="hidden rounded-lg p-2 text-white/20 opacity-0 transition hover:bg-white/5 hover:text-white sm:block sm:group-hover:opacity-100">

                                                    <MoreHorizontal
                                                        size={18}
                                                    />

                                                </button>

                                            </div>

                                        </div>

                                    )
                                )

                        )}

                    </div>

                </Card>


                {/* ================================================= */}
                {/* FOOTER INSIGHT */}
                {/* ================================================= */}

                <div
                    className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.018] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">

                            <Sparkles
                                size={16}
                            />

                        </div>

                        <div>

                            <p className="text-sm font-medium text-white/70">
                                Financial snapshot
                            </p>

                            <p className="text-xs text-white/30">
                                Keep tracking your spending to improve your financial health.
                            </p>

                        </div>

                    </div>


                    <span className="text-xs font-medium text-white/25">
                        FINORA
                    </span>

                </div>

            </main>

        </div>
    )
}

export default Dashboard
