import {
    useEffect,
} from "react"

import {
    useForm,
} from "react-hook-form"

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query"

import {
    createBudget,
    updateBudget,
    type Budget,
    type BudgetRequest,
} from "@/services/budgetApi"

import { Button } from "@/components/ui/button"


interface Category {
    id: number
    name: string
}


interface BudgetDialogProps {

    open: boolean

    onClose: () => void

    budget: Budget | null

    categories: Category[]

    month: number

    year: number
}


interface FormData {

    amount: number

    categoryId: number
}


export default function BudgetDialog({
                                         open,
                                         onClose,
                                         budget,
                                         categories,
                                         month,
                                         year,
                                     }: BudgetDialogProps) {

    const queryClient =
        useQueryClient()


    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
        },
    } = useForm<FormData>({
        defaultValues: {
            amount: 0,
            categoryId: 0,
        },
    })


    useEffect(() => {

        if (!open) {
            return
        }


        reset({

            amount:
                budget?.budget ?? 0,

            categoryId:
                budget?.category?.id ??
                categories[0]?.id ??
                0,

        })

    }, [
        open,
        budget,
        categories,
        reset,
    ])


    const mutation =
        useMutation({

            mutationFn:
                async (
                    data: FormData
                ) => {

                    const payload:
                        BudgetRequest = {

                        amount:
                            Number(
                                data.amount
                            ),

                        categoryId:
                            Number(
                                data.categoryId
                            ),

                        month,

                        year,

                    }


                    if (budget) {

                        return updateBudget(
                            budget.id,
                            payload
                        )
                    }


                    return createBudget(
                        payload
                    )
                },


            onSuccess: async () => {

                await queryClient.invalidateQueries({
                    queryKey: [
                        "budgets",
                    ],
                })


                onClose()
            },

        })


    if (!open) {
        return null
    }


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#101116] p-6 shadow-2xl">


                {/* HEADER */}

                <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-400">
                        Budget management
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-white">
                        {budget
                            ? "Edit budget"
                            : "Create budget"}
                    </h2>

                    <p className="mt-1 text-xs text-white/30">
                        Set your spending limit for this category.
                    </p>

                </div>


                <form
                    onSubmit={
                        handleSubmit(
                            (data) =>
                                mutation.mutate(
                                    data
                                )
                        )
                    }
                    className="mt-7 space-y-5"
                >


                    {/* CATEGORY */}

                    <div>

                        <label className="mb-2 block text-xs font-medium text-white/50">
                            Category
                        </label>


                        <select
                            {...register(
                                "categoryId",
                                {
                                    valueAsNumber:
                                        true,

                                    validate:
                                        (value) =>
                                            value > 0 ||
                                            "Please select a category",
                                }
                            )}
                            className="h-11 w-full rounded-xl border border-white/10 bg-[#15171d] px-3 text-sm text-white outline-none focus:border-violet-400/50"
                        >

                            <option
                                value={0}
                                disabled
                            >
                                Select category
                            </option>


                            {categories.map(
                                (
                                    category
                                ) => (

                                    <option
                                        key={
                                            category.id
                                        }
                                        value={
                                            category.id
                                        }
                                    >
                                        {
                                            category.name
                                        }
                                    </option>

                                )
                            )}

                        </select>


                        {categories.length === 0 && (

                            <p className="mt-2 text-xs text-amber-400">
                                No categories available.
                            </p>

                        )}


                        {errors.categoryId && (

                            <p className="mt-2 text-xs text-rose-400">
                                {
                                    errors.categoryId.message
                                }
                            </p>

                        )}

                    </div>


                    {/* AMOUNT */}

                    <div>

                        <label className="mb-2 block text-xs font-medium text-white/50">
                            Monthly budget
                        </label>


                        <div className="relative">

                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/30">
                                ₹
                            </span>


                            <input
                                type="number"
                                step="0.01"
                                min="1"
                                {...register(
                                    "amount",
                                    {
                                        valueAsNumber:
                                            true,

                                        required:
                                            "Budget amount is required",

                                        min: {
                                            value: 1,

                                            message:
                                                "Budget must be greater than ₹0",
                                        },
                                    }
                                )}
                                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-8 pr-4 text-sm text-white outline-none focus:border-violet-400/50"
                                placeholder="5000"
                            />

                        </div>


                        {errors.amount && (

                            <p className="mt-2 text-xs text-rose-400">
                                {
                                    errors.amount.message
                                }
                            </p>

                        )}

                    </div>


                    {/* ACTIONS */}

                    <div className="flex gap-3 pt-2">

                        <Button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                        >
                            Cancel
                        </Button>


                        <Button
                            type="submit"
                            disabled={
                                mutation.isPending ||
                                categories.length === 0
                            }
                            className="flex-1 rounded-xl bg-white text-black hover:bg-white/90"
                        >

                            {mutation.isPending
                                ? "Saving..."
                                : budget
                                    ? "Save changes"
                                    : "Create budget"}

                        </Button>

                    </div>


                    {mutation.isError && (

                        <p className="text-center text-xs text-rose-400">
                            Failed to save budget.
                            Check the backend response.
                        </p>

                    )}

                </form>

            </div>

        </div>
    )
}