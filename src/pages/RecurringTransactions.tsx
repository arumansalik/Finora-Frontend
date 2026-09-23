import {
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
    Plus,
    Repeat2,
    Trash2,
    TrendingDown,
    TrendingUp,
    Wallet,
} from "lucide-react"

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
    getRecurringTransactions,
    deleteRecurringTransaction,
    type RecurringTransaction,
} from "@/services/recurringTransactionApi"

import {
    Card,
} from "@/components/ui/card"

import {
    Button,
} from "@/components/ui/button"

import RecurringTransactionDialog from "@/component/recurring/RecurringTransactionDialog"


const formatCurrency = (
    amount: number
) => {

    return `₹${amount.toLocaleString(
        "en-IN"
    )}`
}


const formatDate = (
    date: string
) => {

    return new Date(
        `${date}T00:00:00`
    ).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    )
}


const recurrenceLabel = (
    value: string
) => {

    return (
        value.charAt(0) +
        value
            .slice(1)
            .toLowerCase()
    )
}


export default function RecurringTransactions() {

    const queryClient =
        useQueryClient()


    const [dialogOpen, setDialogOpen] =
        useState(false)


    const {
        data: recurring = [],
        isLoading,
        isError,
    } = useQuery({

        queryKey: [
            "recurring-transactions",
        ],

        queryFn:
        getRecurringTransactions,

        staleTime:
            30 * 1000,

        refetchOnWindowFocus:
            false,

    })


    // =====================================================
    // DELETE
    // =====================================================

    const deleteMutation =
        useMutation({

            mutationFn:
            deleteRecurringTransaction,

            onSuccess: () => {

                queryClient.invalidateQueries({
                    queryKey: [
                        "recurring-transactions",
                    ],
                })

            },

        })


    // =====================================================
    // SUMMARY
    // =====================================================

    const summary =
        useMemo(() => {

            const income =
                recurring
                    .filter(
                        (
                            item
                        ) =>
                            item.type ===
                            "INCOME" &&
                            item.active
                    )
                    .reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            item.amount,
                        0
                    )


            const expense =
                recurring
                    .filter(
                        (
                            item
                        ) =>
                            item.type ===
                            "EXPENSE" &&
                            item.active
                    )
                    .reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            item.amount,
                        0
                    )


            return {
                income,
                expense,
                net:
                    income -
                    expense,
            }

        }, [
            recurring,
        ])


    // =====================================================
    // DELETE HANDLER
    // =====================================================

    const handleDelete =
        (
            item:
                RecurringTransaction
        ) => {

            const confirmed =
                window.confirm(
                    `Delete "${item.title}"?`
                )


            if (!confirmed) {
                return
            }


            deleteMutation.mutate(
                item.id
            )
        }


    return (

        <div className="min-h-screen bg-[#08090d] text-white">

            <main className="mx-auto max-w-[1500px] space-y-6 p-6 lg:p-10">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                    <div>

                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                            Automation
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight">
                            Recurring transactions
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm text-white/35">
                            Keep track of income and expenses that happen on a regular schedule.
                        </p>

                    </div>


                    <Button
                        onClick={() =>
                            setDialogOpen(
                                true
                            )
                        }
                        className="w-fit rounded-xl bg-white text-black hover:bg-white/90"
                    >

                        <Plus
                            size={17}
                        />

                        Add recurring

                    </Button>

                </header>


                {/* ================================================= */}
                {/* SUMMARY */}
                {/* ================================================= */}

                <div className="grid gap-4 md:grid-cols-3">

                    {/* INCOME */}

                    <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] p-5">

                        <div className="flex items-center justify-between">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">

                                <ArrowUpRight
                                    size={18}
                                />

                            </div>

                            <span className="text-[10px] uppercase tracking-wider text-white/25">
                                Recurring income
                            </span>

                        </div>

                        <p className="mt-5 text-2xl font-bold">
                            {formatCurrency(
                                summary.income
                            )}
                        </p>

                        <p className="mt-1 text-xs text-white/25">
                            Active recurring income
                        </p>

                    </Card>


                    {/* EXPENSE */}

                    <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] p-5">

                        <div className="flex items-center justify-between">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-400/10 text-rose-400">

                                <ArrowDownRight
                                    size={18}
                                />

                            </div>

                            <span className="text-[10px] uppercase tracking-wider text-white/25">
                                Recurring expenses
                            </span>

                        </div>

                        <p className="mt-5 text-2xl font-bold">
                            {formatCurrency(
                                summary.expense
                            )}
                        </p>

                        <p className="mt-1 text-xs text-white/25">
                            Active recurring expenses
                        </p>

                    </Card>


                    {/* NET */}

                    <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] p-5">

                        <div className="flex items-center justify-between">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-400">

                                {summary.net >=
                                0 ? (

                                    <TrendingUp
                                        size={18}
                                    />

                                ) : (

                                    <TrendingDown
                                        size={18}
                                    />

                                )}

                            </div>

                            <span className="text-[10px] uppercase tracking-wider text-white/25">
                                Net recurring
                            </span>

                        </div>

                        <p
                            className={`mt-5 text-2xl font-bold ${
                                summary.net >= 0
                                    ? "text-white"
                                    : "text-rose-400"
                            }`}
                        >
                            {formatCurrency(
                                summary.net
                            )}
                        </p>

                        <p className="mt-1 text-xs text-white/25">
                            Income minus recurring expenses
                        </p>

                    </Card>

                </div>


                {/* ================================================= */}
                {/* LIST */}
                {/* ================================================= */}

                <Card className="overflow-hidden rounded-3xl border-white/[0.08] bg-white/[0.025]">

                    <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">

                        <div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-400">
                                Scheduled
                            </p>

                            <h2 className="mt-1 text-lg font-bold">
                                Your recurring payments
                            </h2>

                        </div>


                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/25">

                            <Repeat2
                                size={17}
                            />

                        </div>

                    </div>


                    {/* LOADING */}

                    {isLoading && (

                        <div className="divide-y divide-white/[0.05]">

                            {Array.from({
                                length: 4,
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

                                        <div className="h-11 w-11 rounded-xl bg-white/5" />

                                        <div className="flex-1 space-y-2">

                                            <div className="h-3 w-40 rounded bg-white/5" />

                                            <div className="h-2 w-28 rounded bg-white/5" />

                                        </div>

                                    </div>

                                )
                            )}

                        </div>
                    )}


                    {/* ERROR */}

                    {isError && (

                        <div className="px-6 py-20 text-center">

                            <p className="text-sm text-rose-300">
                                Unable to load recurring transactions.
                            </p>

                        </div>
                    )}


                    {/* EMPTY */}

                    {!isLoading &&
                        !isError &&
                        recurring.length ===
                        0 && (

                            <div className="px-6 py-20 text-center">

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/20">

                                    <Repeat2
                                        size={25}
                                    />

                                </div>

                                <h3 className="mt-5 font-semibold">
                                    No recurring transactions
                                </h3>

                                <p className="mx-auto mt-2 max-w-sm text-sm text-white/30">
                                    Add recurring income or expenses to keep your future cash flow organized.
                                </p>

                                <Button
                                    onClick={() =>
                                        setDialogOpen(
                                            true
                                        )
                                    }
                                    className="mt-6 rounded-xl bg-white text-black hover:bg-white/90"
                                >

                                    <Plus
                                        size={16}
                                    />

                                    Add recurring

                                </Button>

                            </div>
                        )}


                    {/* ITEMS */}

                    {!isLoading &&
                        !isError &&
                        recurring.length >
                        0 && (

                            <div className="divide-y divide-white/[0.05]">

                                {recurring.map(
                                    (
                                        item
                                    ) => (

                                        <div
                                            key={
                                                item.id
                                            }
                                            className="group flex flex-col gap-4 px-6 py-5 transition hover:bg-white/[0.02] sm:flex-row sm:items-center"
                                        >

                                            {/* ICON */}

                                            <div
                                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
                                                    item.type ===
                                                    "INCOME"
                                                        ? "border-emerald-400/10 bg-emerald-400/[0.05] text-emerald-400"
                                                        : "border-violet-400/10 bg-violet-400/[0.05] text-violet-400"
                                                }`}
                                            >

                                                {item.type ===
                                                "INCOME" ? (

                                                    <ArrowUpRight
                                                        size={20}
                                                    />

                                                ) : (

                                                    <Wallet
                                                        size={20}
                                                    />

                                                )}

                                            </div>


                                            {/* INFO */}

                                            <div className="min-w-0 flex-1">

                                                <div className="flex flex-wrap items-center gap-2">

                                                    <p className="truncate text-sm font-semibold">
                                                        {
                                                            item.title
                                                        }
                                                    </p>

                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                                                            item.active
                                                                ? "bg-emerald-400/10 text-emerald-400"
                                                                : "bg-white/5 text-white/25"
                                                        }`}
                                                    >
                                                        {item.active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>

                                                </div>


                                                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/25">

                                                    <span>
                                                        {
                                                            item.category.name
                                                        }
                                                    </span>

                                                    <span>
                                                        •
                                                    </span>

                                                    <span className="flex items-center gap-1">

                                                        <Repeat2
                                                            size={12}
                                                        />

                                                        {
                                                            recurrenceLabel(
                                                                item.recurrence
                                                            )
                                                        }

                                                    </span>

                                                    <span>
                                                        •
                                                    </span>

                                                    <span className="flex items-center gap-1">

                                                        <CalendarDays
                                                            size={12}
                                                        />

                                                        Next{" "}
                                                        {
                                                            formatDate(
                                                                item.nextDate
                                                            )
                                                        }

                                                    </span>

                                                </div>

                                            </div>


                                            {/* AMOUNT */}

                                            <div className="text-left sm:text-right">

                                                <p
                                                    className={`text-base font-bold ${
                                                        item.type ===
                                                        "INCOME"
                                                            ? "text-emerald-400"
                                                            : "text-white"
                                                    }`}
                                                >

                                                    {item.type ===
                                                    "INCOME"
                                                        ? "+"
                                                        : "-"}

                                                    {formatCurrency(
                                                        item.amount
                                                    )}

                                                </p>

                                                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/20">
                                                    {
                                                        recurrenceLabel(
                                                            item.recurrence
                                                        )
                                                    }
                                                </p>

                                            </div>


                                            {/* ACTION */}

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        item
                                                    )
                                                }
                                                disabled={
                                                    deleteMutation.isPending
                                                }
                                                className="rounded-xl p-2 text-white/20 opacity-100 transition hover:bg-rose-400/10 hover:text-rose-400 sm:opacity-0 sm:group-hover:opacity-100"
                                                aria-label="Delete recurring transaction"
                                            >

                                                <Trash2
                                                    size={16}
                                                />

                                            </button>

                                        </div>

                                    )
                                )}

                            </div>
                        )}

                </Card>

            </main>


            {/* ================================================= */}
            {/* DIALOG */}
            {/* ================================================= */}

            <RecurringTransactionDialog
                open={
                    dialogOpen
                }
                onClose={() =>
                    setDialogOpen(
                        false
                    )
                }
            />

        </div>
    )
}