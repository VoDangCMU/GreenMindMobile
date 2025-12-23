import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "metric" | "survey";
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  icon?: string;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}


function randomEmoji(): string {
  const emojiRanges: Array<[number, number]> = [
    [0x1F300, 0x1F5FF], // symbols & pictographs
    [0x1F600, 0x1F64F], // emoticons
    [0x1F680, 0x1F6FF], // transport & map
    [0x1F900, 0x1F9FF], // supplemental symbols
    [0x1FA00, 0x1FAFF], // extended symbols
  ];

  const [start, end] =
    emojiRanges[Math.floor(Math.random() * emojiRanges.length)];

  const codePoint =
    Math.floor(Math.random() * (end - start + 1)) + start;

  return String.fromCodePoint(codePoint);
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: "1",
          title: "New Metric Feedback",
          message: "Your daily moving metric has been updated with new insights!",
          type: "metric",
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
          actionUrl: "/metrics",
          icon: "📊",
        },
        {
          id: "2",
          title: "Survey Available",
          message: "A new personality survey is available for you to take.",
          type: "survey",
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          actionUrl: "/survey-list",
          icon: "📋",
        },
        {
          id: "3",
          title: "OCEAN Score Updated",
          message: "Your Openness score increased by 3 points after completing today's tasks.",
          type: "success",
          read: true,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          actionUrl: "/home",
          icon: "🎯",
        },
        {
          id: "4",
          title: "Healthy Eating Streak",
          message: "Great job! You've maintained 5 days of plant-based meals.",
          type: "success",
          read: true,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          actionUrl: "/plant-scan-history",
          icon: "🌱",
        },
        {
          id: "5",
          title: "Budget Alert",
          message: "You've spent 80% of your weekly budget. Consider reviewing your expenses.",
          type: "warning",
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
          actionUrl: "/invoice-history",
          icon: "💰",
        },
      ],

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              read: false,
              icon: notification.icon || randomEmoji(),
            },
            ...state.notifications,
          ],
        })),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notif) => ({
            ...notif,
            read: true,
          })),
        })),

      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((notif) => notif.id !== id),
        })),

      clearAll: () => set({ notifications: [] }),

      getUnreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    {
      name: "notification-storage",
    }
  )
);
