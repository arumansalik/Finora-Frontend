import api from "@/lib/axios"

export interface Category {
    id: number
    name: string
}

export async function getCategories(): Promise<Category[]> {

    const response =
        await api.get<Category[]>(
            "/categories"
        )

    return response.data
}