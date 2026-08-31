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
    Plus,
    Pencil,
    Trash2,
    WalletCards,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react"

import {
    getBudgets,
    deleteBudget,
    type Budget,
} from "@/services/budgetApi"

import {
    getCategories,
    type Category,
} from "@/services/categoryApi"

import BudgetDialog from "@/component/budgets/BudgetDialog"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"


export default function Budgets() {

    const queryClient =
        useQueryClient()


    // =====================================================
    // CURRENT MONTH
    // =====================================================

    const now =
        new Date()

    const [month, setMonth] =
        useState(
            now.getMonth() + 1
        )

    const [year, setYear] =
        useState(
            now.getFullYear()
        )


    // =====================================================
    // DIALOG
    // =====================================================

    const [dialogOpen, setDialogOpen] =
        useState(false)

    const [editingBudget, setEditingBudget] =
        useState<Budget | null>(
            null
        )


    // =====================================================
    // FETCH — BUDGETS
    // =====================================================

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
    // FETCH — CATEGORIES
    // =====================================================

    const {
        data: categories = [],
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = useQuery({

        queryKey: [
            "categories",
        ],

        queryFn:
            getCategories,

        staleTime:
            5 * 60 * 1000,

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
    // DELETE
    // =====================================================

    const deleteMutation =
        useMutation({

            mutationFn:
                deleteBudget,

            onSuccess: () => {

                queryClient.invalidateQueries({
                    queryKey: [
                        "budgets",
                    ],
                })

            },

        })


    // =====================================================
    // OPEN CREATE
    // =====================================================

    const openCreate =
        () => {

            setEditingBudget(
                null
            )

            setDialogOpen(
                true
            )
        }


    // =====================================================
    // OPEN EDIT
    // =====================================================

    const openEdit =
        (
            budget: Budget
        ) => {

            setEditingBudget(
                budget
            )

            setDialogOpen(
                true
            )
        }


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete =
        (
            budget: Budget
        ) => {

            const confirmed =
                window.confirm(
                    `Delete ${budget.category.name} budget?`
                )


            if (!confirmed) {
                return
            }


            deleteMutation.mutate(
                budget.id
            )
        }


    // =====================================================
    // MONTH NAME
    // =====================================================

    const monthName =
        new Date(
            year,
            month - 1,
            1
        ).toLocaleString(
            "en-IN",
            {
                month: "long",
            }
        )


    // =====================================================
    // ERROR
    // =====================================================

    if (
        isError ||
        categoriesError
    ) {

        return (

            <div className="min-h-screen bg-[#08090d] p-6 text-white lg:p-10">

                <Card className="mx-auto max-w-xl rounded-3xl border-white/10 bg-white/[0.025] p-10 text-center">

                    <AlertTriangle
                        className="mx-auto text-rose-400"
                        size={30}
                    />

                    <h2 className="mt-4 text-xl font-bold">
                        Unable to load budgets
                    </h2>

                    <p className="mt-2 text-sm text-white/30">
                        Make sure the backend is running and you are logged in.
                    </p>

                </Card>

            </div>

        )
    }


    return (

        <div className="min-h-screen bg-[#08090d] text-white">


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <header className="border-b border-white/[0.07] px-6 py-7 lg:px-10">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                            Financial planning
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight">
                            Budgets
                        </h1>

                        <p className="mt-1 text-sm text-white/35">
                            Control your spending before it controls you.
                        </p>

                    </div>


                    <Button
                        onClick={
                            openCreate
                        }
                        className="w-fit rounded-xl bg-white text-black hover:bg-white/90"
                    >

                        <Plus
                            size={17}
                        />

                        Add budget

                    </Button>

                </div>

            </header>


            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            <main className="space-y-6 p-6 lg:p-10">


                {/* ================================================= */}
                {/* MONTH SELECTOR */}
                {/* ================================================= */}

                <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] p-4">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
                                Budget period
                            </p>

                            <p className="mt-1 text-sm font-semibold text-white">
                                {monthName} {year}
                            </p>

                        </div>


                        <div className="flex gap-2">

                            <select
                                value={month}
                                onChange={(event) =>
                                    setMonth(
                                        Number(
                                            event.target.value
                                        )
                                    )
                                }
                                className="h-10 rounded-xl border border-white/10 bg-[#15171d] px-3 text-sm text-white outline-none"
                            >

                                {Array.from(
                                    {
                                        length: 12,
                                    },
                                    (
                                        _,
                                        index
                                    ) => (

                                        <option
                                            key={
                                                index + 1
                                            }
                                            value={
                                                index + 1
                                            }
                                        >

                                            {new Date(
                                                2026,
                                                index,
                                                1
                                            ).toLocaleString(
                                                "en-IN",
                                                {
                                                    month: "long",
                                                }
                                            )}

                                        </option>

                                    )
                                )}

                            </select>


                            <select
                                value={year}
                                onChange={(event) =>
                                    setYear(
                                        Number(
                                            event.target.value
                                        )
                                    )
                                }
                                className="h-10 rounded-xl border border-white/10 bg-[#15171d] px-3 text-sm text-white outline-none"
                            >

                                {[
                                    year - 1,
                                    year,
                                    year + 1,
                                ].map(
                                    (
                                        value
                                    ) => (

                                        <option
                                            key={
                                                value
                                            }
                                            value={
                                                value
                                            }
                                        >
                                            {value}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>

                </Card>


                {/* ================================================= */}
                {/* SUMMARY */}
                {/* ================================================= */}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">


                    {/* BUDGET */}

                    <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] p-5">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">

                                <WalletCards
                                    size={18}
                                />

                            </div>

                            <p className="text-xs text-white/30">
                                Total budget
                            </p>

                        </div>


                        <p className="mt-5 text-2xl font-bold">
                            ₹
                            {totals.budget.toLocaleString(
                                "en-IN"
                            )}
                        </p>

                    </Card>


                    {/* SPENT */}

                    <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] p-5">

                        <p className="text-xs text-white/30">
                            Total spent
                        </p>

                        <p className="mt-5 text-2xl font-bold text-rose-400">
                            ₹
                            {totals.spent.toLocaleString(
                                "en-IN"
                            )}
                        </p>

                    </Card>


                    {/* REMAINING */}

                    <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] p-5">

                        <p className="text-xs text-white/30">
                            Remaining
                        </p>

                        <p
                            className={`mt-5 text-2xl font-bold ${
    totals.remaining >=
    0
        ? "text-emerald-400"
        : "text-rose-400"
}`}
                        >

                            ₹
                            {Math.abs(
                                totals.remaining
                            ).toLocaleString(
                                "en-IN"
                            )}

                        </p>

                    </Card>


                    {/* UTILIZATION */}

                    <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] p-5">

                        <p className="text-xs text-white/30">
                            Utilization
                        </p>

                        <p className="mt-5 text-2xl font-bold text-white">

                            {totals.percentage.toFixed(
                                1
                            )}
                            %

                        </p>

                    </Card>

                </div>


                {/* ================================================= */}
                {/* BUDGET LIST */}
                {/* ================================================= */}

                <section>

                    <div className="mb-4 flex items-center justify-between">

                        <div>

                            <h2 className="text-lg font-bold">
                                Category budgets
                            </h2>

                            <p className="mt-1 text-xs text-white/30">
                                Monitor your spending limits.
                            </p>

                        </div>

                    </div>


                    {isLoading ? (

                        <div className="grid gap-4 lg:grid-cols-2">

                            {Array.from(
                                {
                                    length: 4,
                                }
                            ).map(
                                (
                                    _,
                                    index
                                ) => (

                                    <Card
                                        key={
                                            index
                                        }
                                        className="h-48 animate-pulse rounded-3xl border-white/10 bg-white/[0.025]"
                                    />

                                )
                            )}

                        </div>

                    ) : budgets.length === 0 ? (

                        <Card className="rounded-3xl border-white/[0.08] bg-white/[0.025] px-6 py-20 text-center">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/30">

                                <WalletCards
                                    size={25}
                                />

                            </div>


                            <h3 className="mt-5 font-semibold">
                                No budgets yet
                            </h3>


                            <p className="mx-auto mt-2 max-w-sm text-sm text-white/30">
                                Create a budget for {monthName} to start tracking your spending.
                            </p>


                            <Button
                                onClick={
                                    openCreate
                                }
                                className="mt-6 rounded-xl bg-white text-black hover:bg-white/90"
                            >

                                <Plus
                                    size={16}
                                />

                                Create budget

                            </Button>

                        </Card>

                    ) : (

                        <div className="grid gap-4 lg:grid-cols-2">

                            {budgets.map(
                                (
                                    budget
                                ) => {

                                    const exceeded =
                                        budget.spent >
                                        budget.budget


                                    const displayPercentage =
                                        Math.min(
                                            budget.percentage,
                                            100
                                        )


                                    return (

                                        <Card
                                            key={
                                                budget.id
                                            }
                                            className="group rounded-3xl border-white/[0.08] bg-white/[0.025] p-6 transition hover:border-white/[0.14]"
                                        >

                                            <div className="flex items-start justify-between">


                                                <div>

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">

                                                            <WalletCards
                                                                size={17}
                                                                className="text-white/50"
                                                            />

                                                        </div>


                                                        <div>

                                                            <h3 className="font-semibold">

                                                                {
                                                                    budget.category.name
                                                                }

                                                            </h3>

                                                            <p className="mt-0.5 text-xs text-white/25">
                                                                Monthly limit
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>


                                                <div className="flex gap-1">

                                                    <button
                                                        onClick={() =>
                                                            openEdit(
                                                                budget
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-white/25 transition hover:bg-white/5 hover:text-white"
                                                    >

                                                        <Pencil
                                                            size={15}
                                                        />

                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                budget
                                                            )
                                                        }
                                                        disabled={
                                                            deleteMutation.isPending
                                                        }
                                                        className="rounded-lg p-2 text-white/25 transition hover:bg-rose-500/10 hover:text-rose-400"
                                                    >

                                                        <Trash2
                                                            size={15}
                                                        />

                                                    </button>

                                                </div>

                                            </div>


                                            {/* AMOUNTS */}

                                            <div className="mt-7 flex items-end justify-between">

                                                <div>

                                                    <p className="text-2xl font-bold">

                                                        ₹
                                                        {budget.spent.toLocaleString(
                                                            "en-IN"
                                                        )}

                                                    </p>

                                                    <p className="mt-1 text-xs text-white/30">

                                                        of ₹
                                                        {budget.budget.toLocaleString(
                                                            "en-IN"
                                                        )}

                                                    </p>

                                                </div>


                                                <div className="text-right">

                                                    {exceeded ? (

                                                        <div className="flex items-center gap-1 text-xs font-medium text-rose-400">

                                                            <AlertTriangle
                                                                size={14}
                                                            />

                                                            Over budget

                                                        </div>

                                                    ) : (

                                                        <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">

                                                            <CheckCircle2
                                                                size={14}
                                                            />

                                                            {budget.percentage.toFixed(
                                                                0
                                                            )}
                                                            % used

                                                        </div>

                                                    )}

                                                </div>

                                            </div>


                                            {/* PROGRESS */}

                                            <div className="mt-5">

                                                <div className="h-2 overflow-hidden rounded-full bg-white/5">

                                                    <div
                                                        className={`h-full rounded-full transition-all duration-700 ${
    exceeded
        ? "bg-rose-400"
        : "bg-violet-400"
}`}
                                                        style={{
                                                            width:
                                                                `${displayPercentage}%`,
                                                        }}
                                                    />

                                                </div>

                                            </div>


                                            {/* FOOTER */}

                                            <div className="mt-4 flex justify-between text-xs">

                                                <span className="text-white/25">

                                                    {exceeded
                                                        ? "Exceeded by"
                                                        : "Remaining"}

                                                </span>


                                                <span
                                                    className={
                                                        exceeded
                                                            ? "font-semibold text-rose-400"
                                                            : "font-semibold text-white/50"
                                                    }
                                                >

                                                    ₹
                                                    {Math.abs(
                                                        budget.remaining
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}

                                                </span>

                                            </div>

                                        </Card>

                                    )

                                }
                            )}

                        </div>

                    )}

                </section>

            </main>


            {/* ================================================= */}
            {/* DIALOG */}
            {/* ================================================= */}

            <BudgetDialog

                open={
                    dialogOpen
                }

                onClose={() =>
                    setDialogOpen(
                        false
                    )
                }

                budget={
                    editingBudget
                }

                categories={
                    categories
                }

                month={
                    month
                }

                year={
                    year
                }

            />

        </div>

    )
}