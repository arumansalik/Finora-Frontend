import {
    Search,
    Plus,
    SlidersHorizontal,
    ArrowUpDown,
    Pencil,
    Trash2,
    Wallet,
    Utensils,
    Bus,
    ShoppingBag,
    Receipt,
    CircleDollarSign,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react"
import { toast } from "sonner"
import {
    useMemo,
    useState,
} from "react"

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query"

import {
    deleteTransaction,
    getTransactions,
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

    const queryClient =
        useQueryClient()


    // =====================================================
    // STATE
    // =====================================================

    const [search, setSearch] =
        useState("")

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
    } = useQuery({
        queryKey: ["transactions"],
        queryFn: getTransactions,
    })


    // =====================================================
    // DELETE TRANSACTION
    // =====================================================

    const deleteMutation =
        useMutation({

            mutationFn:
            deleteTransaction,

            onSuccess: () => {

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

                toast.success(
                    "Transaction deleted",
                    {
                        description:
                            "The transaction was removed successfully.",
                    }
                )

            },

            onError: () => {

                toast.error(
                    "Delete failed",
                    {
                        description:
                            "We couldn't delete the transaction. Please try again.",
                    }
                )

            },

        })


    // =====================================================
    // CATEGORY LIST
    // =====================================================

    const categories = useMemo(() => {

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
                            transaction.title ??
                            ""

                        const categoryName =
                            transaction.category
                                 ??
                            ""


                        // -------------------------
                        // SEARCH
                        // -------------------------

                        const matchesSearch =
                            normalizedSearch ===
                            "" ||
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


                        // -------------------------
                        // TYPE
                        // -------------------------

                        const matchesType =
                            typeFilter ===
                            "ALL" ||
                            transaction.type ===
                            typeFilter


                        // -------------------------
                        // CATEGORY
                        // -------------------------

                        const matchesCategory =
                            categoryFilter ===
                            "ALL" ||
                            categoryName ===
                            categoryFilter


                        return (
                            matchesSearch &&
                            matchesType &&
                            matchesCategory
                        )
                    }
                )


            // -------------------------
            // SORT
            // -------------------------

            result.sort(
                (a, b) => {

                    let difference = 0


                    if (
                        sortBy ===
                        "date"
                    ) {

                        difference =
                            a.date.localeCompare(
                                b.date
                            )

                    } else {

                        difference =
                            a.amount -
                            b.amount
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
            (page - 1) *
            pageSize,

            page *
            pageSize
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

    const getCategoryIcon = (
        category: string
    ) => {

        const value =
            category.toLowerCase()


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
    // CATEGORY COLOR
    // =====================================================

    const getCategoryColor =
        (category: string) => {

            const value =
                category.toLowerCase()


            if (
                value.includes("food")
            ) {

                return {
                    icon: "text-orange-400",
                    background:
                        "bg-orange-400/10",
                    border:
                        "border-orange-400/10",
                }
            }


            if (
                value.includes("travel") ||
                value.includes("transport")
            ) {

                return {
                    icon: "text-blue-400",
                    background:
                        "bg-blue-400/10",
                    border:
                        "border-blue-400/10",
                }
            }


            if (
                value.includes("shopping")
            ) {

                return {
                    icon: "text-pink-400",
                    background:
                        "bg-pink-400/10",
                    border:
                        "border-pink-400/10",
                }
            }


            if (
                value.includes("salary") ||
                value.includes("income")
            ) {

                return {
                    icon: "text-emerald-400",
                    background:
                        "bg-emerald-400/10",
                    border:
                        "border-emerald-400/10",
                }
            }


            if (
                value.includes("bill")
            ) {

                return {
                    icon: "text-yellow-400",
                    background:
                        "bg-yellow-400/10",
                    border:
                        "border-yellow-400/10",
                }
            }


            return {
                icon: "text-violet-400",
                background:
                    "bg-violet-400/10",
                border:
                    "border-violet-400/10",
            }
        }


    // =====================================================
    // OPEN CREATE
    // =====================================================

    const openCreate =
        () => {

            setEditingTransaction(
                null
            )

            setDialogOpen(true)

            toast.success(
                "Ready to add a transaction"
            )
        }


    // =====================================================
    // OPEN EDIT
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

                // Error is already handled
                // by the mutation.
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
                sortBy ===
                field
            ) {

                setSortDescending(
                    (current) =>
                        !current
                )

            } else {

                setSortBy(
                    field
                )

                setSortDescending(
                    true
                )
            }

            setPage(1)
        }


    // =====================================================
    // PAGE CHANGE
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
    // ERROR STATE
    // =====================================================

    if (isError) {

        return (

            <div className="min-h-screen bg-[#07080c] p-6 text-white lg:p-10">

                <div className="mx-auto max-w-6xl">

                    <Card className="rounded-3xl border-white/10 bg-white/[0.025] p-10 text-center backdrop-blur-xl">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-400/10 bg-rose-400/10 text-rose-400">

                            <Wallet
                                size={28}
                            />

                        </div>


                        <h2 className="mt-5 text-xl font-semibold text-white">

                            Couldn't load transactions

                        </h2>


                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">

                            We couldn't retrieve your transactions.
                            Make sure the Spring Boot backend is
                            running on port 8080.

                        </p>


                        <Button
                            onClick={() =>
                                queryClient.invalidateQueries(
                                    {
                                        queryKey: [
                                            "transactions",
                                        ],
                                    }
                                )
                            }
                            className="mt-6 rounded-xl bg-white text-black hover:bg-white/90"
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

        <div className="min-h-screen bg-[#07080c] text-white">


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <header className="border-b border-white/[0.07] bg-[#07080c]/90 px-6 py-7 backdrop-blur-xl lg:px-10">

                <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <div className="flex items-center gap-2">

                            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">

                                Financial activity

                            </p>

                        </div>


                        <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-white">

                            Transactions

                        </h1>


                        <div className="mt-2 flex flex-wrap items-center gap-2">

                            <p className="text-sm text-white/35">
                                Track, organize and manage every
                                transaction in one place.
                            </p>

                            <span className="hidden text-white/15 sm:inline">
        •
    </span>

                            <span className="text-xs font-medium text-white/30">
        {transactions.length} recorded
    </span>

                        </div>

                    </div>


                    <Button
                        onClick={
                            openCreate
                        }
                        className="group w-fit rounded-xl bg-white px-5 text-black shadow-lg shadow-white/5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-xl"
                    >

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

            <main className="mx-auto max-w-7xl space-y-6 p-6 lg:p-10">


                {/* ================================================= */}
                {/* TOP STATS */}
                {/* ================================================= */}

                <div className="grid gap-4 sm:grid-cols-3">


                    <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-xl">

                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/30">

                            Total transactions

                        </p>


                        <p className="mt-3 text-2xl font-bold text-white">

                            {transactions.length}

                        </p>


                        <p className="mt-1 text-xs text-white/25">

                            All recorded activity

                        </p>

                    </Card>


                    <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-xl">

                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/30">

                            Income records

                        </p>


                        <p className="mt-3 text-2xl font-bold text-emerald-400">

                            {
                                transactions.filter(
                                    (
                                        transaction
                                    ) =>
                                        transaction.type ===
                                        "INCOME"
                                ).length
                            }

                        </p>


                        <p className="mt-1 text-xs text-white/25">

                            Money coming in

                        </p>

                    </Card>


                    <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-xl">

                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/30">

                            Expense records

                        </p>


                        <p className="mt-3 text-2xl font-bold text-rose-400">

                            {
                                transactions.filter(
                                    (
                                        transaction
                                    ) =>
                                        transaction.type ===
                                        "EXPENSE"
                                ).length
                            }

                        </p>


                        <p className="mt-1 text-xs text-white/25">

                            Money going out

                        </p>

                    </Card>

                </div>


                {/* ================================================= */}
                {/* FILTER BAR */}
                {/* ================================================= */}

                <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] p-4 backdrop-blur-xl">

                    <div className="flex flex-col gap-3">


                        <div className="flex flex-col gap-3 xl:flex-row">


                            {/* SEARCH */}

                            <div className="relative flex-1">

                                <Search
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                                />


                                <input
                                    value={
                                        search
                                    }
                                    onChange={(
                                        event
                                    ) => {

                                        setSearch(
                                            event.target.value
                                        )

                                        setPage(
                                            1
                                        )
                                    }}
                                    placeholder="Search by title or category..."
                                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/40 focus:bg-white/[0.04]"
                                />


                                {search && (

                                    <button
                                        onClick={() => {

                                            setSearch(
                                                ""
                                            )

                                            setPage(
                                                1
                                            )
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 transition hover:text-white"
                                    >

                                        <X
                                            size={15}
                                        />

                                    </button>

                                )}

                            </div>


                            {/* TYPE FILTER */}

                            <div className="flex overflow-x-auto rounded-xl border border-white/10 bg-white/[0.025] p-1">

                                {(
                                    [
                                        "ALL",
                                        "INCOME",
                                        "EXPENSE",
                                    ] as FilterType[]
                                ).map(
                                    (
                                        type
                                    ) => (

                                        <button
                                            key={
                                                type
                                            }
                                            onClick={() => {

                                                setTypeFilter(
                                                    type
                                                )

                                                setPage(
                                                    1
                                                )
                                            }}
                                            className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition ${
                                                typeFilter ===
                                                type
                                                    ? "bg-white text-black shadow-sm"
                                                    : "text-white/35 hover:text-white"
                                            }`}
                                        >

                                            {type ===
                                            "ALL"
                                                ? "All"
                                                : type ===
                                                "INCOME"
                                                    ? "Income"
                                                    : "Expenses"}

                                        </button>

                                    )
                                )}

                            </div>


                            {/* CATEGORY */}

                            <div className="flex items-center gap-2">

                                <SlidersHorizontal
                                    size={15}
                                    className="shrink-0 text-white/25"
                                />


                                <select
                                    value={
                                        categoryFilter
                                    }
                                    onChange={(
                                        event
                                    ) => {

                                        setCategoryFilter(
                                            event.target.value
                                        )

                                        setPage(
                                            1
                                        )
                                    }}
                                    className="h-11 min-w-44 rounded-xl border border-white/10 bg-[#15171d] px-3 text-sm text-white outline-none transition focus:border-violet-400/40"
                                >

                                    {categories.map(
                                        (
                                            category
                                        ) => (

                                            <option
                                                key={
                                                    category
                                                }
                                                value={
                                                    category
                                                }
                                            >

                                                {category ===
                                                "ALL"
                                                    ? "All categories"
                                                    : category}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>


                        {/* SECONDARY FILTERS */}

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.05] pt-3">


                            <div className="flex items-center gap-2">

                                <span className="text-xs text-white/25">

                                    Sort by:

                                </span>


                                <button
                                    onClick={() =>
                                        handleSort(
                                            "date"
                                        )
                                    }
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition ${
                                        sortBy ===
                                        "date"
                                            ? "bg-white/10 text-white"
                                            : "text-white/35 hover:text-white"
                                    }`}
                                >

                                    Date

                                    {sortBy ===
                                        "date" && (

                                            <ArrowUpDown
                                                size={12}
                                            />

                                        )}

                                </button>


                                <button
                                    onClick={() =>
                                        handleSort(
                                            "amount"
                                        )
                                    }
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition ${
                                        sortBy ===
                                        "amount"
                                            ? "bg-white/10 text-white"
                                            : "text-white/35 hover:text-white"
                                    }`}
                                >

                                    Amount

                                    {sortBy ===
                                        "amount" && (

                                            <ArrowUpDown
                                                size={12}
                                            />

                                        )}

                                </button>

                            </div>


                            {hasActiveFilters && (

                                <button
                                    onClick={
                                        clearFilters
                                    }
                                    className="flex items-center gap-1.5 text-xs text-white/30 transition hover:text-white"
                                >

                                    <X
                                        size={13}
                                    />

                                    Clear filters

                                </button>

                            )}

                        </div>

                    </div>

                </Card>


                {/* ================================================= */}
                {/* RESULTS INFO */}
                {/* ================================================= */}

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm font-medium text-white/65">

                            {filteredTransactions.length}

                            {" "}

                            {filteredTransactions.length ===
                            1
                                ? "transaction"
                                : "transactions"}

                        </p>


                        {hasActiveFilters && (

                            <p className="mt-0.5 text-xs text-white/25">

                                Filtered from{" "}
                                {
                                    transactions.length
                                }{" "}
                                total

                            </p>

                        )}

                    </div>


                    {isFetching &&
                        !isLoading && (

                            <span className="text-xs text-white/25">

                                Updating...

                            </span>

                        )}

                </div>


                {/* ================================================= */}
                {/* TRANSACTION TABLE */}
                {/* ================================================= */}

                <Card className="overflow-hidden rounded-3xl border-white/[0.08] bg-white/[0.025] backdrop-blur-xl">


                    {/* DESKTOP HEADER */}

                    <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-white/[0.07] bg-white/[0.015] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25 md:grid">

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


                    {/* ================================================= */}
                    {/* LOADING */}
                    {/* ================================================= */}

                    {isLoading ? (

                        <div className="divide-y divide-white/[0.05]">

                            {Array.from({
                                length: 6,
                            }).map(
                                (
                                    _,
                                    index
                                ) => (

                                    <div
                                        key={
                                            index
                                        }
                                        className="flex animate-pulse items-center gap-4 px-6 py-5"
                                    >

                                        <div className="h-11 w-11 shrink-0 rounded-xl bg-white/5" />


                                        <div className="flex-1 space-y-2">

                                            <div className="h-3 w-40 rounded bg-white/5" />

                                            <div className="h-2 w-24 rounded bg-white/5" />

                                        </div>


                                        <div className="hidden h-3 w-20 rounded bg-white/5 md:block" />

                                        <div className="hidden h-3 w-24 rounded bg-white/5 md:block" />

                                        <div className="h-3 w-20 rounded bg-white/5" />

                                    </div>

                                )
                            )}

                        </div>

                    ) : paginatedTransactions.length ===
                    0 ? (

                        /* ================================================= */
                        /* EMPTY */
                        /* ================================================= */

                        <div className="px-6 py-20 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/25">

                                <Wallet
                                    size={28}
                                />

                            </div>


                            <h3 className="mt-5 text-lg font-semibold text-white">

                                {hasActiveFilters
                                    ? "No matching transactions"
                                    : "No transactions yet"}

                            </h3>


                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/30">

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
                                        className="rounded-xl text-white/50 hover:bg-white/5 hover:text-white"
                                    >

                                        Clear filters

                                    </Button>

                                )}


                                <Button
                                    onClick={
                                        openCreate
                                    }
                                    className="rounded-xl bg-white text-black hover:bg-white/90"
                                >

                                    <Plus
                                        size={16}
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
                                (
                                    transaction
                                ) => {

                                    const categoryName =
                                        transaction.category
                                             ??
                                        "Other"

                                    const categoryStyle =
                                        getCategoryColor(
                                            categoryName
                                        )


                                    return (

                                        <div
                                            key={
                                                transaction.id
                                            }
                                            className="group relative grid gap-4 px-6 py-5 transition-colors duration-200 hover:bg-white/[0.025] md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center"
                                        >


                                            {/* TRANSACTION */}

                                            <div className="flex min-w-0 items-center gap-4">

                                                <div
                                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${categoryStyle.border} ${categoryStyle.background} ${categoryStyle.icon}`}
                                                >

                                                    {getCategoryIcon(
                                                        categoryName
                                                    )}

                                                </div>


                                                <div className="min-w-0">

                                                    <p className="truncate text-sm font-semibold text-white">

                                                        {
                                                            transaction.title ||
                                                            "Untitled transaction"
                                                        }

                                                    </p>


                                                    <div className="mt-1 flex items-center gap-2">

                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                                transaction.type ===
                                                                "INCOME"
                                                                    ? "bg-emerald-400/10 text-emerald-400"
                                                                    : "bg-rose-400/10 text-rose-400"
                                                            }`}
                                                        >

                                                            {transaction.type ===
                                                            "INCOME"
                                                                ? "Income"
                                                                : "Expense"}

                                                        </span>


                                                        <span className="text-xs text-white/25 md:hidden">

                                                            {categoryName}

                                                            {" · "}

                                                            {
                                                                transaction.date
                                                            }

                                                        </span>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* CATEGORY */}

                                            <div className="hidden md:block">

                                                <span className="text-sm text-white/45">

                                                    {categoryName}

                                                </span>

                                            </div>


                                            {/* DATE */}

                                            <div className="hidden md:block">

                                                <span className="text-sm text-white/35">

                                                    {
                                                        transaction.date
                                                    }

                                                </span>

                                            </div>


                                            {/* AMOUNT */}

                                            <div className="flex items-center justify-between md:block">

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

                                                    ₹
                                                    {transaction.amount.toLocaleString(
                                                        "en-IN",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}

                                                </p>


                                                <span className="text-[10px] uppercase tracking-wider text-white/20 md:hidden">

                                                    {
                                                        transaction.date
                                                    }

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
                                                    className="rounded-lg p-2 text-white/25 transition hover:bg-white/5 hover:text-white md:opacity-0 md:group-hover:opacity-100"
                                                    title="Edit transaction"
                                                >

                                                    <Pencil
                                                        size={16}
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
                                                    className="rounded-lg p-2 text-white/25 transition hover:bg-rose-500/10 hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-30 md:opacity-0 md:group-hover:opacity-100"
                                                    title="Delete transaction"
                                                >

                                                    <Trash2
                                                        size={16}
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

                    {filteredTransactions.length >
                        0 && (

                            <div className="flex flex-col gap-4 border-t border-white/[0.07] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                                <p className="text-xs text-white/25">

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
                                            page ===
                                            1
                                        }
                                        onClick={() =>
                                            goToPage(
                                                page -
                                                1
                                            )
                                        }
                                        className="rounded-lg border border-white/10 p-2 text-white/35 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-25"
                                        title="Previous page"
                                    >

                                        <ChevronLeft
                                            size={16}
                                        />

                                    </button>


                                    <div className="min-w-20 text-center text-xs text-white/35">

                                        Page{" "}

                                        <span className="font-medium text-white/60">

                                        {page}

                                    </span>

                                        {" "}of{" "}

                                        <span className="font-medium text-white/60">

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
                                                page +
                                                1
                                            )
                                        }
                                        className="rounded-lg border border-white/10 p-2 text-white/35 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-25"
                                        title="Next page"
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

                open={
                    dialogOpen
                }

                onClose={() =>
                    setDialogOpen(
                        false
                    )
                }

                transaction={
                    editingTransaction
                }

                onSuccess={() => {

                    queryClient.invalidateQueries(
                        {
                            queryKey: [
                                "transactions",
                            ],
                        }
                    )

                    queryClient.invalidateQueries(
                        {
                            queryKey: [
                                "summary",
                            ],
                        }
                    )

                    setEditingTransaction(
                        null
                    )

                }}

            />

        </div>
    )
}


export default Transactions