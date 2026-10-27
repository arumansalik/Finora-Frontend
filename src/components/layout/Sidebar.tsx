import {
    LayoutDashboard,
    ArrowLeftRight,
    BarChart3,
    WalletCards,
    Target,
    Repeat,
    Bell,
    Settings,
    HeartPulse,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useUnreadNotificationCount } from "../../hooks/useNotifications";

const mainNavigation = [
    {
        name: "Dashboard",
        path: "/dashboard",
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
    {
        name: "Financial Health",
        path: "/financial-health",
        icon: HeartPulse,
    },
];

const moneyNavigation = [
    {
        name: "Budgets",
        path: "/budgets",
        icon: WalletCards,
    },
    {
        name: "Savings Goals",
        path: "/savings-goals",
        icon: Target,
    },
    {
        name: "Recurring",
        path: "/recurring",
        icon: Repeat,
    },
];

function NavigationItem({
                            name,
                            path,
                            icon: Icon,
                            end = false,
                        }: {
    name: string;
    path: string;
    icon: typeof LayoutDashboard;
    end?: boolean;
}) {
    return (
        <NavLink
            to={path}
            end={end}
            className={({ isActive }) =>
                `
                    group relative flex items-center gap-3
                    rounded-xl px-3 py-2.5
                    text-sm font-medium
                    transition-all duration-200
                    ${
                    isActive
                        ? "bg-white/[0.075] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.055)]"
                        : "text-white/42 hover:bg-white/[0.045] hover:text-white/85"
                }
                `
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />
                    )}

                    <span
                        className={`
                            flex h-8 w-8 shrink-0 items-center justify-center
                            rounded-lg transition-all duration-200
                            ${
                            isActive
                                ? "bg-violet-400/[0.10] text-violet-300"
                                : "bg-white/[0.025] text-white/35 group-hover:bg-white/[0.055] group-hover:text-white/70"
                        }
                        `}
                    >
                        <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                    </span>

                    <span className="truncate">{name}</span>

                    {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                    )}
                </>
            )}
        </NavLink>
    );
}

export default function Sidebar() {
    const { data: unreadCount = 0 } = useUnreadNotificationCount();

    return (
        <aside
            className="
                fixed inset-y-0 left-0 z-50
                hidden w-[276px] lg:flex
                flex-col
                border-r border-white/[0.06]
                bg-[#090a0f]
            "
        >
            {/* Subtle ambient glow */}
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-500/[0.045] blur-3xl" />

            {/* =====================================================
                BRAND
            ===================================================== */}
            <div className="relative flex h-[76px] shrink-0 items-center border-b border-white/[0.06] px-5">
                <div className="flex items-center gap-3">
                    <div
                        className="
                            relative flex h-10 w-10 items-center justify-center
                            overflow-hidden rounded-xl
                            bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600
                            text-sm font-black text-white
                            shadow-[0_10px_30px_rgba(124,58,237,0.22)]
                        "
                    >
                        <span className="absolute inset-0 bg-white/10" />
                        <span className="relative">F</span>
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="text-[15px] font-bold tracking-[0.12em] text-white">
                                FINORA
                            </h1>
                            <span className="rounded-md border border-violet-400/10 bg-violet-400/[0.06] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-violet-300/70">
                                Pro
                            </span>
                        </div>

                        <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-white/25">
                            Personal Finance
                        </p>
                    </div>
                </div>
            </div>

            {/* =====================================================
                NAVIGATION — scrolls internally, shell stays fixed
            ===================================================== */}
            <div className="relative min-h-0 flex-1 overflow-y-auto px-3 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="space-y-7">
                    <section>
                        <div className="mb-2 px-3">
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
                                Overview
                            </p>
                        </div>

                        <nav className="space-y-1">
                            {mainNavigation.map((item) => (
                                <NavigationItem
                                    key={item.name}
                                    {...item}
                                    end={item.path === "/"}
                                />
                            ))}
                        </nav>
                    </section>

                    <section>
                        <div className="mb-2 px-3">
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
                                Money
                            </p>
                        </div>

                        <nav className="space-y-1">
                            {moneyNavigation.map((item) => (
                                <NavigationItem
                                    key={item.name}
                                    {...item}
                                />
                            ))}

                            <NavLink
                                to="/notifications"
                                className={({ isActive }) =>
                                    `
                                        group relative flex items-center gap-3
                                        rounded-xl px-3 py-2.5
                                        text-sm font-medium
                                        transition-all duration-200
                                        ${
                                        isActive
                                            ? "bg-white/[0.075] text-white"
                                            : "text-white/42 hover:bg-white/[0.045] hover:text-white/85"
                                    }
                                    `
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-violet-400" />
                                        )}

                                        <span
                                            className={`
                                                relative flex h-8 w-8 shrink-0 items-center justify-center
                                                rounded-lg
                                                ${
                                                isActive
                                                    ? "bg-violet-400/[0.10] text-violet-300"
                                                    : "bg-white/[0.025] text-white/35 group-hover:bg-white/[0.055] group-hover:text-white/70"
                                            }
                                            `}
                                        >
                                            <Bell size={16} />

                                            {unreadCount > 0 && (
                                                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.9)]" />
                                            )}
                                        </span>

                                        <span className="flex-1">Notifications</span>

                                        {unreadCount > 0 && (
                                            <span className="min-w-5 rounded-full bg-violet-500/10 px-1.5 py-0.5 text-center text-[9px] font-bold text-violet-300">
                                                {unreadCount > 99 ? "99+" : unreadCount}
                                            </span>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        </nav>
                    </section>
                </div>
            </div>

            {/* =====================================================
                BOTTOM AREA — always visible
            ===================================================== */}
            <div className="shrink-0 border-t border-white/[0.06] p-3">
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `
                            group flex items-center gap-3 rounded-xl
                            px-3 py-2.5 text-sm font-medium
                            transition-all duration-200
                            ${
                            isActive
                                ? "bg-white/[0.075] text-white"
                                : "text-white/42 hover:bg-white/[0.045] hover:text-white/85"
                        }
                        `
                    }
                >
                    {({ isActive }) => (
                        <>
                            <span
                                className={`
                                    flex h-8 w-8 items-center justify-center rounded-lg
                                    ${
                                    isActive
                                        ? "bg-violet-400/[0.10] text-violet-300"
                                        : "bg-white/[0.025] text-white/35 group-hover:text-white/70"
                                }
                                `}
                            >
                                <Settings size={16} />
                            </span>

                            <span>Settings</span>

                            <span className="ml-auto text-[9px] text-white/15">
                                →
                            </span>
                        </>
                    )}
                </NavLink>

                <div className="mt-2 flex items-center justify-between px-3 pt-2">
                    <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[9px] text-white/20">
                            Secure session
                        </span>
                    </div>

                    <span className="text-[9px] text-white/15">
                        v1.0
                    </span>
                </div>
            </div>
        </aside>
    );
}