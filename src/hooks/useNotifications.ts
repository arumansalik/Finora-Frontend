import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    deleteNotification,
    getNotifications,
    getUnreadNotificationCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../services/notificationApi";


/* ============================================================
   QUERY KEYS
   ============================================================ */

export const notificationKeys = {

    all: ["notifications"] as const,

    lists: () =>
        [...notificationKeys.all, "list"] as const,

    list: () =>
        [...notificationKeys.lists()] as const,

    unreadCount: () =>
        [...notificationKeys.all, "unread-count"] as const,
};


/* ============================================================
   ALL NOTIFICATIONS
   ============================================================ */

export const useNotifications = () => {

    return useQuery({
        queryKey: notificationKeys.list(),
        queryFn: getNotifications,

        staleTime: 15 * 1000,

        refetchInterval: 30 * 1000,

        refetchOnWindowFocus: true,
    });
};


/* ============================================================
   UNREAD COUNT
   ============================================================ */

export const useUnreadNotificationCount = () => {

    return useQuery({
        queryKey: notificationKeys.unreadCount(),
        queryFn: getUnreadNotificationCount,

        staleTime: 10 * 1000,

        refetchInterval: 30 * 1000,

        refetchOnWindowFocus: true,
    });
};


/* ============================================================
   MARK SINGLE NOTIFICATION AS READ
   ============================================================ */

export const useMarkNotificationAsRead = () => {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: (
            id: number
        ) =>
            markNotificationAsRead(id),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey:
                    notificationKeys.list(),
            });

            queryClient.invalidateQueries({
                queryKey:
                    notificationKeys.unreadCount(),
            });
        },
    });
};


/* ============================================================
   MARK ALL AS READ
   ============================================================ */

export const useMarkAllNotificationsAsRead = () => {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn:
        markAllNotificationsAsRead,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey:
                    notificationKeys.list(),
            });

            queryClient.invalidateQueries({
                queryKey:
                    notificationKeys.unreadCount(),
            });
        },
    });
};


/* ============================================================
   DELETE NOTIFICATION
   ============================================================ */

export const useDeleteNotification = () => {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: (
            id: number
        ) =>
            deleteNotification(id),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey:
                    notificationKeys.list(),
            });

            queryClient.invalidateQueries({
                queryKey:
                    notificationKeys.unreadCount(),
            });
        },
    });
};