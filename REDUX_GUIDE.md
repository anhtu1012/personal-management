# Redux Toolkit Setup Guide

## Cấu trúc Redux Store

```
store/
├── index.ts                    # Store configuration
├── hooks.ts                    # Typed hooks (useAppDispatch, useAppSelector)
├── initializeStore.ts          # Initialize store from localStorage
├── middleware/
│   └── localStorageMiddleware.ts  # Auto-sync to localStorage
└── slices/
    ├── taskSlice.ts           # Task state management
    └── themeSlice.ts          # Theme state management
```

## Cách sử dụng

### 1. Import hooks

```typescript
import { useAppDispatch, useAppSelector } from "@/store/hooks"
```

### 2. Sử dụng trong component

#### Đọc state từ Redux

```typescript
const tasks = useAppSelector((state) => state.tasks.tasks)
const loading = useAppSelector((state) => state.tasks.loading)
const theme = useAppSelector((state) => state.theme.theme)
```

#### Dispatch actions

```typescript
import { addTask, deleteTask, completeTask, updateTask } from "@/store/slices/taskSlice"
import { setTheme, toggleTheme } from "@/store/slices/themeSlice"

const dispatch = useAppDispatch()

// Add task
dispatch(addTask({
  id: "123",
  title: "New Task",
  date: "2024-01-01",
  completed: false,
  // ... other fields
}))

// Complete task
dispatch(completeTask("task-id"))

// Delete task
dispatch(deleteTask("task-id"))

// Update task
dispatch(updateTask({
  id: "123",
  title: "Updated Task",
  // ... other fields
}))

// Toggle theme
dispatch(toggleTheme())

// Set specific theme
dispatch(setTheme("dark"))
```

### 3. Ví dụ component hoàn chỉnh

```typescript
"use client"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addTask, deleteTask } from "@/store/slices/taskSlice"

export default function TaskList() {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector((state) => state.tasks.tasks)
  const loading = useAppSelector((state) => state.tasks.loading)

  const handleAddTask = () => {
    dispatch(addTask({
      id: Date.now().toString(),
      title: "New Task",
      date: new Date().toISOString().split("T")[0],
      completed: false,
    }))
  }

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id))
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <button onClick={handleAddTask}>Add Task</button>
      {tasks.map((task) => (
        <div key={task.id}>
          <span>{task.title}</span>
          <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
```

## Task Actions

### setTasks(tasks: Task[])
Set toàn bộ danh sách tasks (dùng khi load từ localStorage)

### addTask(task: Task)
Thêm task mới

### updateTask(task: Task)
Cập nhật task (thay thế toàn bộ)

### deleteTask(id: string)
Xóa task theo ID

### completeTask(id: string)
Đánh dấu task hoàn thành

### setLoading(loading: boolean)
Set trạng thái loading

### setError(error: string | null)
Set error message

## Theme Actions

### setTheme(theme: "light" | "dark")
Set theme cụ thể

### toggleTheme()
Chuyển đổi giữa light và dark mode

## Auto-sync với localStorage

Redux store tự động sync với localStorage:
- Tasks được lưu vào `localStorage.getItem("tasks")`
- Theme được lưu vào `localStorage.getItem("theme")`
- Không cần gọi localStorage.setItem() thủ công

## Migration từ hooks/use-tasks.ts

### Trước (use-tasks.ts):
```typescript
const { tasks, addTask, deleteTask } = useTasks()
```

### Sau (Redux):
```typescript
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addTask, deleteTask } from "@/store/slices/taskSlice"

const dispatch = useAppDispatch()
const tasks = useAppSelector((state) => state.tasks.tasks)

// Sử dụng
dispatch(addTask(newTask))
dispatch(deleteTask(taskId))
```

## Lợi ích của Redux Toolkit

1. **Centralized State**: Tất cả state ở một nơi
2. **Type Safety**: TypeScript support đầy đủ
3. **DevTools**: Redux DevTools để debug
4. **Auto-sync**: Tự động sync với localStorage
5. **Immutable Updates**: Redux Toolkit dùng Immer để update state an toàn
6. **Middleware**: Dễ dàng thêm middleware (logging, analytics, etc.)

## Next Steps

Để migrate hoàn toàn sang Redux:
1. Thay thế `useTasks()` bằng Redux hooks trong các component
2. Thay thế `useTheme()` bằng Redux theme slice
3. Xóa `hooks/use-tasks.ts` và `hooks/use-theme.ts` sau khi migrate xong
