"use client"

import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { persistStore } from "redux-persist"
import { store } from "@/store"
import { ThemeProvider } from "@/components/theme-provider"
import { useEffect, useState } from "react"

const persistor = persistStore(store)

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Apply theme immediately on mount before hydration
    const state = store.getState()
    if (state.theme.theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    setMounted(true)
  }, [])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          {mounted ? children : null}
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}
