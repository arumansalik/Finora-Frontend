import {
    ArrowDownRight,
    ArrowUpDown,
    ArrowUpRight,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    CircleDollarSign,
    CreditCard,
    Filter,
    Pencil,
    Plus,
    Receipt,
    Search,
    ShoppingBag,
    SlidersHorizontal,
    Trash2,
    TrendingDown,
    TrendingUp,
    Utensils,
    Wallet,
    X,
} from "lucide-react"

import {
    useDeleteTransaction,
    useTransactions,
} from "@/hooks/useTransactions"
import { useCurrency } from "../hooks/useCurrency";
import {
    useEffect,
    useMemo,
    useState,
} from "react"

import {
    useQueryClient,
} from "@tanstack/react-query"

import {
    type Transaction,
} from "@/services/transactionApi"

import TransactionDialog from "@/component/transactions/TransactionDialog"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"


// =====================================================
// TYPES
// =====================================================

type FilterType =
    | "ALL"
    | "INCOME"
    | "EXPENSE"

type SortField =
    | "date"
    | "amount"


// =====================================================
// COMPONENT
// =====================================================

function Transactions() {

    const queryClient = useQueryClient()

    // =====================================================
    // STATE
    // =====================================================

    const [search, setSearch] =
        useState("")

    const { formatCurrency } = useCurrency();

    const [typeFilter, setTypeFilter] =
        useState<FilterType>("ALL")

    const [categoryFilter, setCategoryFilter] =
        useState("ALL")

    const [sortBy, setSortBy] =
        useState<SortField>("date")

    const [sortDescending, setSortDescending] =
        useState(true)

    const [page, setPage] =
        useState(1)

    const [dialogOpen, setDialogOpen] =
        useState(false)

    const [editingTransaction, setEditingTransaction] =
        useState<Transaction | null>(null)

    const pageSize = 8


    // =====================================================
    // GET TRANSACTIONS
    // =====================================================

    const {
        data: transactions = [],
        isLoading,
        isError,
        isFetching,
    } = useTransactions()


    // =====================================================
    // DELETE
    // =====================================================

    const deleteMutation =
        useDeleteTransaction()


    // =====================================================
    // CATEGORY LIST
    // =====================================================

    const categories =
        useMemo<string[]>(() => {

            const categoryNames =
                transactions
                    .map(
                        (transaction) =>
                            transaction.category
                    )
                    .filter(
                        (
                            category
                        ): category is string =>
                            Boolean(category)
                    )

            return [
                "ALL",
                ...Array.from(
                    new Set(categoryNames)
                ),
            ]

        }, [transactions])


    // =====================================================
    // FILTER + SORT
    // =====================================================

    const filteredTransactions =
        useMemo(() => {

            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase()

            const result =
                transactions.filter(
                    (transaction) => {

                        const title =
                            transaction.title ?? ""

                        const categoryName =
                            transaction.category ?? ""

                        const matchesSearch =
                            normalizedSearch === "" ||
                            title
                                .toLowerCase()
                                .includes(
                                    normalizedSearch
                                ) ||
                            categoryName
                                .toLowerCase()
                                .includes(
                                    normalizedSearch
                                )

                        const matchesType =
                            typeFilter === "ALL" ||
                            transaction.type ===
                                typeFilter

                        const matchesCategory =
                            categoryFilter === "ALL" ||
                            categoryName ===
                                categoryFilter

                        return (
                            matchesSearch &&
                            matchesType &&
                            matchesCategory
                        )
                    }
                )

            result.sort(
                (a, b) => {

                    let difference = 0

                    if (
                        sortBy === "date"
                    ) {

                        difference =
                            (a.date ?? "")
                                .localeCompare(
                                    b.date ?? ""
                                )

                    } else {

                        difference =
                            (a.amount ?? 0) -
                            (b.amount ?? 0)
                    }

                    return sortDescending
                        ? -difference
                        : difference
                }
            )

            return result

        }, [
            transactions,
            search,
            typeFilter,
            categoryFilter,
            sortBy,
            sortDescending,
        ])


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredTransactions.length /
                    pageSize
            )
        )

    const paginatedTransactions =
        filteredTransactions.slice(
            (page - 1) * pageSize,
            page * pageSize
        )


    // =====================================================
    // RESET FILTERS
    // =====================================================

    const clearFilters =
        () => {

            setSearch("")
            setTypeFilter("ALL")
            setCategoryFilter("ALL")
            setPage(1)
        }


    const hasActiveFilters =
        search.trim() !== "" ||
        typeFilter !== "ALL" ||
        categoryFilter !== "ALL"


    // =====================================================
    // CATEGORY ICON
    // =====================================================

    const getCategoryIcon =
        (category: string) => {

            const value =
                category.toLowerCase()

            if (
                value.includes("food") ||
                value.includes("restaurant")
            ) {
                return (
                    <Utensils size={18} />
                )
            }

            if (
                value.includes("travel") ||
                value.includes("transport") ||
                value.includes("bus")
            ) {
                return (
                    <ArrowUpRight size={18} />
                )
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

            if (
                value.includes("bill")
            ) {
                return (
                    <Receipt size={18} />
                )
            }

            return (
                <Wallet size={18} />
            )
        }


    // =====================================================
    // CATEGORY STYLE
    // =====================================================

    const getCategoryStyle =
        (category: string) => {

            const value =
                category.toLowerCase()

            if (
                value.includes("food")
            ) {
                return {
                    icon: "text-orange-400",
                    background: "bg-orange-400/10",
                    border: "border-orange-400/15",
                    glow: "shadow-orange-500/5",
                }
            }

            if (
                value.includes("travel") ||
                value.includes("transport")
            ) {
                return {
                    icon: "text-sky-400",
                    background: "bg-sky-400/10",
                    border: "border-sky-400/15",
                    glow: "shadow-sky-500/5",
                }
            }

            if (
                value.includes("shopping")
            ) {
                return {
                    icon: "text-pink-400",
                    background: "bg-pink-400/10",
                    border: "border-pink-400/15",
                    glow: "shadow-pink-500/5",
                }
            }

            if (
                value.includes("salary") ||
                value.includes("income")
            ) {
                return {
                    icon: "text-emerald-400",
                    background: "bg-emerald-400/10",
                    border: "border-emerald-400/15",
                    glow: "shadow-emerald-500/5",
                }
            }

            if (
                value.includes("bill")
            ) {
                return {
                    icon: "text-yellow-400",
                    background: "bg-yellow-400/10",
                    border: "border-yellow-400/15",
                    glow: "shadow-yellow-500/5",
                }
            }

            if (
                value.includes("health")
            ) {
                return {
                    icon: "text-rose-400",
                    background: "bg-rose-400/10",
                    border: "border-rose-400/15",
                    glow: "shadow-rose-500/5",
                }
            }

            if (
                value.includes("education")
            ) {
                return {
                    icon: "text-indigo-400",
                    background: "bg-indigo-400/10",
                    border: "border-indigo-400/15",
                    glow: "shadow-indigo-500/5",
                }
            }

            return {
                icon: "text-violet-400",
                background: "bg-violet-400/10",
                border: "border-violet-400/15",
                glow: "shadow-violet-500/5",
            }
        }


    // =====================================================
    // CREATE
    // =====================================================

    const openCreate = () => {

        setEditingTransaction(null)
        setDialogOpen(true)
    }


    // =====================================================
    // KEYBOARD SHORTCUT
    // =====================================================

    useEffect(() => {

        const handleKeyboard =
            (event: KeyboardEvent) => {

                if (
                    (event.ctrlKey ||
                        event.metaKey) &&
                    event.key.toLowerCase() ===
                        "k"
                ) {

                    event.preventDefault()

                    setEditingTransaction(null)
                    setDialogOpen(true)
                }
            }

        window.addEventListener(
            "keydown",
            handleKeyboard
        )

        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyboard
            )
        }

    }, [])


    // =====================================================
    // EDIT
    // =====================================================

    const openEdit =
        (
            transaction: Transaction
        ) => {

            setEditingTransaction(
                transaction
            )

            setDialogOpen(true)
        }


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete =
        async (
            transaction: Transaction
        ) => {

            const confirmed =
                window.confirm(
                    `Are you sure you want to delete "${transaction.title || "this transaction"}"?`
                )

            if (!confirmed) {
                return
            }

            try {

                await deleteMutation.mutateAsync(
                    transaction.id
                )

            } catch {
                // Mutation handles error
            }
        }


    // =====================================================
    // SORT
    // =====================================================

    const handleSort =
        (
            field: SortField
        ) => {

            if (
                sortBy === field
            ) {

                setSortDescending(
                    (current) =>
                        !current
                )

            } else {

                setSortBy(field)
                setSortDescending(true)
            }

            setPage(1)
        }


    // =====================================================
    // PAGE
    // =====================================================

    const goToPage =
        (
            nextPage: number
        ) => {

            setPage(
                Math.min(
                    Math.max(
                        1,
                        nextPage
                    ),
                    totalPages
                )
            )
        }


    // =====================================================
    // TOTALS
    // =====================================================

    const totalIncome =
        transactions
            .filter(
                (transaction) =>
                    transaction.type ===
                    "INCOME"
            )
            .reduce(
                (total, transaction) =>
                    total +
                    (transaction.amount ?? 0),
                0
            )

    const totalExpense =
        transactions
            .filter(
                (transaction) =>
                    transaction.type ===
                    "EXPENSE"
            )
            .reduce(
                (total, transaction) =>
                    total +
                    (transaction.amount ?? 0),
                0
            )

    const netAmount =
        totalIncome - totalExpense


    // =====================================================
    // ERROR STATE
    // =====================================================

    if (isError) {

        return (

            <div className="min-h-screen bg-[#06070a] p-6 text-white lg:p-10">

                <div className="mx-auto max-w-7xl">

                    <Card className="overflow-hidden rounded-[28px] border-white/[0.08] bg-white/[0.025] p-10 text-center backdrop-blur-2xl">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-400/15 bg-rose-400/10 text-rose-400">

                            <Wallet size={28} />

                        </div>

                        <h2 className="mt-5 text-xl font-semibold">
                            Couldn't load transactions
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
                            We couldn't retrieve your transactions.
                            Make sure the Spring Boot backend is
                            running on port 8080.
                        </p>

                        <Button
                            onClick={() =>
                                queryClient.invalidateQueries({
                                    queryKey: [
                                        "transactions",
                                    ],
                                })
                            }
                            className="mt-6 rounded-xl bg-white px-5 text-black hover:bg-white/90"
                        >
                            Try again
                        </Button>

                    </Card>

                </div>

            </div>
        )
    }


    // =====================================================
    // MAIN
    // =====================================================

    return (

        <div className="min-h-screen bg-[#06070a] text-white">

            {/* ================================================= */}
            {/* BACKGROUND */}
            {/* ================================================= */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/[0.06] blur-[120px]" />

                <div className="absolute -right-40 top-[35%] h-96 w-96 rounded-full bg-blue-600/[0.05] blur-[120px]" />

            </div>


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <header className="relative border-b border-white/[0.06] bg-[#06070a]/80 px-6 py-8 backdrop-blur-2xl lg:px-10">

                <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                    <div>

                        <div className="mb-3 flex items-center gap-2">

                            <span className="h-2 w-2 rounded-full bg-violet-400 shadow-lg shadow-violet-500/40" />

                            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-400/80">
                                Financial activity
                            </span>

                        </div>

                        <h1 className="text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
                            Transactions
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
                            Everything you spend and earn,
                            organized in one place.
                        </p>

                    </div>


                    <Button
                        onClick={openCreate}
                        className="group h-11 w-fit rounded-xl bg-white px-5 font-medium text-black shadow-xl shadow-white/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
                    >

                        <Plus
                            size={17}
                            className="mr-2 transition-transform duration-300 group-hover:rotate-90"
                        />

                        Add transaction

                        <kbd className="ml-3 hidden rounded-md border border-black/10 bg-black/[0.05] px-1.5 py-0.5 text-[9px] font-semibold text-black/40 sm:inline">
                            CTRL K
                        </kbd>

                    </Button>

                </div>

            </header>


            {/* ================================================= */}
            {/* CONTENT */}
            {/* ================================================= */}

            <main className="relative mx-auto max-w-7xl space-y-6 p-6 lg:p-10">


                {/* ================================================= */}
                {/* STAT CARDS */}
                {/* ================================================= */}

                <div className="grid gap-4 md:grid-cols-3">

                    {/* TOTAL */}

                    <Card className="group relative overflow-hidden rounded-2xl border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12]">

                        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-violet-500/[0.06] blur-2xl" />

                        <div className="relative flex items-start justify-between">

                            <div>

                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
                                    Total activity
                                </p>

                                <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                                    {transactions.length}
                                </p>

                                <p className="mt-1 text-xs text-white/25">
                                    Recorded transactions
                                </p>

                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/10 text-violet-400">
                                <Receipt size={18} />
                            </div>

                        </div>

                    </Card>


                    {/* INCOME */}

                    <Card className="group relative overflow-hidden rounded-2xl border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/20">

                        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-500/[0.06] blur-2xl" />

                        <div className="relative flex items-start justify-between">

                            <div>

                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
                                    Total income
                                </p>

                                <p className="mt-3 text-2xl font-bold tracking-tight text-emerald-400">
                                    +{formatCurrency(totalIncome)}
                                </p>

                                <p className="mt-1 text-xs text-white/25">
                                Money coming in
                                </p>

                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10 text-emerald-400">
                                <TrendingUp size={18} />
                            </div>

                        </div>

                    </Card>


                    {/* EXPENSE */}

                    <Card className="group relative overflow-hidden rounded-2xl border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-400/20">

                        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-rose-500/[0.06] blur-2xl" />

                        <div className="relative flex items-start justify-between">

                            <div>

                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
                                    Total expenses
                                </p>

                                <p className="mt-3 text-2xl font-bold tracking-tight text-rose-400">
                                    -{formatCurrency(totalExpense)}
                                </p>

                                <p className="mt-1 text-xs text-white/25">
                                Money going out
                                </p>

                            </div>

                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-400/10 bg-rose-400/10 text-rose-400">
                                <TrendingDown size={18}/>
                            </div>

                        </div>

                    </Card>

                </div>


                {/* ================================================= */}
                {/* NET SUMMARY */}
                {/* ================================================= */}

                <Card className="overflow-hidden rounded-2xl border-white/[0.07] bg-white/[0.025] backdrop-blur-xl">

                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
    netAmount >= 0
        ? "border border-emerald-400/10 bg-emerald-400/10 text-emerald-400"
        : "border border-rose-400/10 bg-rose-400/10 text-rose-400"
}`}>

                                <CreditCard size={18} />

                            </div>

                            <div>

                                <p className="text-xs font-medium text-white/35">
                                    Net transaction balance
                                </p>

                                <p
                                    className={`mt-0.5 text-sm font-semibold ${
                                        netAmount >= 0
                                            ? "text-emerald-400"
                                            : "text-rose-400"
                                    }`}
                                >
                                    {netAmount >= 0 ? "+" : "-"}
                                    {formatCurrency(Math.abs(netAmount))}
                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-2 text-xs text-white/25">

                            <CalendarDays size={14}/>

                            <span>
                                {transactions.length} transactions recorded
                            </span>

                        </div>

                    </div>

                </Card>


                {/* ================================================= */}
                {/* FILTER BAR */}
                {/* ================================================= */}

                <Card className="rounded-2xl border-white/[0.07] bg-white/[0.025] p-4 backdrop-blur-xl">

                    <div className="flex flex-col gap-3">

                        <div className="flex flex-col gap-3 xl:flex-row">


                            {/* SEARCH */}

                            <div className="relative flex-1">

                                <Search
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                                />

                                <input
                                    value={search}
                                    onChange={(event) => {

                                        setSearch(
                                            event.target.value
                                        )

                                        setPage(1)
                                    }}
                                    placeholder="Search transactions..."
                                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-black/10 pl-10 pr-10 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/30 focus:bg-white/[0.035]"
                                />

                                {search && (

                                    <button
                                        type="button"
                                        onClick={() => {

                                            setSearch("")
                                            setPage(1)
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 transition hover:text-white"
                                    >

                                        <X size={15} />

                                    </button>

                                )}

                            </div>


                            {/* TYPE */}

                            <div className="flex rounded-xl border border-white/[0.08] bg-black/10 p-1">

                                {(
                                    [
                                        "ALL",
                                        "INCOME",
                                        "EXPENSE",
                                    ] as FilterType[]
                                ).map(
                                    (type) => (

                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => {

                                                setTypeFilter(
                                                    type
                                                )

                                                setPage(1)
                                            }}
                                            className={`rounded-lg px-4 py-2 text-xs font-medium transition-all ${
    typeFilter === type
        ? "bg-white text-black shadow-lg"
        : "text-white/30 hover:text-white"
}`}
                                        >

                                            {type === "ALL"
                                                ? "All"
                                                : type === "INCOME"
                                                    ? "Income"
                                                    : "Expenses"}

                                        </button>

                                    )
                                )}

                            </div>


                            {/* CATEGORY */}

                            <div className="flex items-center gap-2">

                                <div className="hidden h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-black/10 text-white/25 sm:flex">

                                    <Filter size={15} />

                                </div>

                                <select
                                    value={categoryFilter}
                                    onChange={(event) => {

                                        setCategoryFilter(
                                            event.target.value
                                        )

                                        setPage(1)
                                    }}
                                    className="h-11 min-w-44 rounded-xl border border-white/[0.08] bg-[#111318] px-3 text-sm text-white outline-none transition focus:border-violet-400/30"
                                >

                                    {categories.map(
                                        (category) => (

                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category === "ALL"
                                                    ? "All categories"
                                                    : category}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>


                        {/* SECONDARY BAR */}

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.05] pt-3">

                            <div className="flex items-center gap-2">

                                <SlidersHorizontal
                                    size={13}
                                    className="text-white/20"
                                />

                                <span className="text-xs text-white/20">
                                    Sort
                                </span>


                                <button
                                    type="button"
                                    onClick={() =>
                                        handleSort("date")
                                    }
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition ${
    sortBy === "date"
        ? "bg-white/[0.08] text-white"
        : "text-white/30 hover:text-white"
}`}
                                >
                                    Date

                                    {sortBy === "date" && (
                                        <ArrowUpDown size={11} />
                                    )}
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        handleSort("amount")
                                    }
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition ${
    sortBy === "amount"
        ? "bg-white/[0.08] text-white"
        : "text-white/30 hover:text-white"
}`}
                                >
                                    Amount

                                    {sortBy === "amount" && (
                                        <ArrowUpDown size={11} />
                                    )}
                                </button>

                            </div>


                            {hasActiveFilters && (

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="flex items-center gap-1.5 text-xs text-white/25 transition hover:text-white"
                                >

                                    <X size={13} />

                                    Clear filters

                                </button>

                            )}

                        </div>

                    </div>

                </Card>


                {/* ================================================= */}
                {/* RESULTS HEADER */}
                {/* ================================================= */}

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm font-medium text-white/70">

                            {filteredTransactions.length}

                            {" "}

                            {filteredTransactions.length === 1
                                ? "transaction"
                                : "transactions"}

                        </p>

                        {hasActiveFilters && (

                            <p className="mt-1 text-xs text-white/20">

                                Filtered from{" "}
                                {transactions.length} total

                            </p>

                        )}

                    </div>


                    {isFetching &&
                        !isLoading && (

                            <span className="animate-pulse text-xs text-white/25">
                                Updating...
                            </span>

                        )}

                </div>


                {/* ================================================= */}
                {/* TRANSACTION LIST */}
                {/* ================================================= */}

                <Card className="overflow-hidden rounded-[24px] border-white/[0.07] bg-white/[0.025] backdrop-blur-xl">


                    {/* DESKTOP HEADER */}

                    <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-white/[0.06] bg-white/[0.015] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/20 md:grid">

                        <span>
                            Transaction
                        </span>

                        <span>
                            Category
                        </span>

                        <span>
                            Date
                        </span>

                        <span>
                            Amount
                        </span>

                        <span>
                            Actions
                        </span>

                    </div>


                    {/* LOADING */}

                    {isLoading ? (

                        <div className="divide-y divide-white/[0.05]">

                            {Array.from({
                                length: 7,
                            }).map(
                                (_, index) => (

                                    <div
                                        key={index}
                                        className="flex animate-pulse items-center gap-4 px-6 py-5"
                                    >

                                        <div className="h-11 w-11 shrink-0 rounded-xl bg-white/5" />

                                        <div className="flex-1 space-y-2">

                                            <div className="h-3 w-44 rounded bg-white/5" />

                                            <div className="h-2.5 w-24 rounded bg-white/5" />

                                        </div>

                                        <div className="hidden h-3 w-20 rounded bg-white/5 md:block" />

                                        <div className="hidden h-3 w-24 rounded bg-white/5 md:block" />

                                        <div className="h-3 w-24 rounded bg-white/5" />

                                    </div>

                                )
                            )}

                        </div>


                    ) : paginatedTransactions.length === 0 ? (

                        /* ================================================= */
                        /* EMPTY */
                        /* ================================================= */

                        <div className="px-6 py-24 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-white/20">

                                <Wallet size={27} />

                            </div>

                            <h3 className="mt-5 text-lg font-semibold text-white">

                                {hasActiveFilters
                                    ? "No matching transactions"
                                    : "No transactions yet"}

                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/25">

                                {hasActiveFilters
                                    ? "Try adjusting your search or filters to find what you're looking for."
                                    : "Start tracking your finances by adding your first transaction."}

                            </p>

                            <div className="mt-6 flex justify-center gap-3">

                                {hasActiveFilters && (

                                    <Button
                                        onClick={
                                            clearFilters
                                        }
                                        variant="ghost"
                                        className="rounded-xl text-white/40 hover:bg-white/5 hover:text-white"
                                    >
                                        Clear filters
                                    </Button>

                                )}

                                <Button
                                    onClick={
                                        openCreate
                                    }
                                    className="rounded-xl bg-white px-5 text-black hover:bg-white/90"
                                >

                                    <Plus
                                        size={16}
                                        className="mr-2"
                                    />

                                    Add transaction

                                </Button>

                            </div>

                        </div>


                    ) : (

                        /* ================================================= */
                        /* TRANSACTIONS */
                        /* ================================================= */

                        <div className="divide-y divide-white/[0.05]">

                            {paginatedTransactions.map(
                                (transaction) => {

                                    const categoryName =
                                        transaction.category ||
                                        "Other"

                                    const categoryStyle =
                                        getCategoryStyle(
                                            categoryName
                                        )

                                    const isIncome =
                                        transaction.type ===
                                        "INCOME"

                                    return (

                                        <div
                                            key={
                                                transaction.id
                                            }
                                            className="group relative grid gap-4 px-5 py-5 transition-all duration-200 hover:bg-white/[0.025] md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center md:px-6"
                                        >


                                            {/* LEFT ACCENT */}

                                            <div
                                                className={`absolute bottom-0 left-0 top-0 w-[2px] opacity-0 transition-opacity group-hover:opacity-100 ${
    isIncome
        ? "bg-emerald-400"
        : "bg-violet-400"
}`}
                                            />


                                            {/* TRANSACTION */}

                                            <div className="flex min-w-0 items-center gap-4">

                                                <div
                                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${categoryStyle.border} ${categoryStyle.background} ${categoryStyle.icon} shadow-lg ${categoryStyle.glow}`}
                                                >

                                                    {getCategoryIcon(
                                                        categoryName
                                                    )}

                                                </div>


                                                <div className="min-w-0">

                                                    <div className="flex items-center gap-2">

                                                        <p className="truncate text-sm font-semibold text-white">

                                                            {transaction.title ||
                                                                "Untitled transaction"}

                                                        </p>

                                                    </div>


                                                    <div className="mt-1.5 flex items-center gap-2">

                                                        <span
                                                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
    isIncome
        ? "bg-emerald-400/10 text-emerald-400"
        : "bg-rose-400/10 text-rose-400"
}`}
                                                        >

                                                            {isIncome
                                                                ? (
                                                                    <ArrowUpRight
                                                                        size={10}
                                                                    />
                                                                )
                                                                : (
                                                                    <ArrowDownRight
                                                                        size={10}
                                                                    />
                                                                )}

                                                            {isIncome
                                                                ? "Income"
                                                                : "Expense"}

                                                        </span>


                                                        <span className="text-[10px] text-white/20 md:hidden">
                                                            {categoryName}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* CATEGORY */}

                                            <div className="hidden md:block">

                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${categoryStyle.border} ${categoryStyle.background} ${categoryStyle.icon}`}
                                                >
                                                    {categoryName}
                                                </span>

                                            </div>


                                            {/* DATE */}

                                            <div className="hidden md:flex items-center gap-2 text-sm text-white/30">

                                                <CalendarDays
                                                    size={14}
                                                    className="text-white/15"
                                                />

                                                {transaction.date}

                                            </div>


                                            {/* AMOUNT */}

                                            <div className="flex items-center justify-between md:block">

                                                <p
                                                    className={`text-sm font-bold tracking-tight ${
    isIncome
        ? "text-emerald-400"
        : "text-white"
}`}
                                                >
                                                    {isIncome ? "+" : "-"}
                                                    {formatCurrency(transaction.amount ?? 0)}
                                                </p>


                                                <span className="mt-1 block text-[10px] text-white/15 md:hidden">

                                                    {transaction.date}

                                                </span>

                                            </div>


                                            {/* ACTIONS */}

                                            <div className="flex items-center justify-end gap-1">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEdit(
                                                            transaction
                                                        )
                                                    }
                                                    className="rounded-lg border border-transparent p-2 text-white/20 transition hover:border-white/[0.08] hover:bg-white/[0.05] hover:text-white md:opacity-0 md:group-hover:opacity-100"
                                                    title="Edit transaction"
                                                >

                                                    <Pencil
                                                        size={15}
                                                    />

                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            transaction
                                                        )
                                                    }
                                                    disabled={
                                                        deleteMutation.isPending
                                                    }
                                                    className="rounded-lg border border-transparent p-2 text-white/20 transition hover:border-rose-400/10 hover:bg-rose-400/10 hover:text-rose-400 disabled:pointer-events-none disabled:opacity-30 md:opacity-0 md:group-hover:opacity-100"
                                                    title="Delete transaction"
                                                >

                                                    <Trash2
                                                        size={15}
                                                    />

                                                </button>

                                            </div>

                                        </div>

                                    )
                                }
                            )}

                        </div>

                    )}


                    {/* ================================================= */}
                    {/* PAGINATION */}
                    {/* ================================================= */}

                    {filteredTransactions.length > 0 && (

                        <div className="flex flex-col gap-4 border-t border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">

                            <p className="text-xs text-white/20">

                                Showing{" "}

                                <span className="font-medium text-white/50">
                                    {(page - 1) *
                                        pageSize +
                                        1}
                                </span>

                                {" – "}

                                <span className="font-medium text-white/50">

                                    {Math.min(
                                        page *
                                            pageSize,
                                        filteredTransactions.length
                                    )}

                                </span>

                                {" of "}

                                <span className="font-medium text-white/50">
                                    {
                                        filteredTransactions.length
                                    }
                                </span>

                            </p>


                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    disabled={
                                        page === 1
                                    }
                                    onClick={() =>
                                        goToPage(
                                            page - 1
                                        )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-white/30 transition hover:border-white/15 hover:bg-white/[0.05] hover:text-white disabled:pointer-events-none disabled:opacity-20"
                                >

                                    <ChevronLeft
                                        size={16}
                                    />

                                </button>


                                <div className="min-w-20 text-center text-xs text-white/30">

                                    Page{" "}

                                    <span className="font-semibold text-white/60">
                                        {page}
                                    </span>

                                    {" "}of{" "}

                                    <span className="font-semibold text-white/60">
                                        {totalPages}
                                    </span>

                                </div>


                                <button
                                    type="button"
                                    disabled={
                                        page >=
                                        totalPages
                                    }
                                    onClick={() =>
                                        goToPage(
                                            page + 1
                                        )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-white/30 transition hover:border-white/15 hover:bg-white/[0.05] hover:text-white disabled:pointer-events-none disabled:opacity-20"
                                >

                                    <ChevronRight
                                        size={16}
                                    />

                                </button>

                            </div>

                        </div>

                    )}

                </Card>

            </main>


            {/* ================================================= */}
            {/* TRANSACTION DIALOG */}
            {/* ================================================= */}

            <TransactionDialog
                open={dialogOpen}
                onClose={() =>
                    setDialogOpen(false)
                }
                transaction={
                    editingTransaction
                }
                onSuccess={() => {

                    queryClient.invalidateQueries({
                        queryKey: [
                            "transactions",
                        ],
                    })

                    queryClient.invalidateQueries({
                        queryKey: [
                            "summary",
                        ],
                    })

                    queryClient.invalidateQueries({
                        queryKey: [
                            "budgets",
                        ],
                    })

                    setEditingTransaction(
                        null
                    )
                }}
            />

        </div>
    )
}


export default Transactions
