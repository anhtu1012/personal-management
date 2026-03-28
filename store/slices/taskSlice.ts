import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Task } from "@/types"

interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
}

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload
      state.loading = false
    },
    addTask: (state, action: PayloadAction<Omit<Task, "id">>) => {
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      state.tasks.push(newTask)
    },
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload.updates }
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload)
    },
    completeTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload)
      if (task) {
        task.completed = true
        task.delayed = false
        task.completedAt = new Date().toISOString()
      }
    },
    delayTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload)
      if (task) {
        const tomorrow = new Date(task.date)
        tomorrow.setDate(tomorrow.getDate() + 1)
        task.date = tomorrow.toISOString().split("T")[0]
        task.delayed = true
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  completeTask,
  delayTask,
  setLoading,
  setError,
} = taskSlice.actions

export default taskSlice.reducer
