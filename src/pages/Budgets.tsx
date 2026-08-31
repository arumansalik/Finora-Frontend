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
        error,
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
    // BUDGET HEALTH
    // =====================================================

    const budgetHealth =
        useMemo(() => {

            let healthy = 0
            let warning = 0
            let danger = 0


            budgets.forEach(
                (budget) => {

                    if (
                        budget.percentage < 70
                    ) {

                        healthy++

                    } else if (
                        budget.percentage < 90
                    ) {

                        warning++

                    } else {

                        danger++

                    }

                }
            )


            let status =
                "Healthy"

            let description =
                "Your spending is comfortably within your budgets."


            if (
                totals.percentage >= 100
            ) {

                status =
                    "Over budget"

                description =
                    "Your spending has exceeded your total budget."

            } else if (
                totals.percentage >= 90
            ) {

                status =
                    "Needs attention"

                description =
                    "You're getting very close to your overall budget limit."

            } else if (
                totals.percentage >= 70
            ) {

                status =
                    "Watch spending"

                description =
                    "You're using a significant portion of your budget."

            }


            return {
                healthy,
                warning,
                danger,
                status,
                description,
            }

        }, [
            budgets,
            totals.percentage,
        ])


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
    // DELETE HANDLER
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
    // PREVIOUS MONTH
    // =====================================================

    const goToPreviousMonth =
        () => {

            if (month === 1) {

                setMonth(12)

                setYear(
                    (current) =>
                        current - 1
                )

            } else {

                setMonth(
                    (current) =>
                        current - 1
                )

            }

        }


    // =====================================================
    // NEXT MONTH
    // =====================================================

    const goToNextMonth =
        () => {

            if (month === 12) {

                setMonth(1)

                setYear(
                    (current) =>
                        current + 1
                )

            } else {

                setMonth(
                    (current) =>
                        current + 1
                )

            }

        }


    // =====================================================
    // CURRENT MONTH
    // =====================================================

    const goToCurrentMonth =
        () => {

            const currentDate =
                new Date()

            setMonth(
                currentDate.getMonth() + 1
            )

            setYear(
                currentDate.getFullYear()
            )

        }


    // =====================================================
    // ERROR
    // =====================================================

    if (
        isError ||
        categoriesError
    ) {

        console.error(
            "Budget error:",
            error
        )

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
                        onClick={openCreate}
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

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
                                Budget period
                            </p>

                            <div className="mt-1 flex items-center gap-2">

                                <button
                                    onClick={goToPreviousMonth}
                                    className="rounded-lg p-2 text-white/30 transition hover:bg-white/5 hover:text-white"
                                    aria-label="Previous month"
                                >
                                    ←
                                </button>


                                <button
                                    onClick={goToCurrentMonth}
                                    className="min-w-36 rounded-lg px-3 py-2 text-left text-sm font-semibold text-white transition hover:bg-white/5"
                                >
                                    {monthName} {year}
                                </button>


                                <button
                                    onClick={goToNextMonth}
                                    className="rounded-lg p-2 text-white/30 transition hover:bg-white/5 hover:text-white"
                                    aria-label="Next month"
                                >
                                    →
                                </button>

                            </div>

                        </div>


                        <div className="flex items-center gap-2">

                            <button
                                onClick={goToCurrentMonth}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/50 transition hover:bg-white/10 hover:text-white"
                            >
                                Today
                            </button>

                        </div>

                    </div>

                </Card>


                {/* ================================================= */}
                {/* BUDGET HEALTH */}
                {/* ================================================= */}

                <Card className="overflow-hidden rounded-3xl border-white/[0.08] bg-white/[0.025]">

                    <div className="p-6">

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">


                            {/* LEFT */}

                            <div>

                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-400">
                                    Budget health
                                </p>

                                <h2 className="mt-2 text-2xl font-bold">
                                    {budgetHealth.status}
                                </h2>

                                <p className="mt-2 max-w-lg text-sm text-white/35">
                                    {budgetHealth.description}
                                </p>

                            </div>


                            {/* CENTER */}

                            <div className="min-w-44">

                                <div className="flex items-end justify-between">

                                    <span className="text-xs text-white/30">
                                        Overall usage
                                    </span>

                                    <span className="text-lg font-bold">
                                        {Math.min(
                                            totals.percentage,
                                            999
                                        ).toFixed(1)}
                                        %
                                    </span>

                                </div>


                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">

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
                                                `${Math.min(
    totals.percentage,
    100
)}%`,
                                        }}
                                    />

                                </div>


                                <p className="mt-2 text-xs text-white/25">

                                    ₹
                                    {totals.spent.toLocaleString(
                                        "en-IN"
                                    )}

                                    {" of "}

                                    ₹
                                    {totals.budget.toLocaleString(
                                        "en-IN"
                                    )}

                                </p>

                            </div>


                            {/* STATUS COUNTS */}

                            <div className="grid grid-cols-3 gap-3">

                                <div className="rounded-2xl border border-white/5 bg-white/[0.025] px-4 py-3">

                                    <p className="text-lg font-bold text-emerald-400">
                                        {budgetHealth.healthy}
                                    </p>

                                    <p className="mt-1 text-[10px] uppercase tracking-wider text-white/25">
                                        Healthy
                                    </p>

                                </div>


                                <div className="rounded-2xl border border-white/5 bg-white/[0.025] px-4 py-3">

                                    <p className="text-lg font-bold text-amber-400">
                                        {budgetHealth.warning}
                                    </p>

                                    <p className="mt-1 text-[10px] uppercase tracking-wider text-white/25">
                                        Watch
                                    </p>

                                </div>


                                <div className="rounded-2xl border border-white/5 bg-white/[0.025] px-4 py-3">

                                    <p className="text-lg font-bold text-rose-400">
                                        {budgetHealth.danger}
                                    </p>

                                    <p className="mt-1 text-[10px] uppercase tracking-wider text-white/25">
                                        Risk
                                    </p>

                                </div>

                            </div>

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
    totals.remaining >= 0
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


                    {/* SECTION HEADER */}

                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


                        {/* LEFT */}

                        <div>

                            <h2 className="text-lg font-bold">
                                Category budgets
                            </h2>

                            <p className="mt-1 text-xs text-white/30">
                                Monitor your spending limits.
                            </p>

                        </div>


                        {/* RIGHT */}

                        <Button
                            onClick={openCreate}
                            className="w-fit rounded-xl bg-white text-black hover:bg-white/90"
                        >

                            <Plus
                                size={17}
                            />

                            Add budget

                        </Button>

                    </div>


                    {/* LOADING */}

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
                                        key={index}
                                        className="h-48 animate-pulse rounded-3xl border-white/10 bg-white/[0.025]"
                                    />

                                )
                            )}

                        </div>


                    ) : budgets.length === 0 ? (


                        /* EMPTY STATE */

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
                                onClick={openCreate}
                                className="mt-6 rounded-xl bg-white text-black hover:bg-white/90"
                            >

                                <Plus
                                    size={16}
                                />

                                Create budget

                            </Button>

                        </Card>


                    ) : (


                        /* BUDGET CARDS */

                        <div className="grid gap-4 lg:grid-cols-2">

                            {budgets.map(
                                (
                                    budget
                                ) => {


                                    // =================================================
                                    // CATEGORY STATUS
                                    // =================================================

                                    const exceeded =
                                        budget.percentage > 100


                                    const nearLimit =
                                        budget.percentage >= 90 &&
                                        budget.percentage <= 100


                                    const status =
                                        exceeded
                                            ? "Over budget"
                                            : nearLimit
                                                ? "Near limit"
                                                : budget.percentage >= 70
                                                    ? "Watch spending"
                                                    : "Healthy"


                                    // =================================================
                                    // PROGRESS
                                    // =================================================

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


                                            {/* TOP */}

                                            <div className="flex items-start justify-between">


                                                {/* CATEGORY */}

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


                                                {/* ACTIONS */}

                                                <div className="flex gap-1">

                                                    <button
                                                        onClick={() =>
                                                            openEdit(
                                                                budget
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-white/25 transition hover:bg-white/5 hover:text-white"
                                                        aria-label={`Edit ${budget.category.name} budget`}
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
                                                        className="rounded-lg p-2 text-white/25 transition hover:bg-rose-500/10 hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-40"
                                                        aria-label={`Delete ${budget.category.name} budget`}
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


                                                {/* STATUS */}

                                                <div className="text-right">

                                                    <div
                                                        className={`flex items-center gap-1 text-xs font-medium ${
    exceeded
        ? "text-rose-400"
        : nearLimit
            ? "text-amber-400"
            : budget.percentage >= 70
                ? "text-amber-400"
                : "text-emerald-400"
}`}
                                                    >

                                                        {exceeded ? (

                                                            <AlertTriangle
                                                                size={14}
                                                            />

                                                        ) : nearLimit ? (

                                                            <AlertTriangle
                                                                size={14}
                                                            />

                                                        ) : (

                                                            <CheckCircle2
                                                                size={14}
                                                            />

                                                        )}

                                                        {status}

                                                    </div>


                                                    <p className="mt-1 text-[11px] text-white/25">

                                                        {budget.percentage.toFixed(
                                                            0
                                                        )}
                                                        % used

                                                    </p>

                                                </div>

                                            </div>


                                            {/* PROGRESS */}

                                            <div className="mt-5">

                                                <div className="h-2 overflow-hidden rounded-full bg-white/5">

                                                    <div
                                                        className={`h-full rounded-full transition-all duration-700 ${
    exceeded
        ? "bg-rose-400"
        : nearLimit
            ? "bg-amber-400"
            : budget.percentage >= 70
                ? "bg-amber-400"
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