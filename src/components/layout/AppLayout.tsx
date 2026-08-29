import { Outlet } from "react-router-dom"

import Sidebar from "./Sidebar.tsx"

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-[#08090d] text-white">

            <div className="flex">

                <Sidebar />

                <main className="min-w-0 flex-1">
                    <Outlet />
                </main>

            </div>

        </div>
    )
}