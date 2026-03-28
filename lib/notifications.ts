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
      // Try to use Service Worker notification first (better for Android)
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            icon: "/image/logo.png",
            badge: "/image/logo.png",
            requireInteraction: true,
            tag: options?.tag || 'task-reminder',
            ...options,
          }).then(() => {
            // Vibrate after showing notification
            if ("vibrate" in navigator) {
              navigator.vibrate([200, 100, 200])
            }
          })
        }).catch(() => {
          // Fallback to regular notification
          const notification = new Notification(title, {
            icon: "/image/logo.png",
            badge: "/image/logo.png",
            requireInteraction: true,
            ...options,
          })
          
          if ("vibrate" in navigator) {
            navigator.vibrate([200, 100, 200])
          }
        })
      } else {
        // Fallback to regular notification
        const notification = new Notification(title, {
          icon: "/image/logo.png",
          badge: "/image/logo.png",
          requireInteraction: true,
          ...options,
        })

        // Vibrate on mobile if supported
        if ("vibrate" in navigator) {
          navigator.vibrate([200, 100, 200])
        }

        return notification
      }
    }
  },

  scheduleTaskReminder: (taskTitle: string, taskDateTime: string) => {
    const now = new Date()
    const taskDate = new Date(taskDateTime)
    const timeDiff = taskDate.getTime() - now.getTime()

    // Schedule for any future task
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

      // Schedule the notification
      const maxTimeout = 2147483647 // Max setTimeout value (~24.8 days)
      const scheduleTime = Math.min(timeDiff, maxTimeout)
      
      setTimeout(() => {
        // Check if reminder still exists
        const currentReminders = getStoredReminders()
        const stillExists = currentReminders.find(r => r.id === newReminder.id)
        
        if (stillExists) {
          notifications.show("⏰ Nhắc nhở Task", {
            body: taskTitle,
            tag: `task-${newReminder.id}`,
            icon: "/image/logo.png",
            badge: "/image/logo.png",
            requireInteraction: true,
          })

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
        const maxTimeout = 2147483647
        const scheduleTime = Math.min(timeDiff, maxTimeout)
        
        setTimeout(() => {
          notifications.show("⏰ Nhắc nhở Task", {
            body: reminder.title,
            tag: `task-${reminder.id}`,
            icon: "/image/logo.png",
            badge: "/image/logo.png",
            requireInteraction: true,
          })

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
