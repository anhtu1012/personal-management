"use client"

import { SunDim, MoonStars } from "@phosphor-icons/react/dist/ssr"
import { motion } from "framer-motion"
import { useTheme } from "@/hooks/use-theme"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  const handleToggle = () => {
    // Toggle between light and dark
    if (resolvedTheme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={handleToggle}
      className="relative h-8 w-16 rounded-full border border-slate-300/60 bg-slate-200 transition-colors dark:border-slate-600/60 dark:bg-slate-700"
      aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
    >
      {/* Track background */}
      <motion.div
        animate={{
          backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
        }}
        className="absolute inset-0 rounded-full"
      />

      {/* Sliding circle */}
      <motion.div
        animate={{
          x: isDark ? 32 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md dark:bg-slate-100"
      >
        {isDark ? (
          <MoonStars size={14} weight="fill" className="text-slate-700" />
        ) : (
          <SunDim size={14} weight="fill" className="text-amber-500" />
        )}
      </motion.div>
    </button>
  )
}
