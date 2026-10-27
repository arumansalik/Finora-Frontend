import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom"

import {
    useAuth,
} from "@/context/AuthContext"


export default function ProtectedRoute() {

    const {
        isAuthenticated,
        isLoading,
    } = useAuth()


    const location =
        useLocation()


    // =================================================
    // RESTORING SESSION
    // =================================================

    if (isLoading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-[#07080c] text-white">

                <div className="flex flex-col items-center gap-4">

                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />

                    <p className="text-sm text-white/40">
                        Loading Finora...
                    </p>

                </div>

            </div>
        )
    }


    // =================================================
    // NOT AUTHENTICATED
    // =================================================

    if (!isAuthenticated) {

        return (

            <Navigate
                to="/login"
                replace
                state={{
                    from:
                    location.pathname,
                }}
            />
        )
    }


    // =================================================
    // AUTHENTICATED
    // =================================================

    return <Outlet />
}