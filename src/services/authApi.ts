import axios from "axios"


const API_URL =
    "http://localhost:8080/api/auth"


// =====================================================
// TYPES
// =====================================================

export interface User {
    id: number
    name: string
    email: string
}


export interface RegisterRequest {
    name: string
    email: string
    password: string
}


export interface LoginRequest {
    email: string
    password: string
}


export interface AuthResponse {
    message: string
    token?: string
    user?: User
}


// =====================================================
// REGISTER
// =====================================================

export async function registerUser(
    data: RegisterRequest
): Promise<AuthResponse> {

    const response =
        await axios.post<AuthResponse>(
            `${API_URL}/register`,
            data
        )

    return response.data
}


// =====================================================
// LOGIN
// =====================================================

export async function loginUser(
    data: LoginRequest
): Promise<AuthResponse> {

    const response =
        await axios.post<AuthResponse>(
            `${API_URL}/login`,
            data
        )

    return response.data
}