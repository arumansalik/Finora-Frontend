import {
    CalendarDays,
    IndianRupee,
    Tag,
    Type,
    FileText,
} from "lucide-react"

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

import {
    createTransaction,
    updateTransaction,
    type Transaction,
} from "@/services/transactionApi"

import { Button } from "@/components/ui/button"


interface TransactionDialogProps {
    open: boolean
    onClose: () => void
    transaction?: Transaction | null
    onSuccess: () => void
}


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


function TransactionDialog({
                               open,
                               onClose,
                               transaction,
                               onSuccess,
                           }: TransactionDialogProps) {

    const isEditing = Boolean(transaction)


    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),

        defaultValues: {
            title: transaction?.title ?? "",
            amount: transaction?.amount ?? undefined,
            type: transaction?.type ?? "EXPENSE",

            // Backend returns an object.
            // Form needs the category name as a string.
            category:
                transaction?.category ?? "Food",

            date:
                transaction?.date ??
                new Date()
                    .toISOString()
                    .split("T")[0],
        },
    })


    useEffect(() => {

        if (!open) {
            return
        }

        reset({
            title: transaction?.title ?? "",
            amount: transaction?.amount ?? undefined,
            type: transaction?.type ?? "EXPENSE",
            category: transaction?.category ?? "Food",
            date:
                transaction?.date ??
                new Date().toISOString().split("T")[0],
        })

    }, [
        open,
        transaction,
        reset,
    ])


    if (!open) {
        return null
    }


    const onSubmit: SubmitHandler<TransactionFormData> =
        async (data) => {

            try {

                if (isEditing && transaction) {

                    await updateTransaction(
                        transaction.id,
                        data
                    )

                } else {

                    await createTransaction(
                        data
                    )

                }

                onSuccess()
                onClose()

            } catch (error) {

                console.error(
                    "Transaction save failed:",
                    error
                )

            }
        }


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* BACKDROP */}

            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={onClose}
            />


            {/* DIALOG */}

            <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#111318] shadow-2xl shadow-black/50">

                {/* HEADER */}

                <div className="border-b border-white/[0.07] px-6 py-5">

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                        {isEditing
                            ? "Edit transaction"
                            : "New transaction"}
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-white">
                        {isEditing
                            ? "Update your transaction"
                            : "Add a transaction"}
                    </h2>

                    <p className="mt-1 text-sm text-white/35">
                        Keep your financial activity organized.
                    </p>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5 p-6"
                >

                    {/* TITLE */}

                    <div>

                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/65">

                            <FileText size={15} />

                            Title

                        </label>

                        <input
                            {...register("title")}
                            placeholder="e.g. Lunch at restaurant"
                            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50 focus:bg-white/[0.05]"
                        />

                        {errors.title && (

                            <p className="mt-1.5 text-xs text-rose-400">
                                {errors.title.message}
                            </p>

                        )}

                    </div>


                    {/* AMOUNT */}

                    <div>

                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/65">

                            <IndianRupee size={15} />

                            Amount

                        </label>

                        <input
                            type="number"
                            step="0.01"
                            {...register("amount", {
                                valueAsNumber: true,
                            })}
                            placeholder="0.00"
                            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50 focus:bg-white/[0.05]"
                        />

                        {errors.amount && (

                            <p className="mt-1.5 text-xs text-rose-400">
                                {errors.amount.message}
                            </p>

                        )}

                    </div>


                    {/* TYPE */}

                    <div>

                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/65">

                            <Type size={15} />

                            Transaction type

                        </label>


                        <div className="grid grid-cols-2 gap-2">

                            <label className="cursor-pointer">

                                <input
                                    type="radio"
                                    value="EXPENSE"
                                    {...register("type")}
                                    className="peer sr-only"
                                />

                                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm text-white/40 transition peer-checked:border-rose-400/40 peer-checked:bg-rose-400/10 peer-checked:text-rose-400">
                                    Expense
                                </div>

                            </label>


                            <label className="cursor-pointer">

                                <input
                                    type="radio"
                                    value="INCOME"
                                    {...register("type")}
                                    className="peer sr-only"
                                />

                                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm text-white/40 transition peer-checked:border-emerald-400/40 peer-checked:bg-emerald-400/10 peer-checked:text-emerald-400">
                                    Income
                                </div>

                            </label>

                        </div>

                    </div>


                    {/* CATEGORY */}

                    <div>

                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/65">

                            <Tag size={15} />

                            Category

                        </label>

                        <select
                            {...register("category")}
                            className="h-11 w-full rounded-xl border border-white/10 bg-[#15171d] px-4 text-sm text-white outline-none focus:border-violet-400/50"
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

                            <p className="mt-1.5 text-xs text-rose-400">
                                {errors.category.message}
                            </p>

                        )}

                    </div>


                    {/* DATE */}

                    <div>

                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/65">

                            <CalendarDays size={15} />

                            Date

                        </label>

                        <input
                            type="date"
                            {...register("date")}
                            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none focus:border-violet-400/50"
                        />

                        {errors.date && (

                            <p className="mt-1.5 text-xs text-rose-400">
                                {errors.date.message}
                            </p>

                        )}

                    </div>


                    {/* ACTIONS */}

                    <div className="flex justify-end gap-3 border-t border-white/[0.07] pt-5">

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="rounded-xl text-white/50 hover:bg-white/5 hover:text-white"
                        >
                            Cancel
                        </Button>


                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-white text-black hover:bg-white/90"
                        >

                            {isSubmitting
                                ? "Saving..."
                                : isEditing
                                    ? "Save changes"
                                    : "Add transaction"}

                        </Button>

                    </div>

                </form>

            </div>

        </div>
    )
}


export default TransactionDialog