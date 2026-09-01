import {
    CalendarDays,
    IndianRupee,
    Tag,
    Type,
    FileText,
    X,
    ArrowDownRight,
    ArrowUpRight,
    Loader2,
} from "lucide-react"

import { toast } from "sonner"
import { useEffect } from "react"

import {
    useForm,
    type SubmitHandler,
} from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import {
    transactionSchema,
    type TransactionFormData,
} from "@/lib/transactionSchema"

import type { Transaction } from "@/services/transactionApi"

import {
    useCreateTransaction,
    useUpdateTransaction,
} from "@/hooks/useTransactions"

import { Button } from "@/components/ui/button"


// =====================================================
// PROPS
// =====================================================

interface TransactionDialogProps {
    open: boolean
    onClose: () => void
    transaction?: Transaction | null
    onSuccess?: () => void
}


// =====================================================
// CATEGORIES
// =====================================================

const categories = [
    "Food",
    "Travel",
    "Bills",
    "Shopping",
    "Salary",
    "Entertainment",
    "Health",
    "Education",
    "Other",
]


// =====================================================
// COMPONENT
// =====================================================

function TransactionDialog({
    open,
    onClose,
    transaction,
    onSuccess,
}: TransactionDialogProps) {

    const isEditing = Boolean(transaction)


    // =====================================================
    // MUTATIONS
    // =====================================================

    const createMutation =
        useCreateTransaction()

    const updateMutation =
        useUpdateTransaction()


    const isSaving =
        createMutation.isPending ||
        updateMutation.isPending


    // =====================================================
    // FORM
    // =====================================================

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: {
            errors,
        },
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),

        defaultValues: {
            title:
                transaction?.title ?? "",

            amount:
                transaction?.amount ?? 0,

            type:
                transaction?.type ?? "EXPENSE",

            category:
                transaction?.category ?? "Food",

            date:
                transaction?.date ??
                new Date()
                    .toISOString()
                    .split("T")[0],
        },
    })


    // =====================================================
    // WATCH TYPE
    // =====================================================

    const selectedType = watch("type")


    // =====================================================
    // RESET FORM
    // =====================================================

    useEffect(() => {

        if (!open) {
            return
        }

        reset({
            title:
                transaction?.title ?? "",

            amount:
                transaction?.amount ?? 0,

            type:
                transaction?.type ?? "EXPENSE",

            category:
                transaction?.category ?? "Food",

            date:
                transaction?.date ??
                new Date()
                    .toISOString()
                    .split("T")[0],
        })

    }, [
        open,
        transaction,
        reset,
    ])


    // =====================================================
    // CLOSE HANDLER
    // =====================================================

    const handleClose = () => {

        if (isSaving) {
            return
        }

        onClose()
    }


    // =====================================================
    // SUBMIT
    // =====================================================

    const onSubmit: SubmitHandler<TransactionFormData> =
        async (data) => {

            try {

                // ==========================================
                // UPDATE
                // ==========================================

                if (
                    transaction
                ) {

                    await updateMutation.mutateAsync({
                        id: transaction.id,
                        data,
                    })

                    toast.success(
                        "Transaction updated",
                        {
                            description:
                                `${data.title} was updated successfully.`,
                        }
                    )

                }

                // ==========================================
                // CREATE
                // ==========================================

                else {

                    await createMutation.mutateAsync(
                        data
                    )

                    toast.success(
                        "Transaction added",
                        {
                            description:
                                `${data.title} was added successfully.`,
                        }
                    )
                }


                // Optional parent callback.
                // Cache invalidation is handled
                // by the mutation hooks.

                onSuccess?.()

                onClose()

            } catch (error) {

                console.error(
                    "Transaction save failed:",
                    error
                )

                toast.error(
                    isEditing
                        ? "Update failed"
                        : "Couldn't add transaction",
                    {
                        description:
                            "Something went wrong. Please try again.",
                    }
                )
            }
        }


    // =====================================================
    // DON'T RENDER WHEN CLOSED
    // =====================================================

    if (!open) {
        return null
    }


    // =====================================================
    // UI
    // =====================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                p-3
                sm:p-6
            "
        >

            {/* =====================================================
                BACKDROP
            ===================================================== */}

            <div
                className="
                    absolute
                    inset-0
                    bg-black/75
                    backdrop-blur-md
                "
                onClick={handleClose}
            />


            {/* =====================================================
                DIALOG
            ===================================================== */}

            <div
                className="
                    relative
                    z-10
                    flex
                    max-h-[94vh]
                    w-full
                    max-w-xl
                    flex-col
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-white/[0.10]
                    bg-[#0f1117]
                    shadow-2xl
                    shadow-black/60
                "
            >

                {/* =================================================
                    TOP GLOW
                ================================================= */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-24
                        -top-24
                        h-56
                        w-56
                        rounded-full
                        bg-violet-500/10
                        blur-3xl
                    "
                />

                <div
                    className="
                        pointer-events-none
                        absolute
                        -left-24
                        top-32
                        h-48
                        w-48
                        rounded-full
                        bg-indigo-500/5
                        blur-3xl
                    "
                />


                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        relative
                        shrink-0
                        border-b
                        border-white/[0.07]
                        px-5
                        py-5
                        sm:px-7
                        sm:py-6
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        "
                    >

                        <div
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-3
                            "
                        >

                            {/* Icon */}

                            <div
                                className={`
flex
h-11
w-11
shrink-0
items-center
justify-center
rounded-2xl
border
${
    selectedType === "INCOME"
        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
        : "border-rose-400/20 bg-rose-400/10 text-rose-400"
}
`}
                            >

                                {selectedType === "INCOME"
                                    ? (
                                        <ArrowUpRight
                                            size={20}
                                        />
                                    )
                                    : (
                                        <ArrowDownRight
                                            size={20}
                                        />
                                    )}

                            </div>


                            {/* Title */}

                            <div className="min-w-0">

                                <p
                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.18em]
                                        text-violet-400
                                    "
                                >
                                    {isEditing
                                        ? "Edit transaction"
                                        : "New transaction"}
                                </p>

                                <h2
                                    className="
                                        mt-1
                                        truncate
                                        text-lg
                                        font-bold
                                        tracking-tight
                                        text-white
                                        sm:text-xl
                                    "
                                >
                                    {isEditing
                                        ? "Update your transaction"
                                        : "Add a transaction"}
                                </h2>

                            </div>

                        </div>


                        {/* Close */}

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSaving}
                            aria-label="Close dialog"
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-white/[0.07]
                                bg-white/[0.03]
                                text-white/35
                                transition
                                hover:border-white/15
                                hover:bg-white/[0.06]
                                hover:text-white
                                disabled:pointer-events-none
                                disabled:opacity-40
                            "
                        >
                            <X size={17} />
                        </button>

                    </div>


                    <p
                        className="
                            mt-3
                            pl-14
                            text-xs
                            leading-5
                            text-white/30
                            sm:text-sm
                        "
                    >
                        Keep your financial activity organized
                        and up to date.
                    </p>

                </div>


                {/* =================================================
                    FORM CONTENT
                ================================================= */}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="
                        flex
                        min-h-0
                        flex-1
                        flex-col
                    "
                >

                    <div
                        className="
                            min-h-0
                            flex-1
                            overflow-y-auto
                            px-5
                            py-5
                            sm:px-7
                            sm:py-6
                        "
                    >

                        <div className="space-y-5">


                            {/* =================================================
                                AMOUNT
                            ================================================= */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-white/40
                                    "
                                >
                                    <IndianRupee size={14} />

                                    Amount
                                </label>


                                <div
                                    className="
                                        relative
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-white/[0.08]
                                        bg-white/[0.025]
                                        transition
                                        focus-within:border-violet-400/40
                                        focus-within:bg-white/[0.04]
                                    "
                                >

                                    <span
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-xl
                                            font-semibold
                                            text-white/35
                                        "
                                    >
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        {...register(
                                            "amount",
                                            {
                                                valueAsNumber:
                                                    true,
                                            }
                                        )}
                                        placeholder="0.00"
                                        className="
                                            h-16
                                            w-full
                                            bg-transparent
                                            pl-10
                                            pr-4
                                            text-2xl
                                            font-bold
                                            tracking-tight
                                            text-white
                                            outline-none
                                            placeholder:text-white/15
                                        "
                                    />

                                </div>


                                {errors.amount && (
                                    <p
                                        className="
                                            mt-1.5
                                            text-xs
                                            text-rose-400
                                        "
                                    >
                                        {errors.amount.message}
                                    </p>
                                )}

                            </div>


                            {/* =================================================
                                TITLE
                            ================================================= */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-white/40
                                    "
                                >
                                    <FileText size={14} />

                                    Description
                                </label>


                                <input
                                    {...register("title")}
                                    placeholder="e.g. Lunch at restaurant"
                                    className="
                                        h-12
                                        w-full
                                        rounded-xl
                                        border
                                        border-white/[0.08]
                                        bg-white/[0.025]
                                        px-4
                                        text-sm
                                        text-white
                                        outline-none
                                        transition
                                        placeholder:text-white/20
                                        focus:border-violet-400/40
                                        focus:bg-white/[0.04]
                                    "
                                />


                                {errors.title && (
                                    <p
                                        className="
                                            mt-1.5
                                            text-xs
                                            text-rose-400
                                        "
                                    >
                                        {errors.title.message}
                                    </p>
                                )}

                            </div>


                            {/* =================================================
                                TYPE
                            ================================================= */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-white/40
                                    "
                                >
                                    <Type size={14} />

                                    Transaction type
                                </label>


                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        gap-3
                                    "
                                >

                                    {/* EXPENSE */}

                                    <label className="cursor-pointer">

                                        <input
                                            type="radio"
                                            value="EXPENSE"
                                            {...register("type")}
                                            className="peer sr-only"
                                        />

                                        <div
                                            className="
                                                relative
                                                flex
                                                items-center
                                                gap-3
                                                rounded-2xl
                                                border
                                                border-white/[0.08]
                                                bg-white/[0.025]
                                                p-4
                                                transition
                                                hover:bg-white/[0.045]
                                                peer-checked:border-rose-400/30
                                                peer-checked:bg-rose-400/[0.08]
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    h-9
                                                    w-9
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-rose-400/10
                                                    text-rose-400
                                                "
                                            >
                                                <ArrowDownRight
                                                    size={18}
                                                />
                                            </div>

                                            <div>

                                                <p
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-white/75
                                                    "
                                                >
                                                    Expense
                                                </p>

                                                <p
                                                    className="
                                                        mt-0.5
                                                        text-[10px]
                                                        text-white/25
                                                    "
                                                >
                                                    Money going out
                                                </p>

                                            </div>

                                        </div>

                                    </label>


                                    {/* INCOME */}

                                    <label className="cursor-pointer">

                                        <input
                                            type="radio"
                                            value="INCOME"
                                            {...register("type")}
                                            className="peer sr-only"
                                        />

                                        <div
                                            className="
                                                relative
                                                flex
                                                items-center
                                                gap-3
                                                rounded-2xl
                                                border
                                                border-white/[0.08]
                                                bg-white/[0.025]
                                                p-4
                                                transition
                                                hover:bg-white/[0.045]
                                                peer-checked:border-emerald-400/30
                                                peer-checked:bg-emerald-400/[0.08]
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    h-9
                                                    w-9
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-emerald-400/10
                                                    text-emerald-400
                                                "
                                            >
                                                <ArrowUpRight
                                                    size={18}
                                                />
                                            </div>

                                            <div>

                                                <p
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-white/75
                                                    "
                                                >
                                                    Income
                                                </p>

                                                <p
                                                    className="
                                                        mt-0.5
                                                        text-[10px]
                                                        text-white/25
                                                    "
                                                >
                                                    Money coming in
                                                </p>

                                            </div>

                                        </div>

                                    </label>

                                </div>

                            </div>


                            {/* =================================================
                                CATEGORY + DATE
                            ================================================= */}

                            <div
                                className="
                                    grid
                                    gap-5
                                    sm:grid-cols-2
                                "
                            >

                                {/* CATEGORY */}

                                <div>

                                    <label
                                        className="
                                            mb-2
                                            flex
                                            items-center
                                            gap-2
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-white/40
                                        "
                                    >
                                        <Tag size={14} />

                                        Category
                                    </label>


                                    <select
                                        {...register("category")}
                                        className="
                                            h-12
                                            w-full
                                            rounded-xl
                                            border
                                            border-white/[0.08]
                                            bg-[#15171d]
                                            px-4
                                            text-sm
                                            text-white
                                            outline-none
                                            transition
                                            focus:border-violet-400/40
                                        "
                                    >

                                        {categories.map(
                                            (category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </option>
                                            )
                                        )}

                                    </select>


                                    {errors.category && (
                                        <p
                                            className="
                                                mt-1.5
                                                text-xs
                                                text-rose-400
                                            "
                                        >
                                            {
                                                errors
                                                    .category
                                                    .message
                                            }
                                        </p>
                                    )}

                                </div>


                                {/* DATE */}

                                <div>

                                    <label
                                        className="
                                            mb-2
                                            flex
                                            items-center
                                            gap-2
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-white/40
                                        "
                                    >
                                        <CalendarDays size={14} />

                                        Date
                                    </label>


                                    <input
                                        type="date"
                                        {...register("date")}
                                        className="
                                            h-12
                                            w-full
                                            rounded-xl
                                            border
                                            border-white/[0.08]
                                            bg-white/[0.025]
                                            px-4
                                            text-sm
                                            text-white
                                            outline-none
                                            transition
                                            focus:border-violet-400/40
                                        "
                                    />


                                    {errors.date && (
                                        <p
                                            className="
                                                mt-1.5
                                                text-xs
                                                text-rose-400
                                            "
                                        >
                                            {errors.date.message}
                                        </p>
                                    )}

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div
                        className="
                            shrink-0
                            border-t
                            border-white/[0.07]
                            bg-[#0f1117]/95
                            px-5
                            py-4
                            sm:px-7
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col-reverse
                                gap-2
                                sm:flex-row
                                sm:items-center
                                sm:justify-end
                            "
                        >

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleClose}
                                disabled={isSaving}
                                className="
                                    h-11
                                    rounded-xl
                                    px-5
                                    text-white/45
                                    hover:bg-white/5
                                    hover:text-white
                                "
                            >
                                Cancel
                            </Button>


                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="
                                    h-11
                                    rounded-xl
                                    bg-white
                                    px-6
                                    font-semibold
                                    text-black
                                    shadow-lg
                                    shadow-white/5
                                    transition
                                    hover:-translate-y-0.5
                                    hover:bg-white/90
                                    disabled:pointer-events-none
                                    disabled:opacity-50
                                "
                            >

                                {isSaving ? (
                                    <>
                                        <Loader2
                                            size={16}
                                            className="mr-2 animate-spin"
                                        />

                                        Saving...
                                    </>
                                ) : (
                                    isEditing
                                        ? "Save changes"
                                        : "Add transaction"
                                )}

                            </Button>

                        </div>

                    </div>

                </form>

            </div>

        </div>
    )
}


export default TransactionDialog