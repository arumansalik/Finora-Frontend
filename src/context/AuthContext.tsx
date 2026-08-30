import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react"


import {
    loginUser,
    registerUser,
    type User,
} from "@/services/authApi"


// =====================================================
// TYPES
// =====================================================

interface AuthContextType {

    user: User | null

    token: string | null

    isAuthenticated: boolean

    isLoading: boolean

    login: (
        email: string,
        password: string
    ) => Promise<void>

    register: (
        name: string,
        email: string,
        password: string
    ) => Promise<void>

    logout: () => void
}


// =====================================================
// CONTEXT
// =====================================================

const AuthContext =
    createContext<
        AuthContextType | undefined
    >(undefined)


// =====================================================
// PROVIDER
// =====================================================

export function AuthProvider({
                                 children,
                             }: {
    children: ReactNode
}) {

    const [user, setUser] =
        useState<User | null>(null)


    const [token, setToken] =
        useState<string | null>(null)


    const [isLoading, setIsLoading] =
        useState(true)


    // =================================================
    // RESTORE SESSION
    // =================================================

    useEffect(() => {

        const savedToken =
            localStorage.getItem(
                "finora_token"
            )


        const savedUser =
            localStorage.getItem(
                "finora_user"
            )


        if (
            savedToken &&
            savedUser
        ) {

            try {

                const parsedUser =
                    JSON.parse(
                        savedUser
                    ) as User


                setToken(
                    savedToken
                )


                setUser(
                    parsedUser
                )

            } catch {

                localStorage.removeItem(
                    "finora_token"
                )

                localStorage.removeItem(
                    "finora_user"
                )
            }
        }


        setIsLoading(false)

    }, [])


    // =================================================
    // LOGIN
    // =================================================

    const login = async (
        email: string,
        password: string
    ) => {

        const response =
            await loginUser({
                email,
                password,
            })


        if (
            !response.token ||
            !response.user
        ) {

            throw new Error(
                "Invalid login response from server"
            )
        }


        localStorage.setItem(
            "finora_token",
            response.token
        )


        localStorage.setItem(
            "finora_user",
            JSON.stringify(
                response.user
            )
        )


        setToken(
            response.token
        )


        setUser(
            response.user
        )
    }


    // =================================================
    // REGISTER
    // =================================================

    const register = async (
        name: string,
        email: string,
        password: string
    ) => {

        await registerUser({
            name,
            email,
            password,
        })
    }


    // =================================================
    // LOGOUT
    // =================================================

    const logout = () => {

        localStorage.removeItem(
            "finora_token"
        )


        localStorage.removeItem(
            "finora_user"
        )


        setToken(null)

        setUser(null)
    }


    // =================================================
    // CONTEXT
    // =================================================

    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated:
                    Boolean(
                        token &&
                        user
                    ),
                isLoading,
                login,
                register,
                logout,
            }}
        >

            {children}

        </AuthContext.Provider>
    )
}


// =====================================================
// HOOK
// =====================================================

export function useAuth() {

    const context =
        useContext(
            AuthContext
        )


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        )
    }


    return context
}