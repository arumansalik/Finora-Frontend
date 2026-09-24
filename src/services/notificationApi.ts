import api from "../lib/axios";

export type NotificationType =
    | "SAVINGS_GOAL"
    | "BUDGET"
    | "BILL"
    | "SYSTEM"
    | "INSIGHT";

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    createdAt: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>("/notifications");

    return response.data;
};

export const getUnreadNotifications = async (): Promise<Notification[]> => {
    const response =
        await api.get<Notification[]>("/notifications/unread");

    return response.data;
};

export const getUnreadNotificationCount = async (): Promise<number> => {
    const response =
        await api.get<number>("/notifications/unread/count");

    return response.data;
};

export const markNotificationAsRead = async (
    id: number
): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    await api.patch("/notifications/read-all");
};

export const deleteNotification = async (
    id: number
): Promise<void> => {
    await api.delete(`/notifications/${id}`);
};