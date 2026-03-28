"use client"

import { useEffect } from "react"
import { notifications } from "@/lib/notifications"

export function NotificationManager() {
  useEffect(() => {
    // Reschedule any pending reminders when app loads
    notifications.rescheduleReminders()

    // Setup service worker message handler
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'GET_REMINDERS') {
          // Send reminders to service worker
          const reminders = localStorage.getItem('task_reminders')
          if (reminders) {
            event.ports[0].postMessage(JSON.parse(reminders))
          } else {
            event.ports[0].postMessage([])
          }
        } else if (event.data && event.data.type === 'REMINDER_SHOWN') {
          // Remove shown reminder from storage
          const reminders = localStorage.getItem('task_reminders')
          if (reminders) {
            const parsed = JSON.parse(reminders)
            const updated = parsed.filter((r: any) => r.id !== event.data.reminderId)
            localStorage.setItem('task_reminders', JSON.stringify(updated))
          }
        }
      })

      // Register periodic sync if supported
      navigator.serviceWorker.ready.then((registration) => {
        if ('periodicSync' in registration) {
          // @ts-ignore - periodicSync is not in types yet
          registration.periodicSync.register('check-reminders-periodic', {
            minInterval: 60 * 1000, // Check every minute
          }).catch((err: any) => {
            console.log('Periodic sync registration failed:', err)
          })
        }
      })
    }

    // Request notification permission if not already granted
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        console.log("Notifications not enabled. Enable in Settings.")
      }
    }
  }, [])

  return null
}
