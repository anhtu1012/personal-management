import { Middleware } from "@reduxjs/toolkit"
import { RootState } from "../index"

export const localStorageMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action)

    // Sync tasks to localStorage after any task action
    if (action.type?.startsWith("tasks/")) {
      const state = store.getState()
      try {
        localStorage.setItem("tasks", JSON.stringify(state.tasks.tasks))
      } catch (error) {
        console.error("Failed to save tasks to localStorage:", error)
      }
    }

    // Sync theme to localStorage after theme changes
    if (action.type?.startsWith("theme/")) {
      const state = store.getState()
      try {
        localStorage.setItem("theme", state.theme.theme)
        // Update document class for theme
        if (typeof document !== "undefined") {
          if (state.theme.theme === "dark") {
            document.documentElement.classList.add("dark")
          } else {
            document.documentElement.classList.remove("dark")
          }
        }
      } catch (error) {
        console.error("Failed to save theme to localStorage:", error)
      }
    }

    return result
  }
