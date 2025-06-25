export const useNotificationStore = defineStore('notification', () => {
  const notification = ref(null)

  function show({ type = 'info', title, message, duration = 5000 }) {
    notification.value = {
      type,
      title,
      message,
      timestamp: Date.now()
    }

    if (duration > 0) {
      setTimeout(() => {
        clear()
      }, duration)
    }
  }

  function success(message, title = 'Success') {
    show({ type: 'success', title, message })
  }

  function error(message, title = 'Error') {
    show({ type: 'error', title, message })
  }

  function warning(message, title = 'Warning') {
    show({ type: 'warning', title, message })
  }

  function info(message, title = 'Info') {
    show({ type: 'info', title, message })
  }

  function clear() {
    notification.value = null
  }

  return {
    notification: readonly(notification),
    show,
    success,
    error,
    warning,
    info,
    clear
  }
})