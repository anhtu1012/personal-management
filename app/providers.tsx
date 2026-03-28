"use client"

import { Provider } from "react-redux"
import { store } from "@/store"
import { ThemeProvider } from "@/components/theme-provider"
import { TaskProvider } from "@/contexts/TaskContext"
import { useEffect } from "react"
import { initializeStore } from "@/store/initializeStore"

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeStore()
  }, [])

  return (
    <Provider store={store}>
      <ThemeProvider>
        <TaskProvider>{children}</TaskProvider>
      </ThemeProvider>
    </Provider>
  )
}
