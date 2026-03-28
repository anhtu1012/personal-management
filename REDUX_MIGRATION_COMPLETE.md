# Redux Migration - Hoàn thành

## Đã hoàn thành ✅

1. **Cài đặt Redux Toolkit**
   - `@reduxjs/toolkit`
   - `react-redux`

2. **Tạo Redux Store Structure**
   - `store/index.ts` - Store configuration
   - `store/hooks.ts` - Typed hooks (useAppDispatch, useAppSelector)
   - `store/slices/taskSlice.ts` - Task state management
   - `store/slices/themeSlice.ts` - Theme state management
   - `store/middleware/localStorageMiddleware.ts` - Auto-sync localStorage
   - `store/initializeStore.ts` - Load data from localStorage

3. **Tích hợp vào App**
   - Tạo `app/providers.tsx` với Redux Provider
   - Cập nhật `app/layout.tsx` để sử dụng Providers
   - Xóa `contexts/TaskContext.tsx` (không cần nữa)

4. **Cập nhật Components**
   - ✅ `app/page.tsx` - Dùng Redux hooks
   - ✅ `components/ui/quick-add-modal.tsx` - Dùng Redux dispatch
   - ✅ `components/ui/navigation.tsx` - Xóa callback không cần thiết
   - ✅ `app/calendar/create/page.tsx` - Dùng Redux dispatch

5. **Middleware Auto-sync**
   - Tasks tự động lưu vào localStorage khi thay đổi
   - Theme tự động lưu và update document class
   - Không cần gọi localStorage.setItem() thủ công

## Cần cập nhật (Các files còn lại)

Các files sau vẫn đang dùng `useTasks()` hook, cần chuyển sang Redux:

### 1. app/templates/page.tsx
```typescript
// Thay đổi:
import { useTasks } from "@/hooks/use-tasks"
const { addTask } = useTasks()

// Thành:
import { useAppDispatch } from "@/store/hooks"
import { addTask } from "@/store/slices/taskSlice"
const dispatch = useAppDispatch()

// Khi dùng:
dispatch(addTask({ ...taskData }))
```

### 2. app/statistics/page.tsx
```typescript
// Thay đổi:
import { useTasks } from "@/hooks/use-tasks"
const { tasks } = useTasks()

// Thành:
import { useAppSelector } from "@/store/hooks"
const tasks = useAppSelector((state) => state.tasks.tasks)
```

### 3. app/settings/page.tsx
```typescript
// Thay đổi:
import { useTasks } from "@/hooks/use-tasks"
const { tasks } = useTasks()

// Thành:
import { useAppSelector } from "@/store/hooks"
const tasks = useAppSelector((state) => state.tasks.tasks)
```

### 4. app/profile/page.tsx
```typescript
// Thay đổi:
import { useTasks } from "@/hooks/use-tasks"
const { tasks, completeTask, deleteTask } = useTasks()

// Thành:
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { completeTask, deleteTask } from "@/store/slices/taskSlice"
const dispatch = useAppDispatch()
const tasks = useAppSelector((state) => state.tasks.tasks)

// Khi dùng:
dispatch(completeTask(taskId))
dispatch(deleteTask(taskId))
```

### 5. app/calendar/page.tsx
```typescript
// Thay đổi:
import { useTasks } from "@/hooks/use-tasks"
const { tasks, completeTask, deleteTask } = useTasks()

// Thành:
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { completeTask, deleteTask } from "@/store/slices/taskSlice"
const dispatch = useAppDispatch()
const tasks = useAppSelector((state) => state.tasks.tasks)

// Khi dùng:
onCompleteTask={(id) => dispatch(completeTask(id))}
onDeleteTask={(id) => dispatch(deleteTask(id))}
```

### 6. app/calendar/[date]/page.tsx
```typescript
// Tương tự app/calendar/page.tsx
```

## Lợi ích của Redux

1. **Centralized State**: Tất cả state ở một nơi, dễ quản lý
2. **Auto-sync**: Tự động sync với localStorage qua middleware
3. **Type Safety**: TypeScript support đầy đủ
4. **DevTools**: Redux DevTools để debug
5. **No Prop Drilling**: Không cần truyền props qua nhiều cấp
6. **Consistent Updates**: Tất cả components tự động update khi state thay đổi

## Cách sử dụng Redux

### Đọc state
```typescript
import { useAppSelector } from "@/store/hooks"

const tasks = useAppSelector((state) => state.tasks.tasks)
const loading = useAppSelector((state) => state.tasks.loading)
const theme = useAppSelector((state) => state.theme.theme)
```

### Dispatch actions
```typescript
import { useAppDispatch } from "@/store/hooks"
import { addTask, deleteTask, completeTask } from "@/store/slices/taskSlice"

const dispatch = useAppDispatch()

// Add task
dispatch(addTask({
  title: "New Task",
  date: "2024-01-01",
  completed: false,
  // ... other fields
}))

// Complete task
dispatch(completeTask("task-id"))

// Delete task
dispatch(deleteTask("task-id"))
```

## Next Steps

1. Cập nhật 6 files còn lại theo pattern trên
2. Test toàn bộ app để đảm bảo data sync đúng
3. Xóa `hooks/use-tasks.ts` sau khi migrate xong
4. Build và deploy

## Testing Checklist

- [ ] Thêm task mới từ quick add modal
- [ ] Thêm task từ calendar create page
- [ ] Complete task
- [ ] Delete task
- [ ] Data persist sau khi refresh
- [ ] Theme persist sau khi refresh
- [ ] Tất cả pages hiển thị data đúng
- [ ] Notifications vẫn hoạt động
- [ ] Export/Import data vẫn hoạt động
