import { BrowserRouter, Routes, Route } from "react-router-dom"

import AppLayout from "@/components/layout/AppLayout"

import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Analytics from "./pages/Analytics"
import Budgets from "./pages/Budgets"
import Goals from "./pages/Goals"
import Recurring from "./pages/Recurring"
import Calendar from "./pages/Calendar"
import Settings from "./pages/Settings"

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route element={<AppLayout />}>

                    <Route path="/" element={<Dashboard />} />

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
                        path="/goals"
                        element={<Goals />}
                    />

                    <Route
                        path="/recurring"
                        element={<Recurring />}
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

            </Routes>

        </BrowserRouter>
    )
}

export default App