import {
    Bell,
    Check,
    CheckCheck,
    CircleAlert,
    CircleDollarSign,
    Info,
    Lightbulb,
    Trash2,
    X,
} from "lucide-react";

import {
    useDeleteNotification,
    useMarkAllNotificationsAsRead,
    useMarkNotificationAsRead,
    useNotifications,
} from "../../hooks/useNotifications";

import type {
    Notification,
    NotificationType,
} from "../../services/notificationApi";

interface NotificationCenterProps {
    onClose?: () => void;
}

const typeConfig: Record<
    NotificationType,
    {
        icon: typeof Bell;
        className: string;
    }
> = {
    SAVINGS_GOAL: {
        icon: CircleDollarSign,
        className:
            "text-emerald-400 bg-emerald-500/10",
    },

    BUDGET: {
        icon: CircleAlert,
        className:
            "text-rose-400 bg-rose-500/10",
    },

    BILL: {
        icon: CircleAlert,
        className:
            "text-amber-400 bg-amber-500/10",
    },

    SYSTEM: {
        icon: Info,
        className:
            "text-blue-400 bg-blue-500/10",
    },

    INSIGHT: {
        icon: Lightbulb,
        className:
            "text-violet-400 bg-violet-500/10",
    },
};

const formatNotificationTime = (
    createdAt: string
) => {
    const date = new Date(createdAt);

    const now = new Date();

    const difference =
        now.getTime() - date.getTime();

    const minutes = Math.floor(
        difference / (1000 * 60)
    );

    if (minutes < 1) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days}d ago`;
    }

    return date.toLocaleDateString();
};

const NotificationItem = ({
                              notification,
                          }: {
    notification: Notification;
}) => {
    const markAsRead =
        useMarkNotificationAsRead();

    const deleteMutation =
        useDeleteNotification();

    const config =
        typeConfig[notification.type] ??
        typeConfig.SYSTEM;

    const Icon = config.icon;

    return (
        <div
            className={`
        group relative
        border-b border-white/5
        px-4 py-4
        transition
        hover:bg-white/[0.035]
        ${
                !notification.read
                    ? "bg-violet-500/[0.035]"
                    : ""
            }
      `}
        >
            {!notification.read && (
                <span
                    className="
            absolute left-1 top-5
            h-2 w-2
            rounded-full
            bg-violet-400
            shadow-[0_0_12px_rgba(167,139,250,0.8)]
          "
                />
            )}

            <div className="flex gap-3">
                <div
                    className={`
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-xl
            ${config.className}
          `}
                >
                    <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <h4
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
                        </h4>

                        <span className="shrink-0 text-[11px] text-white/35">
              {formatNotificationTime(
                  notification.createdAt
              )}
            </span>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-white/50">
                        {notification.message}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                        {!notification.read && (
                            <button
                                type="button"
                                onClick={() =>
                                    markAsRead.mutate(notification.id)
                                }
                                disabled={markAsRead.isPending}
                                className="
                  inline-flex items-center gap-1.5
                  rounded-lg
                  border border-white/10
                  bg-white/[0.04]
                  px-2.5 py-1.5
                  text-[11px]
                  font-medium
                  text-white/60
                  transition
                  hover:bg-white/[0.08]
                  hover:text-white
                  disabled:opacity-50
                "
                            >
                                <Check size={13} />
                                Mark read
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() =>
                                deleteMutation.mutate(
                                    notification.id
                                )
                            }
                            disabled={deleteMutation.isPending}
                            className="
                inline-flex items-center gap-1.5
                rounded-lg
                px-2.5 py-1.5
                text-[11px]
                font-medium
                text-white/35
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
        </div>
    );
};

export default function NotificationCenter({
                                               onClose,
                                           }: NotificationCenterProps) {
    const {
        data: notifications = [],
        isLoading,
        isError,
    } = useNotifications();

    const markAllAsRead =
        useMarkAllNotificationsAsRead();

    const unreadCount =
        notifications.filter(
            (notification) => !notification.read
        ).length;

    return (
        <div
            className="
        flex
        h-[min(680px,calc(100vh-120px))]
        w-[min(420px,calc(100vw-32px))]
        flex-col
        overflow-hidden
        rounded-2xl
        border border-white/10
        bg-[#0d0f15]
        shadow-2xl
        shadow-black/50
      "
        >
            {/* Header */}
            <div
                className="
          flex items-center justify-between
          border-b border-white/10
          px-5 py-4
        "
            >
                <div>
                    <div className="flex items-center gap-2">
                        <Bell
                            size={18}
                            className="text-violet-400"
                        />

                        <h2 className="text-sm font-semibold text-white">
                            Notifications
                        </h2>

                        {unreadCount > 0 && (
                            <span
                                className="
                  rounded-full
                  bg-violet-500/15
                  px-2 py-0.5
                  text-[10px]
                  font-semibold
                  text-violet-300
                "
                            >
                {unreadCount} new
              </span>
                        )}
                    </div>

                    <p className="mt-1 text-xs text-white/35">
                        Stay updated with your finances
                    </p>
                </div>

                <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={() =>
                                markAllAsRead.mutate()
                            }
                            disabled={markAllAsRead.isPending}
                            title="Mark all as read"
                            className="
                rounded-lg
                p-2
                text-white/40
                transition
                hover:bg-white/5
                hover:text-white
                disabled:opacity-50
              "
                        >
                            <CheckCheck size={17} />
                        </button>
                    )}

                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                rounded-lg
                p-2
                text-white/40
                transition
                hover:bg-white/5
                hover:text-white
              "
                        >
                            <X size={17} />
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="min-h-0 flex-1 overflow-y-auto">
                {isLoading && (
                    <div className="space-y-4 p-5">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="flex gap-3"
                            >
                                <div className="h-10 w-10 animate-pulse rounded-xl bg-white/5" />

                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />

                                    <div className="h-3 w-full animate-pulse rounded bg-white/5" />

                                    <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="flex h-full items-center justify-center px-6 text-center">
                        <div>
                            <CircleAlert
                                size={32}
                                className="mx-auto text-rose-400"
                            />

                            <p className="mt-3 text-sm font-medium text-white">
                                Couldn't load notifications
                            </p>

                            <p className="mt-1 text-xs text-white/40">
                                Please try again in a moment.
                            </p>
                        </div>
                    </div>
                )}

                {!isLoading &&
                    !isError &&
                    notifications.length === 0 && (
                        <div className="flex h-full items-center justify-center px-6 text-center">
                            <div>
                                <div
                                    className="
                    mx-auto flex h-14 w-14
                    items-center justify-center
                    rounded-2xl
                    bg-white/[0.04]
                  "
                                >
                                    <Bell
                                        size={24}
                                        className="text-white/25"
                                    />
                                </div>

                                <p className="mt-4 text-sm font-medium text-white">
                                    You're all caught up
                                </p>

                                <p className="mt-1 text-xs text-white/35">
                                    New financial updates will appear here.
                                </p>
                            </div>
                        </div>
                    )}

                {!isLoading &&
                    !isError &&
                    notifications.map(
                        (notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                            />
                        )
                    )}
            </div>
        </div>
    );
}