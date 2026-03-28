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
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload)
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = action.payload
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload)
    },
    completeTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload)
      if (task) {
        task.completed = true
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
  setLoading,
  setError,
} = taskSlice.actions

export default taskSlice.reducer
