import {
    useMemo,
} from "react"

import {
    useQuery,
} from "@tanstack/react-query"

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    CalendarDays,
    CircleDollarSign,
    Lightbulb,
    PieChart as PieChartIcon,
    TrendingUp,
    Wallet,
} from "lucide-react"

import {
    getTransactions,
    type Transaction,
} from "@/services/transactionApi"

import {
    Card,
} from "@/components/ui/card"


// =====================================================
// TYPES
// =====================================================

interface MonthlyData {
    month: string
    income: number
    expense: number
    balance: number
}


interface CategoryData {
    name: string
    value: number
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


const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
]


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
                        key={
                            item.dataKey
                        }
                        className="flex items-center justify-between gap-8 py-0.5"
                    >

                        <span className="text-xs text-white/50">

                            {item.name}

                        </span>


                        <span className="text-xs font-semibold text-white">

                            {formatCurrency(
                                item.value
                            )}

                        </span>

                    </div>

                )
            )}

        </div>
    )
}


// =====================================================
// ANALYTICS
// =====================================================

function Analytics() {


    // =====================================================
    // FETCH
    // =====================================================

    const {
        data: transactions = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: [
            "transactions",
        ],
        queryFn:
        getTransactions,
    })


    // =====================================================
    // MONTHLY DATA
    // =====================================================

    const monthlyData =
        useMemo<MonthlyData[]>(
            () => {

                const currentYear =
                    new Date().getFullYear()


                const months =
                    monthNames.map(
                        (
                            month,
                            index
                        ) => ({

                            month,

                            income: 0,

                            expense: 0,

                            balance: 0,

                            monthIndex:
                            index,

                        })
                    )


                transactions.forEach(
                    (
                        transaction
                    ) => {

                        const date =
                            new Date(
                                transaction.date
                            )


                        if (
                            date.getFullYear() !==
                            currentYear
                        ) {
                            return
                        }


                        const monthIndex =
                            date.getMonth()


                        if (
                            transaction.type ===
                            "INCOME"
                        ) {

                            months[
                                monthIndex
                                ].income +=
                                transaction.amount

                        } else {

                            months[
                                monthIndex
                                ].expense +=
                                transaction.amount
                        }

                    }
                )


                months.forEach(
                    (
                        month
                    ) => {

                        month.balance =
                            month.income -
                            month.expense

                    }
                )


                return months.map(
                    ({
                         month,
                         income,
                         expense,
                         balance,
                     }) => ({

                        month,

                        income,

                        expense,

                        balance,

                    })
                )

            },
            [
                transactions,
            ]
        )


    // =====================================================
    // TOTALS
    // =====================================================

    const totals =
        useMemo(() => {

            let income = 0

            let expense = 0


            transactions.forEach(
                (
                    transaction
                ) => {

                    if (
                        transaction.type ===
                        "INCOME"
                    ) {

                        income +=
                            transaction.amount

                    } else {

                        expense +=
                            transaction.amount

                    }

                }
            )


            return {

                income,

                expense,

                balance:
                    income -
                    expense,

            }

        }, [
            transactions,
        ])


    // =====================================================
    // CATEGORY DATA
    // =====================================================

    const categoryData =
        useMemo<CategoryData[]>(
            () => {

                const map =
                    new Map<
                        string,
                        number
                    >()


                transactions.forEach(
                    (
                        transaction
                    ) => {

                        if (
                            transaction.type !==
                            "EXPENSE"
                        ) {
                            return
                        }


                        const category =
                            transaction
                                .category
                                 ??
                            "Other"


                        map.set(
                            category,

                            (
                                map.get(
                                    category
                                ) ??
                                0
                            ) +
                            transaction.amount
                        )

                    }
                )


                const total =
                    Array.from(
                        map.values()
                    ).reduce(
                        (
                            sum,
                            value
                        ) =>
                            sum +
                            value,
                        0
                    )


                return Array.from(
                    map.entries()
                )
                    .map(
                        ([
                             name,
                             value,
                         ]) => ({

                            name,

                            value,

                            percentage:
                                total >
                                0
                                    ? (
                                        value /
                                        total
                                    ) *
                                    100
                                    : 0,

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

            },
            [
                transactions,
            ]
        )


    // =====================================================
    // TOP CATEGORY
    // =====================================================

    const topCategory =
        categoryData[0]


    // =====================================================
    // SAVING RATE
    // =====================================================

    const savingRate =
        totals.income > 0
            ? (
                totals.balance /
                totals.income
            ) *
            100
            : 0


    // =====================================================
    // INSIGHT
    // =====================================================

    const insight =
        useMemo(() => {

            if (
                transactions.length ===
                0
            ) {

                return "Add a few transactions to start receiving personalized financial insights."

            }


            if (
                totals.income ===
                0
            ) {

                return "Add your income records to calculate your savings rate and cash-flow health."

            }


            if (
                totals.expense >
                totals.income
            ) {

                return "Your expenses are currently higher than your income. Consider reviewing your largest spending categories."

            }


            if (
                savingRate >=
                30
            ) {

                return "Excellent work. You're currently keeping more than 30% of your income after expenses."

            }


            if (
                savingRate >=
                15
            ) {

                return "Your cash flow is positive. Look for opportunities to gradually increase your savings rate."

            }


            return "Your cash flow is positive, but your savings rate is relatively low. Review your largest expense categories."

        }, [
            transactions,
            totals,
            savingRate,
        ])


    // =====================================================
    // LOADING
    // =====================================================

    if (isLoading) {

        return (

            <div className="min-h-screen bg-[#07080c] p-6 text-white lg:p-10">

                <div className="mx-auto max-w-7xl space-y-6">

                    <div className="h-10 w-64 animate-pulse rounded-lg bg-white/5" />

                    <div className="grid gap-4 md:grid-cols-3">

                        {Array.from({
                            length: 3,
                        }).map(
                            (
                                _,
                                index
                            ) => (

                                <Card
                                    key={
                                        index
                                    }
                                    className="h-32 animate-pulse border-white/10 bg-white/[0.025]"
                                />

                            )
                        )}

                    </div>


                    <Card className="h-96 animate-pulse border-white/10 bg-white/[0.025]" />

                </div>

            </div>
        )
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (isError) {

        return (

            <div className="min-h-screen bg-[#07080c] p-6 text-white lg:p-10">

                <Card className="mx-auto max-w-xl border-white/10 bg-white/[0.025] p-10 text-center">

                    <BarChart3
                        className="mx-auto text-rose-400"
                        size={35}
                    />

                    <h2 className="mt-5 text-xl font-semibold">

                        Analytics unavailable

                    </h2>

                    <p className="mt-2 text-sm text-white/35">

                        We couldn't load your transaction data.

                    </p>

                </Card>

            </div>
        )
    }


    // =====================================================
    // MAIN
    // =====================================================

    return (

        <div className="min-h-screen bg-[#07080c] text-white">


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <header className="border-b border-white/[0.07] px-6 py-7 lg:px-10">

                <div className="mx-auto max-w-7xl">

                    <div className="flex items-center gap-2">

                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">

                            Financial intelligence

                        </p>

                    </div>


                    <h1 className="mt-2 text-3xl font-bold tracking-tight">

                        Analytics

                    </h1>


                    <p className="mt-1 text-sm text-white/35">

                        Understand where your money goes and how your finances are evolving.

                    </p>

                </div>

            </header>


            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            <main className="mx-auto max-w-7xl space-y-6 p-6 lg:p-10">


                {/* ================================================= */}
                {/* SUMMARY CARDS */}
                {/* ================================================= */}

                <div className="grid gap-4 md:grid-cols-3">


                    {/* INCOME */}

                    <Card className="relative overflow-hidden rounded-2xl border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/30">

                                    Total income

                                </p>


                                <p className="mt-3 text-2xl font-bold text-white">

                                    {formatCurrency(
                                        totals.income
                                    )}

                                </p>

                            </div>


                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">

                                <ArrowUpRight
                                    size={20}
                                />

                            </div>

                        </div>


                        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">

                            <TrendingUp
                                size={13}
                            />

                            Money received

                        </div>

                    </Card>


                    {/* EXPENSE */}

                    <Card className="relative overflow-hidden rounded-2xl border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/30">

                                    Total expenses

                                </p>


                                <p className="mt-3 text-2xl font-bold text-white">

                                    {formatCurrency(
                                        totals.expense
                                    )}

                                </p>

                            </div>


                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-400/10 text-rose-400">

                                <ArrowDownRight
                                    size={20}
                                />

                            </div>

                        </div>


                        <div className="mt-4 flex items-center gap-2 text-xs text-rose-400">

                            <TrendingUp
                                size={13}
                            />

                            Money spent

                        </div>

                    </Card>


                    {/* BALANCE */}

                    <Card className="relative overflow-hidden rounded-2xl border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/30">

                                    Net balance

                                </p>


                                <p
                                    className={`mt-3 text-2xl font-bold ${
                                        totals.balance >=
                                        0
                                            ? "text-white"
                                            : "text-rose-400"
                                    }`}
                                >

                                    {formatCurrency(
                                        totals.balance
                                    )}

                                </p>

                            </div>


                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-400">

                                <Wallet
                                    size={20}
                                />

                            </div>

                        </div>


                        <div className="mt-4 flex items-center gap-2 text-xs text-white/30">

                            <CircleDollarSign
                                size={13}
                            />

                            Savings rate{" "}

                            <span className="text-white/60">

                                {savingRate.toFixed(
                                    1
                                )}
                                %

                            </span>

                        </div>

                    </Card>

                </div>


                {/* ================================================= */}
                {/* CASH FLOW CHART */}
                {/* ================================================= */}

                <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl lg:p-7">

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                        <div>

                            <div className="flex items-center gap-2">

                                <TrendingUp
                                    size={17}
                                    className="text-violet-400"
                                />

                                <h2 className="font-semibold text-white">

                                    Cash flow

                                </h2>

                            </div>


                            <p className="mt-1 text-xs text-white/30">

                                Income and expenses across {new Date().getFullYear()}

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


                    <div className="mt-8 h-[330px] w-full">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <AreaChart
                                data={
                                    monthlyData
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
                                        id="incomeGradient"
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
                                        id="expenseGradient"
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
                                    vertical={
                                        false
                                    }
                                />


                                <XAxis
                                    dataKey="month"
                                    axisLine={
                                        false
                                    }
                                    tickLine={
                                        false
                                    }
                                    tick={{
                                        fill: "rgba(255,255,255,0.3)",
                                        fontSize: 11,
                                    }}
                                />


                                <YAxis
                                    axisLine={
                                        false
                                    }
                                    tickLine={
                                        false
                                    }
                                    tick={{
                                        fill: "rgba(255,255,255,0.3)",
                                        fontSize: 11,
                                    }}
                                    tickFormatter={(
                                        value
                                    ) =>
                                        `₹${value / 1000}k`
                                    }
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
                                    strokeWidth={
                                        2
                                    }
                                    fill="url(#incomeGradient)"
                                />


                                <Area
                                    type="monotone"
                                    dataKey="expense"
                                    name="Expenses"
                                    stroke="#fb7185"
                                    strokeWidth={
                                        2
                                    }
                                    fill="url(#expenseGradient)"
                                />

                            </AreaChart>

                        </ResponsiveContainer>

                    </div>

                </Card>


                {/* ================================================= */}
                {/* LOWER CHARTS */}
                {/* ================================================= */}

                <div className="grid gap-6 lg:grid-cols-2">


                    {/* ================================================= */}
                    {/* CATEGORY PIE */}
                    {/* ================================================= */}

                    <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl lg:p-7">

                        <div className="flex items-center gap-2">

                            <PieChartIcon
                                size={17}
                                className="text-violet-400"
                            />

                            <h2 className="font-semibold">

                                Spending by category

                            </h2>

                        </div>


                        <p className="mt-1 text-xs text-white/30">

                            Where your expenses are going

                        </p>


                        {categoryData.length ===
                        0 ? (

                            <div className="flex h-[300px] items-center justify-center text-center">

                                <div>

                                    <PieChartIcon
                                        size={30}
                                        className="mx-auto text-white/15"
                                    />

                                    <p className="mt-3 text-sm text-white/30">

                                        No expense data yet

                                    </p>

                                </div>

                            </div>

                        ) : (

                            <div className="mt-5 h-[300px]">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <PieChart>

                                        <Pie
                                            data={
                                                categoryData
                                            }
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={
                                                72
                                            }
                                            outerRadius={
                                                105
                                            }
                                            paddingAngle={
                                                3
                                            }
                                        >

                                            {categoryData.map(
                                                (
                                                    _,
                                                    index
                                                ) => (

                                                    <Cell
                                                        key={
                                                            index
                                                        }
                                                        fill={[
                                                            "#8b5cf6",
                                                            "#34d399",
                                                            "#60a5fa",
                                                            "#fb7185",
                                                            "#fbbf24",
                                                            "#22d3ee",
                                                            "#f472b6",
                                                        ][
                                                        index %
                                                        7
                                                            ]}
                                                    />

                                                )
                                            )}

                                        </Pie>


                                        <Tooltip
                                            content={
                                                <CustomTooltip />
                                            }
                                        />


                                        <Legend
                                            verticalAlign="bottom"
                                            iconType="circle"
                                            wrapperStyle={{
                                                fontSize: "11px",
                                                color: "rgba(255,255,255,0.4)",
                                            }}
                                        />

                                    </PieChart>

                                </ResponsiveContainer>

                            </div>

                        )}

                    </Card>


                    {/* ================================================= */}
                    {/* CATEGORY RANKING */}
                    {/* ================================================= */}

                    <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl lg:p-7">

                        <div className="flex items-center gap-2">

                            <BarChart3
                                size={17}
                                className="text-violet-400"
                            />

                            <h2 className="font-semibold">

                                Spending breakdown

                            </h2>

                        </div>


                        <p className="mt-1 text-xs text-white/30">

                            Your largest expense categories

                        </p>


                        <div className="mt-6 space-y-5">

                            {categoryData.length ===
                            0 ? (

                                <div className="py-16 text-center text-sm text-white/30">

                                    No expense data yet.

                                </div>

                            ) : (

                                categoryData
                                    .slice(
                                        0,
                                        6
                                    )
                                    .map(
                                        (
                                            category
                                        ) => (

                                            <div
                                                key={
                                                    category.name
                                                }
                                            >

                                                <div className="mb-2 flex items-center justify-between">

                                                    <span className="text-sm text-white/60">

                                                        {
                                                            category.name
                                                        }

                                                    </span>


                                                    <span className="text-sm font-semibold text-white">

                                                        {formatCurrency(
                                                            category.value
                                                        )}

                                                    </span>

                                                </div>


                                                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">

                                                    <div
                                                        className="h-full rounded-full bg-violet-400 transition-all duration-700"
                                                        style={{
                                                            width: `${category.percentage}%`,
                                                        }}
                                                    />

                                                </div>


                                                <p className="mt-1 text-[10px] text-white/20">

                                                    {category.percentage.toFixed(
                                                        1
                                                    )}
                                                    % of expenses

                                                </p>

                                            </div>

                                        )
                                    )

                            )}

                        </div>

                    </Card>

                </div>


                {/* ================================================= */}
                {/* INSIGHT */}
                {/* ================================================= */}

                <Card className="relative overflow-hidden rounded-3xl border-violet-400/10 bg-violet-400/[0.035] p-6 backdrop-blur-xl lg:p-7">

                    <div className="flex gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/10 text-violet-400">

                            <Lightbulb
                                size={20}
                            />

                        </div>


                        <div>

                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-400">

                                Financial insight

                            </p>


                            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">

                                {insight}

                            </p>

                        </div>

                    </div>

                </Card>


                {/* ================================================= */}
                {/* QUICK METRICS */}
                {/* ================================================= */}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


                    <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] p-5">

                        <div className="flex items-center gap-3">

                            <CalendarDays
                                size={17}
                                className="text-white/30"
                            />

                            <span className="text-xs text-white/30">

                                Transactions

                            </span>

                        </div>


                        <p className="mt-3 text-xl font-bold">

                            {
                                transactions.length
                            }

                        </p>

                    </Card>


                    <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] p-5">

                        <div className="flex items-center gap-3">

                            <PieChartIcon
                                size={17}
                                className="text-white/30"
                            />

                            <span className="text-xs text-white/30">

                                Categories

                            </span>

                        </div>


                        <p className="mt-3 text-xl font-bold">

                            {
                                categoryData.length
                            }

                        </p>

                    </Card>


                    <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] p-5">

                        <div className="flex items-center gap-3">

                            <CircleDollarSign
                                size={17}
                                className="text-white/30"
                            />

                            <span className="text-xs text-white/30">

                                Savings rate

                            </span>

                        </div>


                        <p className="mt-3 text-xl font-bold">

                            {savingRate.toFixed(
                                1
                            )}
                            %

                        </p>

                    </Card>


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

                            {topCategory?.name ??
                                "—"}

                        </p>

                    </Card>

                </div>

            </main>

        </div>
    )
}


export default Analytics