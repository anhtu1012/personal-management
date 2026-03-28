const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  '/calendar',
  '/profile',
  '/icon.png',
  '/manifest.json'
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Notification click event - open app when notification is clicked
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If app is already open, focus it
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // If app is not open, open it
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Background sync for scheduled notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'check-reminders') {
    event.waitUntil(checkAndShowReminders());
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-reminders-periodic') {
    event.waitUntil(checkAndShowReminders());
  }
});

// Check reminders and show notifications
async function checkAndShowReminders() {
  try {
    // Get reminders from IndexedDB or communicate with main app
    const reminders = await getReminders();
    const now = new Date();

    for (const reminder of reminders) {
      const reminderTime = new Date(reminder.time);
      const timeDiff = reminderTime.getTime() - now.getTime();

      // Show notification if time has come (within 1 minute window)
      if (timeDiff <= 60000 && timeDiff >= -60000) {
        await self.registration.showNotification('⏰ Nhắc nhở Task', {
          body: reminder.title,
          icon: '/image/logo.png',
          badge: '/image/logo.png',
          vibrate: [200, 100, 200],
          tag: reminder.id,
          requireInteraction: true,
          data: {
            url: '/',
            taskId: reminder.id
          }
        });

        // Mark as shown
        await markReminderAsShown(reminder.id);
      }
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
}

// Get reminders from storage
async function getReminders() {
  try {
    // Try to get from clients (main app)
    const allClients = await clients.matchAll({ includeUncontrolled: true });
    
    if (allClients.length > 0) {
      // Ask main app for reminders
      const response = await new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => {
          resolve(event.data);
        };
        allClients[0].postMessage({ type: 'GET_REMINDERS' }, [channel.port2]);
        
        // Timeout after 1 second
        setTimeout(() => resolve([]), 1000);
      });
      
      return response || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
}

// Mark reminder as shown
async function markReminderAsShown(reminderId) {
  try {
    const allClients = await clients.matchAll({ includeUncontrolled: true });
    
    if (allClients.length > 0) {
      allClients[0].postMessage({ 
        type: 'REMINDER_SHOWN', 
        reminderId: reminderId 
      });
    }
  } catch (error) {
    console.error('Error marking reminder:', error);
  }
}

// Message event - receive messages from main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, time, id } = event.data;
    const now = new Date();
    const notificationTime = new Date(time);
    const delay = notificationTime.getTime() - now.getTime();

    if (delay > 0) {
      // Schedule notification
      setTimeout(() => {
        self.registration.showNotification('⏰ Nhắc nhở Task', {
          body: title,
          icon: '/image/logo.png',
          badge: '/image/logo.png',
          vibrate: [200, 100, 200],
          tag: id,
          requireInteraction: true,
          data: {
            url: '/',
            taskId: id
          }
        });
      }, delay);
    }
  }
});
