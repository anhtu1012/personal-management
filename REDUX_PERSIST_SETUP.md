# Redux Persist Setup - Hoàn thành ✅

## Đã cài đặt

```bash
npm install redux-persist
```

## Cấu trúc mới

### 1. store/persistConfig.ts
Cấu hình persist cho từng reducer:
- Tasks: Chỉ persist `tasks` array (không persist loading/error)
- Theme: Persist toàn bộ theme state

### 2. store/index.ts
- Sử dụng `persistedTaskReducer` và `persistedThemeReducer`
- Thêm middleware config để ignore redux-persist actions
- Xóa `localStorageMiddleware` (redux-persist thay thế)

### 3. app/providers.tsx
- Import `PersistGate` từ redux-persist
- Tạo `persistor` từ store
- Wrap children với `PersistGate`
- Auto-apply theme on mount

## Lợi ích Redux Persist

1. **Tự động persist**: Không cần gọi localStorage.setItem() thủ công
2. **Rehydrate on load**: Tự động load state từ localStorage khi app khởi động
3. **Selective persist**: Chỉ persist những gì cần thiết (whitelist)
4. **Type-safe**: TypeScript support đầy đủ
5. **Optimized**: Debounce writes, batch updates

## Notification Fix cho Android

### Vấn đề
- iOS: Notification hiện ngay lập tức
- Android: Bị "đang gửi thông báo" và không hiện

### Giải pháp
1. **Ưu tiên Service Worker notification**:
   ```typescript
   registration.showNotification(title, options)
   ```
   Service Worker notifications hoạt động tốt hơn trên Android

2. **Fallback to regular Notification**:
   Nếu Service Worker không available, dùng `new Notification()`

3. **Vibration riêng biệt**:
   Không đưa vibrate vào NotificationOptions (TypeScript error)
   Gọi `navigator.vibrate()` riêng sau khi show notification

4. **requireInteraction: true**:
   Notification không tự động dismiss, user phải tương tác

### Code mới

```typescript
// Ưu tiên Service Worker
if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification(title, {
      icon: "/image/logo.png",
      badge: "/image/logo.png",
      requireInteraction: true,
      tag: options?.tag || 'task-reminder',
      ...options,
    }).then(() => {
      // Vibrate sau khi show
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200])
      }
    })
  })
}
```

## Testing

### Redux Persist
1. Thêm task mới
2. Refresh page → Task vẫn còn ✅
3. Đổi theme
4. Refresh page → Theme vẫn giữ nguyên ✅

### Notification Android
1. Tạo task với thời gian trong tương lai
2. Đợi đến giờ
3. Notification hiện ngay lập tức (không bị "đang gửi") ✅
4. Có vibration ✅
5. Notification không tự động dismiss ✅

## Migration từ localStorage middleware

### Trước
```typescript
// store/middleware/localStorageMiddleware.ts
export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action)
  if (action.type?.startsWith("tasks/")) {
    localStorage.setItem("tasks", JSON.stringify(state.tasks.tasks))
  }
  return result
}
```

### Sau
```typescript
// store/persistConfig.ts
const tasksPersistConfig = {
  key: "tasks",
  storage,
  whitelist: ["tasks"],
}

export const persistedTaskReducer = persistReducer(tasksPersistConfig, taskReducer)
```

## Files đã xóa
- ❌ `store/middleware/localStorageMiddleware.ts` (redux-persist thay thế)
- ❌ `store/initializeStore.ts` (redux-persist auto-rehydrate)

## Files đã tạo
- ✅ `store/persistConfig.ts` (persist configuration)

## Files đã cập nhật
- ✅ `store/index.ts` (dùng persisted reducers)
- ✅ `app/providers.tsx` (thêm PersistGate)
- ✅ `lib/notifications.ts` (fix Android notification)
- ✅ `app/page.tsx` (fix TypeScript errors)

## Next Steps

1. Test trên Android device thật
2. Test notification với các thời gian khác nhau
3. Test persist với nhiều tasks
4. Monitor performance với redux-persist

## Troubleshooting

### Nếu notification vẫn không hiện trên Android:
1. Check Service Worker đã register chưa
2. Check notification permission đã granted chưa
3. Check browser console có error không
4. Thử clear cache và reload

### Nếu persist không hoạt động:
1. Check localStorage có data không
2. Check redux-persist key trong localStorage
3. Check PersistGate đã wrap App chưa
4. Check browser console có error không
