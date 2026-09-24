import {
    Bell,
    BellRing,
} from "lucide-react";

import { useState } from "react";

import {
    useUnreadNotificationCount,
} from "../../hooks/useNotifications";

import NotificationCenter from "./NotificationCenter";

export default function NotificationBell() {
    const [open, setOpen] =
        useState(false);

    const {
        data: unreadCount = 0,
    } = useUnreadNotificationCount();

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="
          relative
          flex h-10 w-10
          items-center justify-center
          rounded-xl
          border border-white/10
          bg-white/[0.035]
          text-white/60
          transition-all
          hover:border-white/15
          hover:bg-white/[0.07]
          hover:text-white
        "
                aria-label="Notifications"
            >
                {unreadCount > 0 ? (
                    <BellRing size={18} />
                ) : (
                    <Bell size={18} />
                )}

                {unreadCount > 0 && (
                    <span
                        className="
              absolute -right-1 -top-1
              flex min-h-5 min-w-5
              items-center justify-center
              rounded-full
              border-2 border-[#08090d]
              bg-violet-500
              px-1
              text-[9px]
              font-bold
              text-white
              shadow-lg
              shadow-violet-500/30
            "
                    >
            {unreadCount > 99
                ? "99+"
                : unreadCount}
          </span>
                )}
            </button>

            {open && (
                <>
                    {/* Mobile backdrop */}
                    <button
                        type="button"
                        aria-label="Close notifications"
                        onClick={() => setOpen(false)}
                        className="
              fixed inset-0 z-40
              cursor-default
              bg-black/40
              backdrop-blur-[2px]
              md:hidden
            "
                    />

                    {/* Notification panel */}
                    <div
                        className="
              fixed left-1/2 top-16
              z-50
              -translate-x-1/2

              md:absolute
              md:left-auto
              md:right-0
              md:top-12
              md:translate-x-0
            "
                    >
                        <NotificationCenter
                            onClose={() => setOpen(false)}
                        />
                    </div>
                </>
            )}
        </div>
    );
}