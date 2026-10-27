import { useState } from "react";

import { Outlet, useNavigate } from "react-router-dom";

import {
    ChevronDown,
    LogOut,
    Settings,
    Sparkles,
} from "lucide-react";

import NotificationBell from "../../component/notifications/NotificationBell.tsx";
import Sidebar from "./Sidebar.tsx";

import { useAuth } from "@/context/AuthContext";

export default function AppLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = () => {
        setProfileOpen(false);
        logout();
        navigate("/login", { replace: true });
    };

    const avatarLetter =
        user?.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <div className="min-h-screen bg-[#07080c] text-white">
            {/* Fixed navigation shell */}
            <Sidebar />

            {/* Main application area */}
            <div className="min-h-screen lg:pl-[276px]">
                <main className="min-w-0">
                    {/* =====================================================
                        TOP NAVBAR
                    ===================================================== */}
                    <header
                        className="
                            sticky top-0 z-40
                            h-[76px]
                            border-b border-white/[0.06]
                            bg-[#07080c]/85
                            backdrop-blur-2xl
                        "
                    >
                        <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                            {/* Page context / brand area */}
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="hidden h-9 w-px bg-white/[0.06] lg:block" />

                                <div className="min-w-0">
                                    <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300/70">
                                        Personal Finance
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-white/30">
                                        Your financial command center
                                    </p>
                                </div>
                            </div>

                            {/* Right actions */}
                            <div className="flex shrink-0 items-center gap-2">
                                <div
                                    className="
                                        hidden items-center gap-2
                                        rounded-xl
                                        border border-emerald-400/10
                                        bg-emerald-400/[0.035]
                                        px-3 py-2
                                        sm:flex
                                    "
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                                    </span>
                                    <span className="text-[10px] font-medium text-emerald-300/70">
                                        All systems active
                                    </span>
                                </div>

                                <NotificationBell />

                                {/* Profile */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setProfileOpen((current) => !current)
                                        }
                                        className="
                                            group flex items-center gap-2.5
                                            rounded-xl
                                            border border-white/[0.07]
                                            bg-white/[0.025]
                                            p-1.5 pr-2.5
                                            transition-all duration-200
                                            hover:border-white/[0.13]
                                            hover:bg-white/[0.05]
                                        "
                                    >
                                        <div
                                            className="
                                                flex h-9 w-9 items-center justify-center
                                                rounded-lg
                                                bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500
                                                text-xs font-bold text-white
                                                shadow-[0_8px_24px_rgba(139,92,246,0.18)]
                                            "
                                        >
                                            {avatarLetter}
                                        </div>

                                        <div className="hidden max-w-[150px] text-left sm:block">
                                            <p className="truncate text-xs font-semibold text-white">
                                                {user?.name || "User"}
                                            </p>
                                            <p className="truncate text-[10px] text-white/30">
                                                {user?.email || "Account"}
                                            </p>
                                        </div>

                                        <ChevronDown
                                            size={14}
                                            className={`text-white/30 transition-transform duration-200 ${
                                                profileOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {profileOpen && (
                                        <>
                                            <button
                                                type="button"
                                                aria-label="Close profile menu"
                                                onClick={() => setProfileOpen(false)}
                                                className="fixed inset-0 z-40 h-full w-full cursor-default"
                                            />

                                            <div
                                                className="
                                                    absolute right-0 top-full z-50 mt-2
                                                    w-[290px]
                                                    overflow-hidden
                                                    rounded-2xl
                                                    border border-white/[0.09]
                                                    bg-[#101217]/95
                                                    shadow-2xl shadow-black/60
                                                    backdrop-blur-2xl
                                                "
                                            >
                                                <div className="border-b border-white/[0.06] p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="
                                                                flex h-11 w-11 shrink-0 items-center justify-center
                                                                rounded-xl
                                                                bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500
                                                                text-sm font-bold text-white
                                                            "
                                                        >
                                                            {avatarLetter}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-white">
                                                                {user?.name || "User"}
                                                            </p>
                                                            <p className="mt-0.5 truncate text-xs text-white/30">
                                                                {user?.email || "No email"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setProfileOpen(false);
                                                            navigate("/settings");
                                                        }}
                                                        className="
                                                            flex w-full items-center gap-3
                                                            rounded-xl px-3 py-2.5
                                                            text-left text-sm text-white/55
                                                            transition hover:bg-white/[0.05] hover:text-white
                                                        "
                                                    >
                                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
                                                            <Settings size={15} />
                                                        </span>

                                                        <span>
                                                            <span className="block font-medium">
                                                                Settings
                                                            </span>
                                                            <span className="mt-0.5 block text-[10px] text-white/25">
                                                                Manage your account
                                                            </span>
                                                        </span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={handleLogout}
                                                        className="
                                                            mt-1 flex w-full items-center gap-3
                                                            rounded-xl px-3 py-2.5
                                                            text-left text-sm text-rose-400
                                                            transition hover:bg-rose-500/[0.08] hover:text-rose-300
                                                        "
                                                    >
                                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/[0.07]">
                                                            <LogOut size={15} />
                                                        </span>

                                                        <span>
                                                            <span className="block font-medium">
                                                                Sign out
                                                            </span>
                                                            <span className="mt-0.5 block text-[10px] text-rose-400/40">
                                                                End your current session
                                                            </span>
                                                        </span>
                                                    </button>
                                                </div>

                                                <div className="border-t border-white/[0.06] px-4 py-3">
                                                    <div className="flex items-center gap-2 text-[10px] text-white/20">
                                                        <Sparkles size={11} />
                                                        <span>Finora Personal Finance</span>
                                                        <span className="ml-auto">v1.0</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Every page renders here */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
