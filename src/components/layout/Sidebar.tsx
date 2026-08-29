import {
    LayoutDashboard,
    ArrowLeftRight,
    BarChart3,
    WalletCards,
    Target,
    Repeat,
    // CalendarDays,
    Settings,
    // ChevronRight,
} from "lucide-react"

import { NavLink } from "react-router-dom"

const mainNavigation = [
    {
        name: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
    },
    {
        name: "Transactions",
        path: "/transactions",
        icon: ArrowLeftRight,
    },
    {
        name: "Analytics",
        path: "/analytics",
        icon: BarChart3,
    },
]

const moneyNavigation = [
    {
        name: "Budgets",
        path: "/budgets",
        icon: WalletCards,
    },
    {
        name: "Goals",
        path: "/goals",
        icon: Target,
    },
    {
        name: "Recurring",
        path: "/recurring",
        icon: Repeat,
    },
]

export default function Sidebar() {
    return (
        <aside className="hidden lg:flex w-64 min-h-screen flex-col border-r border-white/10 bg-[#0c0d12] px-4 py-6">

            {/* Logo */}

            <div className="flex items-center gap-3 px-3 mb-10">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black font-bold">
                    ◈
                </div>

                <div>
                    <h1 className="text-lg font-semibold tracking-tight">
                        FINORA
                    </h1>

                    <p className="text-[10px] uppercase tracking-widest text-white/40">
                        Personal Finance
                    </p>
                </div>

            </div>

            {/* Main */}

            <div className="mb-8">

                <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                    Overview
                </p>

                <nav className="space-y-1">

                    {mainNavigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                                    isActive
                                        ? "bg-white/10 text-white"
                                        : "text-white/50 hover:bg-white/5 hover:text-white"
                                }`
                            }
                        >
                            <item.icon size={18} />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}

                </nav>

            </div>

            {/* Money */}

            <div>

                <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                    Money
                </p>

                <nav className="space-y-1">

                    {moneyNavigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                                    isActive
                                        ? "bg-white/10 text-white"
                                        : "text-white/50 hover:bg-white/5 hover:text-white"
                                }`
                            }
                        >
                            <item.icon size={18} />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}

                </nav>

            </div>

            {/* Bottom */}

            <div className="mt-auto">

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 mb-4">

                    <div className="flex items-center justify-between mb-3">

            <span className="text-xs text-white/50">
              Financial Health
            </span>

                        <span className="text-xs text-white/40">
              84/100
            </span>

                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">

                        <div className="h-full w-[84%] rounded-full bg-white" />

                    </div>

                    <p className="mt-3 text-xs text-white/40">
                        You're doing great this month.
                    </p>

                </div>

                <NavLink
                    to="/settings"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 hover:bg-white/5 hover:text-white"
                >
                    <Settings size={18} />
                    Settings
                </NavLink>

            </div>

        </aside>
    )
}