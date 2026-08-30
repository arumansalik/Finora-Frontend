import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom"


import AppLayout
    from "@/components/layout/AppLayout"

import ProtectedRoute
    from "@/component/auth/ProtectedRoute"


import Login
    from "./pages/Login"

import Register
    from "./pages/Register"

import Dashboard
    from "./pages/Dashboard"

import Transactions
    from "./pages/Transactions"

import Analytics
    from "./pages/Analytics"

import Budgets
    from "./pages/Budgets"

import Goals
    from "./pages/Goals"

import Recurring
    from "./pages/Recurring"

import Calendar
    from "./pages/Calendar"

import Settings
    from "./pages/Settings"


function App() {

    return (

        <BrowserRouter>

            <Routes>


                {/* ================================================= */}
                {/* PUBLIC ROUTES */}
                {/* ================================================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ================================================= */}
                {/* PROTECTED ROUTES */}
                {/* ================================================= */}

                <Route
                    element={
                        <ProtectedRoute />
                    }
                >

                    <Route
                        element={
                            <AppLayout />
                        }
                    >

                        <Route
                            path="/"
                            element={
                                <Dashboard />
                            }
                        />

                        <Route
                            path="/transactions"
                            element={
                                <Transactions />
                            }
                        />

                        <Route
                            path="/analytics"
                            element={
                                <Analytics />
                            }
                        />

                        <Route
                            path="/budgets"
                            element={
                                <Budgets />
                            }
                        />

                        <Route
                            path="/goals"
                            element={
                                <Goals />
                            }
                        />

                        <Route
                            path="/recurring"
                            element={
                                <Recurring />
                            }
                        />

                        <Route
                            path="/calendar"
                            element={
                                <Calendar />
                            }
                        />

                        <Route
                            path="/settings"
                            element={
                                <Settings />
                            }
                        />

                    </Route>

                </Route>


                {/* ================================================= */}
                {/* FALLBACK */}
                {/* ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    )
}


export default App