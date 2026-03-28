import { store } from "./index"
import { setTasks } from "./slices/taskSlice"
import { setTheme } from "./slices/themeSlice"
import { Task } from "@/types"

export const initializeStore = () => {
  if (typeof window === "undefined") return

  try {
    // Load tasks from localStorage
    const tasksData = localStorage.getItem("tasks")
    if (tasksData) {
      const tasks: Task[] = JSON.parse(tasksData)
      store.dispatch(setTasks(tasks))
    }

    // Load theme from localStorage
    const themeData = localStorage.getItem("theme")
    if (themeData && (themeData === "light" || themeData === "dark")) {
      store.dispatch(setTheme(themeData))
    }
  } catch (error) {
    console.error("Failed to initialize store from localStorage:", error)
  }
}
