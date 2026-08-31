import {
    CalendarDays,
    Loader2,
    Repeat2,
    X,
} from "lucide-react"

import {
    useEffect,
    useState,
} from "react"

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query"

import {
    getCategories,
    type Category,
} from "@/services/categoryApi"

import {
    createRecurringTransaction,
    type RecurrenceType,
    type TransactionType,
} from "@/services/recurringTransactionApi"

import { Button } from "@/components/ui/button"


interface Props {
    open: boolean
    onClose: () => void
}


export default function RecurringTransactionDialog({
                                                       open,
                                                       onClose,
                                                   }: Props) {

    const queryClient =
        useQueryClient()


    const [title, setTitle] =
        useState("")

    const [amount, setAmount] =
        useState("")

    const [type, setType] =
        useState<TransactionType>(
            "EXPENSE"
        )

    const [category, setCategory] =
        useState("")

    const [recurrence, setRecurrence] =
        useState<RecurrenceType>(
            "MONTHLY"
        )

    const [nextDate, setNextDate] =
        useState(
            new Date()
                .toISOString()
                .split("T")[0]
        )


    // =====================================================
    // CATEGORIES
    // =====================================================

    const {
        data: categories = [],
        isLoading: categoriesLoading,
    } = useQuery<Category[]>({

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
    // RESET
    // =====================================================

    useEffect(() => {

        if (!open) {
            return
        }

        setTitle("")
        setAmount("")
        setType("EXPENSE")
        setCategory("")
        setRecurrence("MONTHLY")

        setNextDate(
            new Date()
                .toISOString()
                .split("T")[0]
        )

    }, [open])


    // =====================================================
    // CREATE
    // =====================================================

    const mutation =
        useMutation({

            mutationFn:
            createRecurringTransaction,

            onSuccess: () => {

                queryClient.invalidateQueries({
                    queryKey: [
                        "recurring-transactions",
                    ],
                })

                onClose()
            },

        })


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit =
        (
            event:
                React.FormEvent
        ) => {

            event.preventDefault()


            if (
                !title.trim() ||
                !amount ||
                Number(amount) <= 0 ||
                !category ||
                !nextDate
            ) {
                return
            }


            mutation.mutate({

                title:
                    title.trim(),

                amount:
                    Number(amount),

                type,

                category,

                recurrence,

                nextDate,

            })
        }


    if (!open) {
        return null
    }


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

            <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#101116] shadow-2xl">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-400">

                            <Repeat2
                                size={19}
                            />

                        </div>

                        <div>

                            <h2 className="text-lg font-semibold">
                                Add recurring transaction
                            </h2>

                            <p className="mt-0.5 text-xs text-white/30">
                                Automate regular income and expenses.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-2 text-white/30 transition hover:bg-white/5 hover:text-white"
                    >

                        <X
                            size={18}
                        />

                    </button>

                </div>


                {/* ================================================= */}
                {/* FORM */}
                {/* ================================================= */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="space-y-5 p-6"
                >

                    {/* TITLE */}

                    <div>

                        <label className="mb-2 block text-xs font-medium text-white/50">
                            Title
                        </label>

                        <input
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. Monthly Rent"
                            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-violet-400/40"
                        />

                    </div>


                    {/* AMOUNT */}

                    <div>

                        <label className="mb-2 block text-xs font-medium text-white/50">
                            Amount
                        </label>

                        <div className="relative">

                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/30">
                                ₹
                            </span>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={amount}
                                onChange={(event) =>
                                    setAmount(
                                        event.target.value
                                    )
                                }
                                placeholder="0.00"
                                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] pl-8 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-violet-400/40"
                            />

                        </div>

                    </div>


                    {/* TYPE */}

                    <div>

                        <label className="mb-2 block text-xs font-medium text-white/50">
                            Type
                        </label>

                        <div className="grid grid-cols-2 gap-2">

                            <button
                                type="button"
                                onClick={() =>
                                    setType(
                                        "EXPENSE"
                                    )
                                }
                                className={`h-11 rounded-xl border text-sm font-medium transition ${
                                    type === "EXPENSE"
                                        ? "border-rose-400/30 bg-rose-400/10 text-rose-400"
                                        : "border-white/10 bg-white/[0.025] text-white/30 hover:text-white"
                                }`}
                            >
                                Expense
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    setType(
                                        "INCOME"
                                    )
                                }
                                className={`h-11 rounded-xl border text-sm font-medium transition ${
                                    type === "INCOME"
                                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                                        : "border-white/10 bg-white/[0.025] text-white/30 hover:text-white"
                                }`}
                            >
                                Income
                            </button>

                        </div>

                    </div>


                    {/* CATEGORY */}

                    <div>

                        <label className="mb-2 block text-xs font-medium text-white/50">
                            Category
                        </label>

                        <select
                            value={category}
                            onChange={(event) =>
                                setCategory(
                                    event.target.value
                                )
                            }
                            disabled={
                                categoriesLoading
                            }
                            className="h-11 w-full rounded-xl border border-white/10 bg-[#15171d] px-4 text-sm text-white outline-none focus:border-violet-400/40"
                        >

                            <option
                                value=""
                            >
                                {categoriesLoading
                                    ? "Loading categories..."
                                    : "Select category"}
                            </option>

                            {categories.map(
                                (
                                    item
                                ) => (

                                    <option
                                        key={
                                            item.id
                                        }
                                        value={
                                            item.name
                                        }
                                    >
                                        {
                                            item.name
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* FREQUENCY */}

                    <div>

                        <label className="mb-2 block text-xs font-medium text-white/50">
                            Frequency
                        </label>

                        <div className="grid grid-cols-4 gap-2">

                            {(
                                [
                                    "DAILY",
                                    "WEEKLY",
                                    "MONTHLY",
                                    "YEARLY",
                                ] as RecurrenceType[]
                            ).map(
                                (
                                    value
                                ) => (

                                    <button
                                        key={
                                            value
                                        }
                                        type="button"
                                        onClick={() =>
                                            setRecurrence(
                                                value
                                            )
                                        }
                                        className={`rounded-xl border px-2 py-2.5 text-xs font-medium transition ${
                                            recurrence ===
                                            value
                                                ? "border-violet-400/30 bg-violet-400/10 text-violet-300"
                                                : "border-white/10 bg-white/[0.025] text-white/30 hover:text-white"
                                        }`}
                                    >
                                        {value
                                                .charAt(
                                                    0
                                                ) +
                                            value
                                                .slice(
                                                    1
                                                )
                                                .toLowerCase()}
                                    </button>

                                )
                            )}

                        </div>

                    </div>


                    {/* NEXT DATE */}

                    <div>

                        <label className="mb-2 block text-xs font-medium text-white/50">
                            Next date
                        </label>

                        <div className="relative">

                            <CalendarDays
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                            />

                            <input
                                type="date"
                                value={nextDate}
                                onChange={(event) =>
                                    setNextDate(
                                        event.target.value
                                    )
                                }
                                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] pl-11 pr-4 text-sm text-white outline-none focus:border-violet-400/40"
                            />

                        </div>

                    </div>


                    {/* ERROR */}

                    {mutation.isError && (

                        <div className="rounded-xl border border-rose-400/10 bg-rose-400/[0.05] px-4 py-3 text-xs text-rose-300">
                            Unable to create recurring transaction. Please try again.
                        </div>

                    )}


                    {/* ACTIONS */}

                    <div className="flex justify-end gap-3 pt-2">

                        <Button
                            type="button"
                            onClick={onClose}
                            variant="ghost"
                            className="rounded-xl text-white/40 hover:bg-white/5 hover:text-white"
                        >
                            Cancel
                        </Button>


                        <Button
                            type="submit"
                            disabled={
                                mutation.isPending
                            }
                            className="rounded-xl bg-white text-black hover:bg-white/90"
                        >

                            {mutation.isPending ? (

                                <>
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />

                                    Creating...

                                </>

                            ) : (

                                <>
                                    <Repeat2
                                        size={16}
                                    />

                                    Create recurring

                                </>

                            )}

                        </Button>

                    </div>

                </form>

            </div>

        </div>
    )
}