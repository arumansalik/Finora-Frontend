import { useState } from "react"

import { Outlet, useNavigate } from "react-router-dom"

import {
    ChevronDown,
    LogOut,
    Settings,
    Sparkles,
} from "lucide-react"

import Sidebar from "./Sidebar.tsx"

import { useAuth } from "@/context/AuthContext"


export default function AppLayout() {

    // =====================================================
    // AUTH
    // =====================================================

    const {
        user,
        logout,
    } = useAuth()


    // =====================================================
    // NAVIGATION
    // =====================================================

    const navigate =
        useNavigate()


    // =====================================================
    // STATE
    // =====================================================

    const [
        profileOpen,
        setProfileOpen,
    ] = useState(false)


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        setProfileOpen(false)

        logout()

        navigate(
            "/login",
            {
                replace: true,
            }
        )
    }


    // =====================================================
    // AVATAR LETTER
    // =====================================================

    const avatarLetter =
        user?.name
            ?.charAt(0)
            ?.toUpperCase() || "U"


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="min-h-screen bg-[#08090d] text-white">

            <div className="flex min-h-screen">

                {/* ================================================= */}
                {/* SIDEBAR */}
                {/* ================================================= */}

                <Sidebar />


                {/* ================================================= */}
                {/* MAIN */}
                {/* ================================================= */}

                <main className="min-w-0 flex-1">


                    {/* ================================================= */}
                    {/* TOP HEADER */}
                    {/* ================================================= */}

                    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-end border-b border-white/[0.06] bg-[#08090d]/80 px-5 backdrop-blur-xl sm:px-6 lg:px-8">


                        {/* ================================================= */}
                        {/* PROFILE */}
                        {/* ================================================= */}

                        <div className="relative">


                            {/* ================================================= */}
                            {/* PROFILE BUTTON */}
                            {/* ================================================= */}

                            <button
                                type="button"
                                onClick={() =>
                                    setProfileOpen(
                                        (current) =>
                                            !current
                                    )
                                }
                                className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-2.5 py-2 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.05]"
                            >


                                {/* AVATAR */}

                                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 text-xs font-bold text-white shadow-lg shadow-violet-500/10">

                                    {avatarLetter}

                                </div>


                                {/* USER INFO */}

                                <div className="hidden max-w-[150px] text-left sm:block">

                                    <p className="truncate text-xs font-semibold text-white">

                                        {user?.name ||
                                            "User"}

                                    </p>

                                    <p className="truncate text-[10px] text-white/35">

                                        {user?.email ||
                                            "Account"}

                                    </p>

                                </div>


                                {/* CHEVRON */}

                                <ChevronDown
                                    size={15}
                                    className={`
                                        text-white/30
                                        transition-transform
                                        duration-200
                                        ${
                                        profileOpen
                                            ? "rotate-180"
                                            : ""
                                    }
                                    `}
                                />

                            </button>


                            {/* ================================================= */}
                            {/* DROPDOWN */}
                            {/* ================================================= */}

                            {profileOpen && (

                                <>

                                    {/* ================================================= */}
                                    {/* OUTSIDE CLICK AREA */}
                                    {/* ================================================= */}

                                    <button
                                        type="button"
                                        aria-label="Close profile menu"
                                        onClick={() =>
                                            setProfileOpen(
                                                false
                                            )
                                        }
                                        className="fixed inset-0 z-40 h-full w-full cursor-default"
                                    />


                                    {/* ================================================= */}
                                    {/* MENU */}
                                    {/* ================================================= */}

                                    <div className="absolute right-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-2xl border border-white/[0.09] bg-[#111318] shadow-2xl shadow-black/50">


                                        {/* ================================================= */}
                                        {/* PROFILE HEADER */}
                                        {/* ================================================= */}

                                        <div className="border-b border-white/[0.07] p-4">

                                            <div className="flex items-center gap-3">


                                                {/* LARGE AVATAR */}

                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 text-sm font-bold text-white shadow-lg shadow-violet-500/10">

                                                    {avatarLetter}

                                                </div>


                                                {/* DETAILS */}

                                                <div className="min-w-0">

                                                    <p className="truncate text-sm font-semibold text-white">

                                                        {user?.name ||
                                                            "User"}

                                                    </p>

                                                    <p className="mt-0.5 truncate text-xs text-white/35">

                                                        {user?.email ||
                                                            "No email"}

                                                    </p>

                                                </div>

                                            </div>

                                        </div>


                                        {/* ================================================= */}
                                        {/* ACCOUNT LABEL */}
                                        {/* ================================================= */}

                                        <div className="px-4 pb-1 pt-3">

                                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/20">

                                                Account

                                            </p>

                                        </div>


                                        {/* ================================================= */}
                                        {/* MENU ITEMS */}
                                        {/* ================================================= */}

                                        <div className="p-2">


                                            {/* SETTINGS */}

                                            <button
                                                type="button"
                                                onClick={() => {

                                                    setProfileOpen(
                                                        false
                                                    )

                                                    navigate(
                                                        "/settings"
                                                    )

                                                }}
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/55 transition-all hover:bg-white/[0.05] hover:text-white"
                                            >

                                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">

                                                    <Settings
                                                        size={16}
                                                    />

                                                </span>

                                                <span className="flex-1">

                                                    <span className="block font-medium">

                                                        Settings

                                                    </span>

                                                    <span className="block text-[10px] text-white/25">

                                                        Manage your account

                                                    </span>

                                                </span>

                                            </button>


                                            {/* LOGOUT */}

                                            <button
                                                type="button"
                                                onClick={
                                                    handleLogout
                                                }
                                                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-rose-400 transition-all hover:bg-rose-500/[0.08] hover:text-rose-300"
                                            >

                                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/[0.07]">

                                                    <LogOut
                                                        size={16}
                                                    />

                                                </span>

                                                <span className="flex-1">

                                                    <span className="block font-medium">

                                                        Sign out

                                                    </span>

                                                    <span className="block text-[10px] text-rose-400/40">

                                                        End your current session

                                                    </span>

                                                </span>

                                            </button>

                                        </div>


                                        {/* ================================================= */}
                                        {/* FOOTER */}
                                        {/* ================================================= */}

                                        <div className="border-t border-white/[0.07] px-4 py-3">

                                            <div className="flex items-center gap-2 text-[10px] text-white/20">

                                                <Sparkles
                                                    size={12}
                                                />

                                                <span>
                                                    Finora Personal Finance
                                                </span>

                                                <span className="ml-auto">
                                                    v1.0
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                </>

                            )}

                        </div>

                    </header>


                    {/* ================================================= */}
                    {/* PAGE CONTENT */}
                    {/* ================================================= */}

                    <Outlet />

                </main>

            </div>

        </div>
    )
}