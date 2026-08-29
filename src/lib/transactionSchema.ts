import { z } from "zod"

export const transactionSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(100, "Title must be less than 100 characters"),

    amount: z
        .number({
            message: "Amount is required",
        })
        .positive("Amount must be greater than 0"),

    type: z.enum(["INCOME", "EXPENSE"], {
        message: "Select a transaction type",
    }),

    category: z
        .string()
        .trim()
        .min(1, "Category is required"),

    date: z
        .string()
        .min(1, "Date is required"),
})

export type TransactionFormData =
    z.infer<typeof transactionSchema>