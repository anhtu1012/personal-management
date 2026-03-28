"use client"

import { SunDim, MoonStars } from "@phosphor-icons/react/dist/ssr"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { toggleTheme } from "@/store/slices/themeSlice"
import { useEffect } from "react"

export function ThemeToggle() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.theme.theme)

  // Apply theme to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  const handleToggle = () => {
    dispatch(toggleTheme())
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={handleToggle}
      className="relative h-8 w-16 rounded-full border border-slate-300/60 bg-slate-200 transition-all duration-300 dark:border-slate-600/60 dark:bg-slate-700"
      aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
    >
      {/* Sliding circle with CSS transition */}
      <div
        className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ease-out dark:bg-slate-100"
        style={{ transform: isDark ? "translateX(32px)" : "translateX(0)" }}
      >
        {isDark ? (
          <MoonStars size={14} weight="fill" className="text-slate-700" />
        ) : (
          <SunDim size={14} weight="fill" className="text-amber-500" />
        )}
      </div>
    </button>
  )
}
