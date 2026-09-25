import {
    Bell,
    CheckCheck,
    CircleAlert,
    CircleDollarSign,
    Info,
    Lightbulb,
    Trash2,
    Check,
} from "lucide-react";

import {
    useDeleteNotification,
    useMarkAllNotificationsAsRead,
    useMarkNotificationAsRead,
    useNotifications,
} from "../hooks/useNotifications";

import type {
    Notification,
    NotificationType,
} from "../services/notificationApi";


/* ============================================================
   NOTIFICATION TYPE CONFIG
   ============================================================ */

const typeConfig: Record<
    NotificationType,
    {
        icon: typeof Bell;
        iconClass: string;
        badgeClass: string;
        label: string;
    }
> = {

    SAVINGS_GOAL: {
        icon: CircleDollarSign,
        iconClass:
            "bg-emerald-500/10 text-emerald-400",
        badgeClass:
            "bg-emerald-500/10 text-emerald-300",
        label: "Savings Goal",
    },

    BUDGET: {
        icon: CircleAlert,
        iconClass:
            "bg-rose-500/10 text-rose-400",
        badgeClass:
            "bg-rose-500/10 text-rose-300",
        label: "Budget",
    },

    BILL: {
        icon: CircleAlert,
        iconClass:
            "bg-amber-500/10 text-amber-400",
        badgeClass:
            "bg-amber-500/10 text-amber-300",
        label: "Bill",
    },

    SYSTEM: {
        icon: Info,
        iconClass:
            "bg-blue-500/10 text-blue-400",
        badgeClass:
            "bg-blue-500/10 text-blue-300",
        label: "System",
    },

    INSIGHT: {
        icon: Lightbulb,
        iconClass:
            "bg-violet-500/10 text-violet-400",
        badgeClass:
            "bg-violet-500/10 text-violet-300",
        label: "Insight",
    },
};


/* ============================================================
   TIME FORMATTER
   ============================================================ */

const formatNotificationTime = (
    createdAt: string
) => {

    const date =
        new Date(createdAt);

    const now =
        new Date();

    const difference =
        now.getTime() -
        date.getTime();

    const minutes =
        Math.floor(
            difference /
            (1000 * 60)
        );


    if (minutes < 1) {
        return "Just now";
    }


    if (minutes < 60) {
        return `${minutes}m ago`;
    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {
        return `${hours}h ago`;
    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days < 7) {
        return `${days}d ago`;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );
};


/* ============================================================
   NOTIFICATION CARD
   ============================================================ */

function NotificationCard({
                              notification,
                          }: {
    notification: Notification;
}) {

    const markAsRead =
        useMarkNotificationAsRead();

    const deleteNotification =
        useDeleteNotification();


    const config =
        typeConfig[
            notification.type
            ] ??
        typeConfig.SYSTEM;


    const Icon =
        config.icon;


    return (

        <article
            className={`
                group
                relative
                rounded-2xl
                border
                p-5
                transition-all
                duration-200

                ${
                notification.read
                    ? `
                            border-white/[0.07]
                            bg-white/[0.02]
                            hover:border-white/[0.12]
                            hover:bg-white/[0.035]
                        `
                    : `
                            border-violet-500/20
                            bg-violet-500/[0.035]
                            shadow-lg
                            shadow-violet-500/[0.02]
                        `
            }
            `}
        >

            {/* ================================================= */}
            {/* UNREAD INDICATOR */}
            {/* ================================================= */}

            {!notification.read && (

                <span
                    className="
                        absolute
                        left-0
                        top-6
                        h-7
                        w-0.5
                        rounded-r-full
                        bg-violet-400
                    "
                />

            )}


            <div className="flex gap-4">


                {/* ================================================= */}
                {/* ICON */}
                {/* ================================================= */}

                <div
                    className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${config.iconClass}
                    `}
                >
                    <Icon size={20} />
                </div>


                {/* ================================================= */}
                {/* CONTENT */}
                {/* ================================================= */}

                <div className="min-w-0 flex-1">


                    {/* HEADER */}

                    <div
                        className="
                            flex
                            flex-wrap
                            items-start
                            justify-between
                            gap-2
                        "
                    >

                        <div className="flex flex-wrap items-center gap-2">

                            <h3
                                className={`
                                    text-sm
                                    ${
                                    notification.read
                                        ? "font-medium text-white/75"
                                        : "font-semibold text-white"
                                }
                                `}
                            >
                                {notification.title}
                            </h3>


                            <span
                                className={`
                                    rounded-full
                                    px-2
                                    py-0.5
                                    text-[9px]
                                    font-medium
                                    ${config.badgeClass}
                                `}
                            >
                                {config.label}
                            </span>

                        </div>


                        <span
                            className="
                                shrink-0
                                text-[11px]
                                text-white/30
                            "
                        >
                            {formatNotificationTime(
                                notification.createdAt
                            )}
                        </span>

                    </div>


                    {/* MESSAGE */}

                    <p
                        className="
                            mt-2
                            max-w-3xl
                            text-sm
                            leading-6
                            text-white/45
                        "
                    >
                        {notification.message}
                    </p>


                    {/* ACTIONS */}

                    <div
                        className="
                            mt-4
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >

                        {!notification.read && (

                            <button
                                type="button"
                                disabled={
                                    markAsRead.isPending
                                }
                                onClick={() =>
                                    markAsRead.mutate(
                                        notification.id
                                    )
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    border
                                    border-white/10
                                    bg-white/[0.03]
                                    px-3
                                    py-1.5
                                    text-[11px]
                                    font-medium
                                    text-white/55
                                    transition
                                    hover:bg-white/[0.07]
                                    hover:text-white
                                    disabled:opacity-50
                                "
                            >

                                <Check size={13} />

                                Mark as read

                            </button>

                        )}


                        <button
                            type="button"
                            disabled={
                                deleteNotification.isPending
                            }
                            onClick={() =>
                                deleteNotification.mutate(
                                    notification.id
                                )
                            }
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-lg
                                px-3
                                py-1.5
                                text-[11px]
                                font-medium
                                text-white/30
                                transition
                                hover:bg-rose-500/10
                                hover:text-rose-400
                                disabled:opacity-50
                            "
                        >

                            <Trash2 size={13} />

                            Delete

                        </button>

                    </div>

                </div>

            </div>

        </article>
    );
}


/* ============================================================
   PAGE
   ============================================================ */

export default function Notifications() {

    const {
        data: notifications = [],
        isLoading,
        isError,
        refetch,
    } = useNotifications();


    const markAllAsRead =
        useMarkAllNotificationsAsRead();


    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.read
        ).length;


    return (

        <div
            className="
                min-h-[calc(100vh-72px)]
                bg-[#08090d]
                px-5
                py-6
                sm:px-6
                lg:px-8
            "
        >

            <div
                className="
                    mx-auto
                    max-w-5xl
                "
            >

                {/* ================================================= */}
                {/* PAGE HEADER */}
                {/* ================================================= */}

                <div
                    className="
                        mb-8
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    "
                >

                    <div>

                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                gap-2
                                text-violet-400
                            "
                        >

                            <Bell size={17} />

                            <span
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.18em]
                                "
                            >
                                Notification Center
                            </span>

                        </div>


                        <h1
                            className="
                                text-2xl
                                font-semibold
                                tracking-tight
                                text-white
                                sm:text-3xl
                            "
                        >
                            Notifications
                        </h1>


                        <p
                            className="
                                mt-2
                                max-w-xl
                                text-sm
                                leading-6
                                text-white/40
                            "
                        >
                            Keep track of important updates
                            about your budgets, savings goals,
                            and financial activity.
                        </p>

                    </div>


                    {/* ================================================= */}
                    {/* HEADER ACTIONS */}
                    {/* ================================================= */}

                    {unreadCount > 0 && (

                        <button
                            type="button"
                            disabled={
                                markAllAsRead.isPending
                            }
                            onClick={() =>
                                markAllAsRead.mutate()
                            }
                            className="
                                inline-flex
                                w-fit
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-white/10
                                bg-white/[0.03]
                                px-4
                                py-2.5
                                text-xs
                                font-medium
                                text-white/60
                                transition
                                hover:border-white/15
                                hover:bg-white/[0.06]
                                hover:text-white
                                disabled:opacity-50
                            "
                        >

                            <CheckCheck size={15} />

                            Mark all as read

                        </button>

                    )}

                </div>


                {/* ================================================= */}
                {/* STATS */}
                {/* ================================================= */}

                {!isLoading &&
                    !isError &&
                    notifications.length > 0 && (

                        <div
                            className="
                                mb-6
                                grid
                                grid-cols-2
                                gap-3
                                sm:grid-cols-3
                            "
                        >

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-white/[0.07]
                                    bg-white/[0.02]
                                    p-4
                                "
                            >

                                <p
                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-white/25
                                    "
                                >
                                    Total
                                </p>

                                <p
                                    className="
                                        mt-2
                                        text-xl
                                        font-semibold
                                        text-white
                                    "
                                >
                                    {notifications.length}
                                </p>

                            </div>


                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-violet-500/10
                                    bg-violet-500/[0.025]
                                    p-4
                                "
                            >

                                <p
                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-violet-300/40
                                    "
                                >
                                    Unread
                                </p>

                                <p
                                    className="
                                        mt-2
                                        text-xl
                                        font-semibold
                                        text-violet-300
                                    "
                                >
                                    {unreadCount}
                                </p>

                            </div>


                            <div
                                className="
                                    hidden
                                    rounded-2xl
                                    border
                                    border-white/[0.07]
                                    bg-white/[0.02]
                                    p-4
                                    sm:block
                                "
                            >

                                <p
                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-white/25
                                    "
                                >
                                    Read
                                </p>

                                <p
                                    className="
                                        mt-2
                                        text-xl
                                        font-semibold
                                        text-white/70
                                    "
                                >
                                    {notifications.length -
                                        unreadCount}
                                </p>

                            </div>

                        </div>

                    )}


                {/* ================================================= */}
                {/* LOADING */}
                {/* ================================================= */}

                {isLoading && (

                    <div className="space-y-3">

                        {[1, 2, 3].map((item) => (

                            <div
                                key={item}
                                className="
                                    animate-pulse
                                    rounded-2xl
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.02]
                                    p-5
                                "
                            >

                                <div className="flex gap-4">

                                    <div
                                        className="
                                            h-11
                                            w-11
                                            rounded-xl
                                            bg-white/[0.05]
                                        "
                                    />

                                    <div className="flex-1 space-y-3">

                                        <div
                                            className="
                                                h-4
                                                w-1/3
                                                rounded
                                                bg-white/[0.05]
                                            "
                                        />

                                        <div
                                            className="
                                                h-3
                                                w-full
                                                rounded
                                                bg-white/[0.05]
                                            "
                                        />

                                        <div
                                            className="
                                                h-3
                                                w-2/3
                                                rounded
                                                bg-white/[0.05]
                                            "
                                        />

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}


                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                {isError && (

                    <div
                        className="
                            rounded-2xl
                            border
                            border-rose-500/10
                            bg-rose-500/[0.025]
                            p-10
                            text-center
                        "
                    >

                        <CircleAlert
                            size={32}
                            className="
                                mx-auto
                                text-rose-400
                            "
                        />

                        <h3
                            className="
                                mt-4
                                text-sm
                                font-semibold
                                text-white
                            "
                        >
                            Unable to load notifications
                        </h3>

                        <p
                            className="
                                mt-2
                                text-xs
                                text-white/35
                            "
                        >
                            Something went wrong while
                            loading your notifications.
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                refetch()
                            }
                            className="
                                mt-5
                                rounded-xl
                                bg-white
                                px-4
                                py-2
                                text-xs
                                font-semibold
                                text-black
                                transition
                                hover:bg-white/90
                            "
                        >
                            Try again
                        </button>

                    </div>

                )}


                {/* ================================================= */}
                {/* EMPTY STATE */}
                {/* ================================================= */}

                {!isLoading &&
                    !isError &&
                    notifications.length === 0 && (

                        <div
                            className="
                                rounded-3xl
                                border
                                border-white/[0.07]
                                bg-white/[0.02]
                                px-6
                                py-20
                                text-center
                            "
                        >

                            <div
                                className="
                                    mx-auto
                                    flex
                                    h-16
                                    w-16
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-white/[0.04]
                                "
                            >

                                <Bell
                                    size={28}
                                    className="
                                        text-white/20
                                    "
                                />

                            </div>


                            <h3
                                className="
                                    mt-5
                                    text-base
                                    font-semibold
                                    text-white
                                "
                            >
                                You're all caught up
                            </h3>


                            <p
                                className="
                                    mx-auto
                                    mt-2
                                    max-w-sm
                                    text-sm
                                    leading-6
                                    text-white/35
                                "
                            >
                                There are no notifications
                                right now. We'll let you know
                                when something important
                                happens.
                            </p>

                        </div>

                    )}


                {/* ================================================= */}
                {/* NOTIFICATIONS */}
                {/* ================================================= */}

                {!isLoading &&
                    !isError &&
                    notifications.length > 0 && (

                        <div className="space-y-3">

                            {notifications.map(
                                (notification) => (

                                    <NotificationCard
                                        key={
                                            notification.id
                                        }
                                        notification={
                                            notification
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}

            </div>

        </div>
    );
}