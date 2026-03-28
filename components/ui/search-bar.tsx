"use client"

import { useState } from "react"
import { MagnifyingGlass, X } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  onSearch,
  placeholder = "Tìm kiếm tasks...",
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <div
      className={cn(
        "relative flex items-center gap-2 rounded-xl border bg-white/75 px-3 py-2 transition-all",
        isFocused
          ? "border-slate-400 ring-2 ring-slate-300/50"
          : "border-slate-300/60",
        className
      )}
    >
      <MagnifyingGlass
        size={18}
        className={cn(
          "shrink-0 transition-colors",
          isFocused ? "text-slate-700" : "text-slate-500"
        )}
        weight="bold"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
      />
      <AnimatePresence>
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            onClick={handleClear}
            className="shrink-0 rounded-full p-1 hover:bg-slate-200"
          >
            <X size={14} weight="bold" className="text-slate-600" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
