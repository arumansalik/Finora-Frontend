import {
    useState,
} from "react"

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

import {
    ChevronLeft,
    ChevronRight,
    TrendingDown,
    TrendingUp,
    Wallet,
    PiggyBank,
    Receipt,
    Sparkles,
    BarChart3,
    PieChart as PieChartIcon,
    Download,
} from "lucide-react"
import {
    exportAnalyticsPDF,
} from "@/utils/exportAnalyticsPDF"
import {
    useAnalytics,
} from "@/hooks/useAnalytics"

import {
    useBudgets,
} from "@/hooks/useBudget"

import {
    calculateFinancialHealth,
} from "@/utils/financialHealth"

import {
    generateFinancialInsights,
} from "@/utils/generateFinancialInsights"

import {
    exportAnalyticsCSV,
} from "@/utils/exportAnalytics"

import {
    Card,
} from "@/components/ui/card"


// =====================================================
// TYPES
// =====================================================

interface MonthlyAnalytics {
    month: string
    income: number
    expense: number
    savings?: number
}

interface CategoryAnalytics {
    category: string
    amount: number
    percentage: number
}


// =====================================================
// HELPERS
// =====================================================

const formatCurrency = (
    value: number
) => {
    return `₹${value.toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 0,
        }
    )}`
}


// =====================================================
// TOOLTIP
// =====================================================

const CustomTooltip = ({
                           active,
                           payload,
                           label,
                       }: any) => {

    if (
        !active ||
        !payload ||
        !payload.length
    ) {
        return null
    }

    return (
        <div className="rounded-xl border border-white/10 bg-[#111318]/95 px-4 py-3 shadow-2xl backdrop-blur-xl">

            <p className="mb-2 text-xs font-medium text-white/40">
                {label}
            </p>

            {payload.map(
                (
                    item: any
                ) => (
                    <div
                        key={item.dataKey}
                        className="flex items-center justify-between gap-8 py-0.5"
                    >
                        <span className="text-xs text-white/50">
                            {item.name}
                        </span>

                        <span className="text-xs font-semibold text-white">
                            {formatCurrency(
                                Number(
                                    item.value
                                )
                            )}
                        </span>
                    </div>
                )
            )}

        </div>
    )
}


// =====================================================
// CHANGE BADGE
// =====================================================

const ChangeBadge = ({
                         value,
                         inverse = false,
                     }: {
    value: number
    inverse?: boolean
}) => {

    const isPositive =
        inverse
            ? value <= 0
            : value >= 0

    return (
        <span
            className={`flex items-center gap-1 text-xs font-medium ${
                isPositive
                    ? "text-emerald-400"
                    : "text-rose-400"
            }`}
        >
            {value >= 0 ? (
                <TrendingUp size={13} />
            ) : (
                <TrendingDown size={13} />
            )}

            {Math.abs(value).toFixed(1)}%
        </span>
    )
}


// =====================================================
// ANALYTICS
// =====================================================

function Analytics() {

    // =====================================================
    // CURRENT DATE
    // =====================================================

    const now = new Date()

    // =====================================================
    // MONTH STATE
    // =====================================================

    const [
        selectedMonth,
        setSelectedMonth,
    ] = useState(
        now.getMonth()
    )

    const [
        selectedYear,
        setSelectedYear,
    ] = useState(
        now.getFullYear()
    )

    // =====================================================
    // ANALYTICS QUERY
    // =====================================================

    const {
        data: analytics,
        isLoading: analyticsLoading,
        isError: analyticsError,
        refetch: refetchAnalytics,
    } = useAnalytics(
        selectedMonth + 1,
        selectedYear
    )

    // =====================================================
    // BUDGET QUERY
    // =====================================================

    const {
        data: budgets = [],
        isLoading: budgetsLoading,
        isError: budgetsError,
        refetch: refetchBudgets,
    } = useBudgets(
        selectedMonth + 1,
        selectedYear
    )

    // =====================================================
    // MONTH LABEL
    // =====================================================

    const monthLabel =
        new Date(
            selectedYear,
            selectedMonth,
            1
        ).toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric",
            }
        )

    // =====================================================
    // EXPORT CSV
    // =====================================================

    const handleExportCSV = () => {

        if (!analytics) {
            return
        }

        exportAnalyticsCSV(
            analytics,
            selectedMonth + 1,
            selectedYear
        )
    }

    const handleExportPDF = () => {

        if (!analytics) {
            return
        }

        const insightTexts =
            insights.map(
                insight =>
                    `${insight.title}: ${insight.description}`
            )

        exportAnalyticsPDF(
            analytics,
            selectedMonth + 1,
            selectedYear,
            insightTexts
        )
    }

    // =====================================================
    // PREVIOUS MONTH
    // =====================================================

    const previousMonth = () => {

        if (selectedMonth === 0) {

            setSelectedMonth(11)

            setSelectedYear(
                year => year - 1
            )

        } else {

            setSelectedMonth(
                month => month - 1
            )
        }
    }

    // =====================================================
    // NEXT MONTH
    // =====================================================

    const nextMonth = () => {

        if (selectedMonth === 11) {

            setSelectedMonth(0)

            setSelectedYear(
                year => year + 1
            )

        } else {

            setSelectedMonth(
                month => month + 1
            )
        }
    }

    // =====================================================
    // LOADING
    // =====================================================

    if (
        analyticsLoading ||
        budgetsLoading
    ) {

        return (
            <div className="min-h-screen bg-[#08090d] p-6 text-white lg:p-10">

                <div className="mx-auto max-w-7xl animate-pulse space-y-6">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <div className="space-y-3">
                            <div className="h-3 w-36 rounded bg-white/10" />
                            <div className="h-9 w-48 rounded bg-white/10" />
                            <div className="h-4 w-80 rounded bg-white/5" />
                        </div>

                        <div className="h-10 w-40 rounded-xl bg-white/5" />

                    </div>

                    <div className="grid gap-4 md:grid-cols-3">

                        {Array.from({
                            length: 3,
                        }).map(
                            (_, index) => (
                                <Card
                                    key={index}
                                    className="h-36 rounded-3xl border-white/10 bg-white/[0.025]"
                                />
                            )
                        )}

                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">

                        <Card className="h-[400px] rounded-3xl border-white/10 bg-white/[0.025]" />

                        <Card className="h-[400px] rounded-3xl border-white/10 bg-white/[0.025]" />

                    </div>

                    <Card className="h-48 rounded-3xl border-white/10 bg-white/[0.025]" />

                </div>

            </div>
        )
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (
        analyticsError ||
        budgetsError ||
        !analytics
    ) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-[#08090d] p-6 text-white">

                <Card className="w-full max-w-md rounded-3xl border-white/10 bg-white/[0.025] p-8 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-400/10 text-rose-400">

                        <BarChart3 size={24} />

                    </div>

                    <h2 className="mt-5 text-lg font-semibold">
                        Unable to load analytics
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-white/30">
                        We couldn't retrieve your analytics data.
                        Please try again.
                    </p>

                    <button
                        onClick={() => {
                            refetchAnalytics()
                            refetchBudgets()
                        }}
                        className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                        Try again
                    </button>

                </Card>

            </div>
        )
    }

    // =====================================================
    // SAFE DATA
    // =====================================================

    const monthlyTrend =
        (
            analytics.monthlyTrend ?? []
        ) as MonthlyAnalytics[]

    const categoryBreakdown =
        (
            analytics.categoryBreakdown ?? []
        ) as CategoryAnalytics[]

    // =====================================================
    // NUMERIC VALUES
    // =====================================================

    const income =
        Number(
            analytics.income
        ) || 0

    const expense =
        Number(
            analytics.expense
        ) || 0

    const savings =
        Number(
            analytics.savings
        ) || 0

    const savingsRate =
        Number(
            analytics.savingsRate
        ) || 0

    const incomeChange =
        Number(
            analytics.incomeChange
        ) || 0

    const expenseChange =
        Number(
            analytics.expenseChange
        ) || 0

    // =====================================================
    // TOP CATEGORY
    // =====================================================

    const topCategory =
        categoryBreakdown.length > 0
            ? categoryBreakdown[0]
            : null

    // =====================================================
    // BUDGET CALCULATION
    // =====================================================

    const totalBudget =
        budgets.reduce(
            (
                total,
                budget
            ) =>
                total +
                (
                    Number(
                        budget.budget
                    ) || 0
                ),
            0
        )

    const totalBudgetSpent =
        budgets.reduce(
            (
                total,
                budget
            ) =>
                total +
                (
                    Number(
                        budget.spent
                    ) || 0
                ),
            0
        )

    const overallBudgetPercentage =
        totalBudget > 0
            ? (
            totalBudgetSpent /
            totalBudget
        ) * 100
            : 0

    // =====================================================
    // FINANCIAL HEALTH
    // =====================================================

    const health =
        calculateFinancialHealth(
            savingsRate,
            expenseChange,
            overallBudgetPercentage
        )

    const insights =
        generateFinancialInsights(
            analytics
        )

    // =====================================================
    // MAIN
    // =====================================================

    return (
        <div className="min-h-screen bg-[#08090d] text-white">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <header className="border-b border-white/[0.07] px-6 py-7 lg:px-10">

                <div className="mx-auto max-w-7xl">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        {/* TITLE */}

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                                Financial intelligence
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight">
                                Analytics
                            </h1>

                            <p className="mt-1 text-sm text-white/35">
                                Understand your spending, savings and cash flow.
                            </p>

                        </div>

                        {/* ACTIONS */}

                        <div className="flex flex-wrap items-center gap-2">

                            <button
                                onClick={handleExportCSV}
                                disabled={!analytics}
                                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Download size={16}/>

                                Export CSV
                            </button>

                            <button
                                onClick={handleExportPDF}
                                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                            >
                                <Download size={16}/>

                                PDF
                            </button>

                            {/* MONTH SELECTOR */}

                            <div
                                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] p-1">

                                <button
                                    onClick={
                                        previousMonth
                                    }
                                    className="rounded-lg p-2 text-white/30 transition hover:bg-white/5 hover:text-white"
                                    aria-label="Previous month"
                                >
                                    <ChevronLeft
                                        size={16}
                                    />
                                </button>

                                <span className="min-w-32 px-2 text-center text-xs font-medium text-white/60">
                                    {monthLabel}
                                </span>

                                <button
                                    onClick={
                                        nextMonth
                                    }
                                    className="rounded-lg p-2 text-white/30 transition hover:bg-white/5 hover:text-white"
                                    aria-label="Next month"
                                >
                                    <ChevronRight
                                        size={16}
                                    />
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </header>

            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            <main className="mx-auto max-w-7xl space-y-6 p-6 lg:p-10">

                {/* ================================================= */}
                {/* SUMMARY */}
                {/* ================================================= */}

                <div className="grid gap-4 md:grid-cols-3">

                    {/* INCOME */}

                    <Card className="relative overflow-hidden rounded-3xl border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/30">
                                    Income
                                </p>

                                <p className="mt-3 text-2xl font-bold">
                                    {formatCurrency(
                                        income
                                    )}
                                </p>

                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">

                                <TrendingUp
                                    size={19}
                                />

                            </div>

                        </div>

                        <div className="mt-5 flex items-center justify-between">

                            <span className="text-xs text-white/25">
                                vs previous month
                            </span>

                            <ChangeBadge
                                value={
                                    incomeChange
                                }
                            />

                        </div>

                    </Card>

                    {/* EXPENSE */}

                    <Card className="relative overflow-hidden rounded-3xl border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/30">
                                    Expenses
                                </p>

                                <p className="mt-3 text-2xl font-bold">
                                    {formatCurrency(
                                        expense
                                    )}
                                </p>

                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-400/10 text-rose-400">

                                <TrendingDown
                                    size={19}
                                />

                            </div>

                        </div>

                        <div className="mt-5 flex items-center justify-between">

                            <span className="text-xs text-white/25">
                                vs previous month
                            </span>

                            <ChangeBadge
                                value={
                                    expenseChange
                                }
                                inverse
                            />

                        </div>

                    </Card>

                    {/* SAVINGS */}

                    <Card className="relative overflow-hidden rounded-3xl border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/30">
                                    Savings
                                </p>

                                <p
                                    className={`mt-3 text-2xl font-bold ${
                                        savings >= 0
                                            ? "text-emerald-400"
                                            : "text-rose-400"
                                    }`}
                                >
                                    {savings < 0 ? "-" : ""}
                                    {formatCurrency(
                                        Math.abs(
                                            savings
                                        )
                                    )}
                                </p>

                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">

                                <PiggyBank
                                    size={19}
                                />

                            </div>

                        </div>

                        <div className="mt-5 flex items-center justify-between">

                            <span className="text-xs text-white/25">
                                Savings rate
                            </span>

                            <span className="text-xs font-semibold text-violet-300">
                                {savingsRate.toFixed(
                                    1
                                )}
                                %
                            </span>

                        </div>

                    </Card>

                </div>

                {/* ================================================= */}
                {/* CASH FLOW + CATEGORY */}
                {/* ================================================= */}

                <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">

                    {/* CASH FLOW */}

                    <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl lg:p-7">

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                            <div>

                                <div className="flex items-center gap-2">

                                    <TrendingUp
                                        size={17}
                                        className="text-violet-400"
                                    />

                                    <h2 className="font-semibold">
                                        Cash flow
                                    </h2>

                                </div>

                                <p className="mt-1 text-xs text-white/30">
                                    Income and expenses over the recent months
                                </p>

                            </div>

                            <div className="flex items-center gap-4 text-xs">

                                <div className="flex items-center gap-2">

                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                                    <span className="text-white/35">
                                        Income
                                    </span>

                                </div>

                                <div className="flex items-center gap-2">

                                    <span className="h-2 w-2 rounded-full bg-rose-400" />

                                    <span className="text-white/35">
                                        Expenses
                                    </span>

                                </div>

                            </div>

                        </div>

                        <div className="mt-8 h-[320px] w-full min-w-0">

                            {monthlyTrend.length === 0 ? (

                                <div className="flex h-full items-center justify-center text-sm text-white/25">
                                    No monthly trend data available.
                                </div>

                            ) : (

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <AreaChart
                                        data={
                                            monthlyTrend
                                        }
                                        margin={{
                                            top: 10,
                                            right: 10,
                                            left: -15,
                                            bottom: 0,
                                        }}
                                    >

                                        <defs>

                                            <linearGradient
                                                id="analyticsIncomeGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >

                                                <stop
                                                    offset="0%"
                                                    stopColor="#34d399"
                                                    stopOpacity={
                                                        0.25
                                                    }
                                                />

                                                <stop
                                                    offset="100%"
                                                    stopColor="#34d399"
                                                    stopOpacity={
                                                        0
                                                    }
                                                />

                                            </linearGradient>

                                            <linearGradient
                                                id="analyticsExpenseGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >

                                                <stop
                                                    offset="0%"
                                                    stopColor="#fb7185"
                                                    stopOpacity={
                                                        0.2
                                                    }
                                                />

                                                <stop
                                                    offset="100%"
                                                    stopColor="#fb7185"
                                                    stopOpacity={
                                                        0
                                                    }
                                                />

                                            </linearGradient>

                                        </defs>

                                        <CartesianGrid
                                            stroke="rgba(255,255,255,0.05)"
                                            vertical={false}
                                        />

                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: "rgba(255,255,255,0.3)",
                                                fontSize: 11,
                                            }}
                                        />

                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: "rgba(255,255,255,0.3)",
                                                fontSize: 11,
                                            }}
                                            tickFormatter={(
                                                value
                                            ) => {

                                                const numericValue =
                                                    Number(
                                                        value
                                                    )

                                                if (
                                                    numericValue >=
                                                    1000
                                                ) {
                                                    return `₹${(
                                                        numericValue /
                                                        1000
                                                    ).toFixed(0)}k`
                                                }

                                                return `₹${numericValue}`
                                            }}
                                        />

                                        <Tooltip
                                            content={
                                                <CustomTooltip />
                                            }
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="income"
                                            name="Income"
                                            stroke="#34d399"
                                            strokeWidth={2}
                                            fill="url(#analyticsIncomeGradient)"
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="expense"
                                            name="Expenses"
                                            stroke="#fb7185"
                                            strokeWidth={2}
                                            fill="url(#analyticsExpenseGradient)"
                                        />

                                    </AreaChart>

                                </ResponsiveContainer>

                            )}

                        </div>

                    </Card>

                    {/* CATEGORY */}

                    <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl lg:p-7">

                        <div>

                            <div className="flex items-center gap-2">

                                <PieChartIcon
                                    size={17}
                                    className="text-violet-400"
                                />

                                <h2 className="font-semibold">
                                    Category breakdown
                                </h2>

                            </div>

                            <p className="mt-1 text-xs text-white/30">
                                Where your expenses are going
                            </p>

                        </div>

                        <div className="mt-6 space-y-5">

                            {categoryBreakdown.length === 0 ? (

                                <div className="flex h-[300px] items-center justify-center text-center">

                                    <div>

                                        <PieChartIcon
                                            size={30}
                                            className="mx-auto text-white/15"
                                        />

                                        <p className="mt-3 text-sm text-white/30">
                                            No expenses recorded.
                                        </p>

                                    </div>

                                </div>

                            ) : (

                                categoryBreakdown
                                    .slice(0, 6)
                                    .map(
                                        (
                                            category
                                        ) => {

                                            const percentage =
                                                Number(
                                                    category.percentage
                                                ) || 0

                                            return (

                                                <div
                                                    key={
                                                        category.category
                                                    }
                                                >

                                                    <div className="flex items-center justify-between">

                                                        <span className="text-sm font-medium text-white/70">
                                                            {
                                                                category.category
                                                            }
                                                        </span>

                                                        <span className="text-xs font-medium text-white/40">
                                                            {formatCurrency(
                                                                Number(
                                                                    category.amount
                                                                ) || 0
                                                            )}
                                                        </span>

                                                    </div>

                                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">

                                                        <div
                                                            className="h-full rounded-full bg-violet-400 transition-all duration-700"
                                                            style={{
                                                                width: `${Math.min(
                                                                    100,
                                                                    Math.max(
                                                                        0,
                                                                        percentage
                                                                    )
                                                                )}%`,
                                                            }}
                                                        />

                                                    </div>

                                                    <div className="mt-1 flex justify-end">

                                                        <span className="text-[10px] text-white/20">
                                                            {percentage.toFixed(
                                                                1
                                                            )}
                                                            %
                                                        </span>

                                                    </div>

                                                </div>

                                            )
                                        }
                                    )

                            )}

                        </div>

                    </Card>

                </div>

                {/* ================================================= */}
                {/* FINANCIAL HEALTH */}
                {/* ================================================= */}

                <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl lg:p-7">

                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                        <div>

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10">

                                    <Sparkles
                                        size={18}
                                        className="text-violet-300"
                                    />

                                </div>

                                <div>

                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-400">
                                        Financial health
                                    </p>

                                    <h2 className="mt-1 text-lg font-bold">
                                        {health.label}
                                    </h2>

                                </div>

                            </div>

                            <p className="mt-4 max-w-xl text-sm leading-6 text-white/35">
                                Your score combines savings rate,
                                spending trends and budget usage
                                to provide a simple snapshot of
                                your current financial position.
                            </p>

                            <div className="mt-5 flex flex-wrap gap-2">

                                <span className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/30">
                                    Savings{" "}
                                    <span className="text-white/60">
                                        {savingsRate.toFixed(1)}%
                                    </span>
                                </span>

                                <span className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/30">
                                    Expense trend{" "}
                                    <span className="text-white/60">
                                        {expenseChange >= 0
                                            ? "+"
                                            : ""}
                                        {expenseChange.toFixed(1)}%
                                    </span>
                                </span>

                                <span className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/30">
                                    Budget{" "}
                                    <span className="text-white/60">
                                        {overallBudgetPercentage.toFixed(1)}%
                                    </span>
                                </span>

                            </div>

                        </div>

                        <div className="shrink-0 text-left md:text-right">

                            <p className="text-5xl font-bold tracking-tight">

                                {health.score}

                                <span className="text-xl text-white/20">
                                    /100
                                </span>

                            </p>

                            <p className="mt-1 text-xs text-white/25">
                                financial health score
                            </p>

                            <div className="mt-4 h-2 w-48 overflow-hidden rounded-full bg-white/5 md:ml-auto">

                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        health.score >= 85
                                            ? "bg-emerald-400"
                                            : health.score >= 70
                                                ? "bg-violet-400"
                                                : health.score >= 50
                                                    ? "bg-amber-400"
                                                    : "bg-rose-400"
                                    }`}
                                    style={{
                                        width: `${Math.min(
                                            100,
                                            Math.max(
                                                0,
                                                health.score
                                            )
                                        )}%`,
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                </Card>

                {/* ================================================= */}
                {/* SMART INSIGHTS */}
                {/* ================================================= */}

                <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl lg:p-7">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10">

                            <Sparkles
                                size={18}
                                className="text-violet-300"
                            />

                        </div>

                        <div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-400">
                                Smart insights
                            </p>

                            <h2 className="mt-1 text-lg font-bold">
                                What your money is telling you
                            </h2>

                        </div>

                    </div>

                    <div className="mt-6 grid gap-3 md:grid-cols-2">

                        {insights.map(
                            (
                                insight,
                                index
                            ) => (

                                <div
                                    key={index}
                                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                                >

                                    <div className="flex items-start gap-3">

                                        <div
                                            className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                                                insight.type ===
                                                "positive"
                                                    ? "bg-emerald-400"
                                                    : insight.type ===
                                                    "warning"
                                                        ? "bg-amber-400"
                                                        : "bg-violet-400"
                                            }`}
                                        />

                                        <div>

                                            <p className="text-sm font-semibold">
                                                {insight.title}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-white/35">
                                                {insight.description}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </Card>

                {/* ================================================= */}
                {/* INSIGHT */}
                {/* ================================================= */}

                <Card className="relative overflow-hidden rounded-3xl border-violet-400/10 bg-violet-400/[0.035] p-6 backdrop-blur-xl lg:p-7">

                    <div className="flex gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/10 text-violet-400">

                            <Sparkles size={19} />

                        </div>

                        <div className="min-w-0">

                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-400">
                                Financial insight
                            </p>

                            <p className="mt-2 text-sm leading-6 text-white/55">

                                {savings < 0
                                    ? "Your expenses are currently higher than your income. Consider reviewing your largest spending categories and reducing non-essential expenses."
                                    : savingsRate >= 30
                                        ? "Excellent work. You're currently saving more than 30% of your income. Keep maintaining this healthy cash-flow pattern."
                                        : savingsRate >= 15
                                            ? "Your cash flow is positive. Look for opportunities to gradually increase your savings rate."
                                            : "Your cash flow is positive, but your savings rate is relatively low. Review your largest expense categories to identify opportunities to save more."
                                }

                            </p>

                        </div>

                    </div>

                </Card>

                {/* ================================================= */}
                {/* QUICK METRICS */}
                {/* ================================================= */}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {/* MONTHLY INCOME */}

                    <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] p-5">

                        <div className="flex items-center gap-3">

                            <Receipt
                                size={17}
                                className="text-white/30"
                            />

                            <span className="text-xs text-white/30">
                                Monthly income
                            </span>

                        </div>

                        <p className="mt-3 text-xl font-bold">
                            {formatCurrency(
                                income
                            )}
                        </p>

                    </Card>

                    {/* MONTHLY EXPENSE */}

                    <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] p-5">

                        <div className="flex items-center gap-3">

                            <TrendingDown
                                size={17}
                                className="text-white/30"
                            />

                            <span className="text-xs text-white/30">
                                Monthly expenses
                            </span>

                        </div>

                        <p className="mt-3 text-xl font-bold">
                            {formatCurrency(
                                expense
                            )}
                        </p>

                    </Card>

                    {/* SAVINGS RATE */}

                    <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] p-5">

                        <div className="flex items-center gap-3">

                            <PiggyBank
                                size={17}
                                className="text-white/30"
                            />

                            <span className="text-xs text-white/30">
                                Savings rate
                            </span>

                        </div>

                        <p className="mt-3 text-xl font-bold">
                            {savingsRate.toFixed(1)}%
                        </p>

                    </Card>

                    {/* TOP CATEGORY */}

                    <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] p-5">

                        <div className="flex items-center gap-3">

                            <Wallet
                                size={17}
                                className="text-white/30"
                            />

                            <span className="text-xs text-white/30">
                                Top category
                            </span>

                        </div>

                        <p className="mt-3 truncate text-xl font-bold">
                            {
                                topCategory?.category ??
                                "—"
                            }
                        </p>

                    </Card>

                </div>

            </main>

        </div>
    )
}

export default Analytics