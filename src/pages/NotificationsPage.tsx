import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/common/AppHeader";
import AppHeaderButton from "@/components/common/AppHeaderButton";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/store/notificationStore";
import { Check, CheckCheck, Trash2, Bell, BellOff } from "lucide-react";
import { AppBottomNavBar } from "./HomePage";

interface SwipeState {
  id: string;
  startX: number;
  currentX: number;
  isSwiping: boolean;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll, getUnreadCount, addNotification } = useNotificationStore();
  const [swipeState, setSwipeState] = useState<SwipeState | null>(null);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const unreadCount = getUnreadCount();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "metric": return "📊";
      case "survey": return "📋";
      case "success": return "🎯";
      case "warning": return "⚠️";
      case "info": return "ℹ️";
      default: return "🔔";
    }
  };

  const getNotificationBgColor = (type: string, read: boolean) => {
    if (read) return "bg-gray-50";
    switch (type) {
      case "metric": return "bg-blue-50";
      case "survey": return "bg-purple-50";
      case "success": return "bg-green-50";
      case "warning": return "bg-yellow-50";
      case "info": return "bg-blue-50";
      default: return "bg-white";
    }
  };

  const getNotificationBorderColor = (type: string, read: boolean) => {
    if (read) return "border-gray-200";
    switch (type) {
      case "metric": return "border-blue-200";
      case "survey": return "border-purple-200";
      case "success": return "border-green-200";
      case "warning": return "border-yellow-200";
      case "info": return "border-blue-200";
      default: return "border-gray-200";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("vi-VN");
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    // If revealed, close it instead of navigating
    if (revealedIds.has(notification.id)) {
      setRevealedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(notification.id);
        return newSet;
      });
      return;
    }
    
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    const touch = e.touches[0];
    setSwipeState({
      id,
      startX: touch.clientX,
      currentX: touch.clientX,
      isSwiping: false,
    });
  };

  const handleTouchMove = (e: React.TouchEvent, id: string) => {
    if (!swipeState || swipeState.id !== id) return;
    
    const touch = e.touches[0];
    const deltaX = swipeState.startX - touch.clientX;
    
    // Only allow swipe to left (deltaX > 0)
    if (deltaX > 0) {
      setSwipeState({
        ...swipeState,
        currentX: touch.clientX,
        isSwiping: true,
      });
    }
  };

  const handleTouchEnd = (id: string) => {
    if (!swipeState || swipeState.id !== id) return;
    
    const deltaX = swipeState.startX - swipeState.currentX;
    const REVEAL_THRESHOLD = 80; // px to reveal trash
    const DELETE_THRESHOLD = 150; // px to delete
    
    const isAlreadyRevealed = revealedIds.has(id);
    
    if (deltaX > DELETE_THRESHOLD && isAlreadyRevealed) {
      // Second swipe: animate then delete the notification
      setDeletingIds(prev => new Set(prev).add(id));
      setRevealedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      // Delete after animation completes
      setTimeout(() => {
        deleteNotification(id);
        setDeletingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 300);
    } else if (deltaX > REVEAL_THRESHOLD) {
      // First swipe: reveal trash icon
      setRevealedIds(prev => new Set(prev).add(id));
    } else if (deltaX < REVEAL_THRESHOLD / 2) {
      // Swipe back: hide trash icon
      setRevealedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
    
    setSwipeState(null);
  };

  const getSwipeOffset = (id: string) => {
    // If deleting, swipe all the way off screen
    if (deletingIds.has(id)) {
      return 500;
    }
    
    // If revealed and not currently swiping, show at 80px offset
    if (revealedIds.has(id) && (!swipeState || swipeState.id !== id)) {
      return 80;
    }
    
    if (!swipeState || swipeState.id !== id || !swipeState.isSwiping) return 0;
    const deltaX = swipeState.startX - swipeState.currentX;
    return Math.min(Math.max(deltaX, 0), 250); // Limit swipe to 250px
  };

  const getTrashOpacity = (id: string) => {
    if (revealedIds.has(id)) return 1; // Full opacity when revealed
    const offset = getSwipeOffset(id);
    return Math.min(offset / 80, 1); // Fade in from 0 to 80px
  };

  const handleAddMockNotification = () => {
    const mockTypes: Array<"info" | "success" | "warning" | "metric" | "survey"> = ["info", "success", "warning", "metric", "survey"];
    const mockTitles = [
      "New Achievement Unlocked",
      "Daily Goal Completed",
      "Reminder: Update Your Profile",
      "New Survey Available",
      "Metric Feedback Ready",
      "Weekly Report Generated",
      "Community Event Starting Soon",
      "Health Tip of the Day",
    ];
    const mockMessages = [
      "You've reached a new milestone in your journey!",
      "Congratulations on completing your daily tasks.",
      "Don't forget to update your profile information.",
      "A new survey is waiting for your response.",
      "Your latest metrics have been analyzed.",
      "Check out your weekly progress report.",
      "Join the community event happening now.",
      "Here's a tip to improve your daily routine.",
    ];
    const mockUrls = ["/home", "/metrics", "/survey-list", "/profile", "/quiz", "/plant-scan-history", "/invoice-history"];

    const randomType = mockTypes[Math.floor(Math.random() * mockTypes.length)];
    const randomTitle = mockTitles[Math.floor(Math.random() * mockTitles.length)];
    const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
    const randomUrl = mockUrls[Math.floor(Math.random() * mockUrls.length)];

    addNotification({
      title: randomTitle,
      message: randomMessage,
      type: randomType,
      actionUrl: randomUrl,
    });
  };

  return (
    <SafeAreaLayout
      header={
        <AppHeader
          title="Notifications"
          showBack
          rightActions={[
            <AppHeaderButton
              key="mark-all"
              icon={<CheckCheck className="h-6 w-6 text-greenery-600" />}
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            />,
          ]}
        />
      }
      footer={<AppBottomNavBar />}
    >
      <div className="flex flex-col bg-gradient-to-br from-greenery-50 to-greenery-100 min-h-screen">
        <div className="flex-1 w-full mx-auto px-4 pb-6">
          {/* Stats & Filter */}
          <div className="mb-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell 
                  className="w-5 h-5 text-greenery-600 cursor-pointer hover:text-greenery-700 transition-colors" 
                  onClick={handleAddMockNotification}
                />
                <span className="text-sm font-semibold text-gray-700">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                </span>
              </div>
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <BellOff className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center font-medium">
                No notifications yet
              </p>
              <p className="text-gray-400 text-sm text-center mt-2">
                Click the bell icon above to add a test notification
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="relative overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: deletingIds.has(notification.id) ? '0' : '500px',
                    opacity: deletingIds.has(notification.id) ? 0 : 1,
                    marginBottom: deletingIds.has(notification.id) ? '0' : '0.75rem',
                  }}
                  onTouchStart={(e) => handleTouchStart(e, notification.id)}
                  onTouchMove={(e) => handleTouchMove(e, notification.id)}
                  onTouchEnd={() => handleTouchEnd(notification.id)}
                >
                  {/* Delete background */}
                  <div 
                    className="absolute inset-y-0 right-0 flex items-center justify-end pr-6 bg-red-500 rounded-lg"
                    style={{
                      opacity: getTrashOpacity(notification.id),
                      width: '100%',
                    }}
                  >
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>

                  {/* Notification Card */}
                  <Card
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border ${getNotificationBgColor(notification.type, notification.read)} ${getNotificationBorderColor(notification.type, notification.read)} transition-all cursor-pointer hover:shadow-md relative`}
                    style={{
                      transform: `translateX(-${getSwipeOffset(notification.id)}px)`,
                      transition: swipeState?.id === notification.id ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 text-2xl">
                        {notification.icon || getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className={`font-semibold text-sm ${notification.read ? "text-gray-600" : "text-gray-800"}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-greenery-600 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                          )}
                        </div>

                        <p className={`text-sm mb-2 ${notification.read ? "text-gray-500" : "text-gray-700"}`}>
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {formatTimestamp(notification.timestamp)}
                          </span>

                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="text-gray-500 hover:text-greenery-600 hover:bg-greenery-50 h-7 px-2"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SafeAreaLayout>
  );
}
