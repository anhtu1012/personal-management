"use client"

import { Sun, Moon, Monitor } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { value: "light" as const, label: "Sáng", icon: Sun },
    { value: "dark" as const, label: "Tối", icon: Moon },
    { value: "auto" as const, label: "Auto", icon: Monitor },
  ]

  const currentTheme = themes.find((t) => t.value === theme) || themes[0]
  const Icon = currentTheme.icon

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="liquid-panel flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200"
      >
        <Icon size={18} weight="bold" />
        <span className="hidden sm:inline">{currentTheme.label}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-60"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full z-70 mt-2 w-40 overflow-hidden rounded-xl border border-slate-300/60 bg-white/90 shadow-lg backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/90"
            >
              {themes.map((t) => {
                const ThemeIcon = t.icon
                return (
                  <button
                    key={t.value}
                    onClick={() => {
                      setTheme(t.value)
                      setIsOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
                      theme === t.value
                        ? "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-slate-100"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                    )}
                  >
                    <ThemeIcon size={18} weight={theme === t.value ? "fill" : "regular"} />
                    <span>{t.label}</span>
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
