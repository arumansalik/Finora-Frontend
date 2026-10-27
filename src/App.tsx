import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom"

import FinancialHealth from "./pages/FinancialHealth";
import AppLayout
    from "@/components/layout/AppLayout"

import ProtectedRoute
    from "@/component/auth/ProtectedRoute"
import LandingPage from "@/pages/LandingPage";
import SavingsGoals from "./pages/SavingsGoals";
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

import Notifications from "./pages/Notifications";
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
                {/* Public routes */}
                <Route
                    path="/landing"
                    element={<LandingPage />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Root URL: show landing page */}
                <Route
                    path="/"
                    element={<LandingPage />}
                />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/transactions"
                            element={<Transactions />}
                        />

                        <Route
                            path="/analytics"
                            element={<Analytics />}
                        />

                        <Route
                            path="/budgets"
                            element={<Budgets />}
                        />

                        <Route
                            path="/savings-goals"
                            element={<SavingsGoals />}
                        />

                        <Route
                            path="/recurring"
                            element={<Recurring />}
                        />

                        <Route
                            path="/notifications"
                            element={<Notifications />}
                        />

                        <Route
                            path="/financial-health"
                            element={<FinancialHealth />}
                        />

                        <Route
                            path="/calendar"
                            element={<Calendar />}
                        />

                        <Route
                            path="/settings"
                            element={<Settings />}
                        />
                    </Route>
                </Route>

                {/* Unknown URLs */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
