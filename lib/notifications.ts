export const notifications = {
  requestPermission: async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      console.warn("Browser không hỗ trợ notifications")
      return false
    }

    if (Notification.permission === "granted") {
      return true
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }

    return false
  },

  show: (title: string, options?: NotificationOptions) => {
    if (Notification.permission === "granted") {
      const notification = new Notification(title, {
        icon: "/image/logo.png",
        badge: "/image/logo.png",
        requireInteraction: true, // Keep notification until user interacts
        ...options,
      })

      // Vibrate on mobile if supported
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200])
      }

      return notification
    }
  },

  scheduleTaskReminder: (taskTitle: string, taskDateTime: string) => {
    const now = new Date()
    const taskDate = new Date(taskDateTime)
    const timeDiff = taskDate.getTime() - now.getTime()

    // Schedule for any future task (removed 24h limit)
    if (timeDiff > 0) {
      // Store in localStorage for persistence
      const reminders = getStoredReminders()
      const newReminder = {
        id: Date.now().toString(),
        title: taskTitle,
        time: taskDateTime,
        scheduled: now.toISOString(),
      }
      reminders.push(newReminder)
      localStorage.setItem("task_reminders", JSON.stringify(reminders))

      // Try to use Service Worker for background notification
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          title: taskTitle,
          body: taskTitle,
          time: taskDateTime,
          id: newReminder.id,
        })
      }

      // Schedule the notification in main thread
      // For tasks > 24h, we'll reschedule on next app load
      const maxTimeout = 2147483647 // Max setTimeout value (~24.8 days)
      const scheduleTime = Math.min(timeDiff, maxTimeout)
      
      setTimeout(() => {
        // Check if service worker already showed it
        const currentReminders = getStoredReminders()
        const stillExists = currentReminders.find(r => r.id === newReminder.id)
        
        if (stillExists) {
          const notification = notifications.show("⏰ Nhắc nhở Task", {
            body: taskTitle,
            tag: taskDateTime,
            icon: "/image/logo.png",
            badge: "/image/logo.png",
            requireInteraction: true,
          })

          // Vibrate on mobile
          if ("vibrate" in navigator) {
            navigator.vibrate([200, 100, 200])
          }

          // Remove from stored reminders after showing
          const updatedReminders = getStoredReminders().filter(
            (r) => r.id !== newReminder.id
          )
          localStorage.setItem("task_reminders", JSON.stringify(updatedReminders))
        }
      }, scheduleTime)
    }
  },

  // Check and reschedule reminders on app load
  rescheduleReminders: () => {
    const reminders = getStoredReminders()
    const now = new Date()

    reminders.forEach((reminder) => {
      const taskDate = new Date(reminder.time)
      const timeDiff = taskDate.getTime() - now.getTime()

      if (timeDiff > 0) {
        // Schedule for any future task
        const maxTimeout = 2147483647 // Max setTimeout value
        const scheduleTime = Math.min(timeDiff, maxTimeout)
        
        setTimeout(() => {
          const notification = notifications.show("⏰ Nhắc nhở Task", {
            body: reminder.title,
            tag: reminder.time,
            icon: "/image/logo.png",
            badge: "/image/logo.png",
            requireInteraction: true,
          })

          // Vibrate on mobile
          if ("vibrate" in navigator) {
            navigator.vibrate([200, 100, 200])
          }

          // Remove from stored reminders
          const updatedReminders = getStoredReminders().filter(
            (r) => r.id !== reminder.id
          )
          localStorage.setItem(
            "task_reminders",
            JSON.stringify(updatedReminders)
          )
        }, scheduleTime)
      } else if (timeDiff <= 0) {
        // Remove expired reminders
        const updatedReminders = getStoredReminders().filter(
          (r) => r.id !== reminder.id
        )
        localStorage.setItem("task_reminders", JSON.stringify(updatedReminders))
      }
    })
  },

  clearAllReminders: () => {
    localStorage.removeItem("task_reminders")
  },
}

function getStoredReminders(): Array<{
  id: string
  title: string
  time: string
  scheduled: string
}> {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("task_reminders")
  return data ? JSON.parse(data) : []
}
