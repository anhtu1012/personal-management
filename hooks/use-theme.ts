"use client"

import { useState, useEffect } from "react"

type Theme = "light" | "dark" | "auto"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light"
    const saved = localStorage.getItem("theme") as Theme
    return saved || "light"
  })

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const root = document.documentElement

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add("dark")
        setResolvedTheme("dark")
      } else {
        root.classList.remove("dark")
        setResolvedTheme("light")
      }
    }

    if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      applyTheme(mediaQuery.matches)

      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches)
      mediaQuery.addEventListener("change", listener)
      return () => mediaQuery.removeEventListener("change", listener)
    } else {
      applyTheme(theme === "dark")
    }
  }, [theme])

  const setAndSaveTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return {
    theme,
    resolvedTheme,
    setTheme: setAndSaveTheme,
  }
}
