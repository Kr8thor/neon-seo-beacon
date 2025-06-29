import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
  }),

  getters: {
    hasNotifications: (state) => state.notifications.length > 0,
    activeNotifications: (state) => state.notifications,
    notificationCount: (state) => state.notifications.length,
  },

  actions: {
    add(options) {
      const {
        message,
        type = "info",
        title = null,
        duration = 5000,
        action = null,
        persistent = false,
      } = options;

      const notification = {
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message,
        type, // 'success', 'error', 'warning', 'info'
        title,
        duration: persistent ? null : duration,
        action, // { text: string, handler: function }
        createdAt: Date.now(),
      };

      // Add to notifications array
      this.notifications.push(notification);

      // Auto-remove after duration (if not persistent)
      if (!persistent && duration > 0) {
        setTimeout(() => {
          this.remove(notification.id);
        }, duration);
      }

      return notification.id;
    },

    remove(id) {
      const index = this.notifications.findIndex((n) => n.id === id);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    },

    clear() {
      this.notifications = [];
    },

    // Convenience methods
    success(message, options = {}) {
      return this.add({
        message,
        type: "success",
        duration: 5000,
        ...options,
      });
    },

    error(message, options = {}) {
      return this.add({
        message,
        type: "error",
        duration: 8000,
        ...options,
      });
    },

    warning(message, options = {}) {
      return this.add({
        message,
        type: "warning",
        duration: 6000,
        ...options,
      });
    },

    info(message, options = {}) {
      return this.add({
        message,
        type: "info",
        duration: 5000,
        ...options,
      });
    },

    // Show notification with action button
    withAction(message, type, actionText, actionHandler, options = {}) {
      return this.add({
        message,
        type,
        action: {
          text: actionText,
          handler: actionHandler,
        },
        ...options,
      });
    },

    // Show persistent notification (no auto-dismiss)
    persistent(message, type = "info", options = {}) {
      return this.add({
        message,
        type,
        persistent: true,
        ...options,
      });
    },

    // Bulk operations
    removeByType(type) {
      this.notifications = this.notifications.filter((n) => n.type !== type);
    },

    removeOldNotifications(maxAge = 30000) {
      const now = Date.now();
      this.notifications = this.notifications.filter(
        (n) => !n.duration || now - n.createdAt < maxAge,
      );
    },

    // Get notification by ID
    getById(id) {
      return this.notifications.find((n) => n.id === id);
    },

    // Update notification
    update(id, updates) {
      const notification = this.getById(id);
      if (notification) {
        Object.assign(notification, updates);
      }
    },
  },
});
