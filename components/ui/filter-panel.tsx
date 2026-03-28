"use client"

import { useState } from "react"
import { Funnel, X } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"
import { Priority } from "@/types"

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  category?: string
  priority?: Priority
  completed?: boolean
  tags?: string[]
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({})

  const updateFilter = (key: keyof FilterState, value: string | Priority | boolean | undefined) => {
    const newFilters = { ...filters, [key]: value }
    if (value === undefined || value === null) {
      delete newFilters[key]
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    onFilterChange({})
  }

  const activeFilterCount = Object.keys(filters).length

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "liquid-panel relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100",
          activeFilterCount > 0 && "ring-2 ring-slate-400 dark:ring-slate-500"
        )}
      >
        <Funnel size={18} weight="bold" />
        <span>Lọc</span>
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white dark:bg-slate-300 dark:text-slate-900">
            {activeFilterCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-60 bg-slate-900/25 backdrop-blur-[1px] dark:bg-black/40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full z-70 mt-2 w-72"
            >
              <GlassCard variant="strong" className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Bộ lọc</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-1 hover:bg-slate-200"
                  >
                    <X size={18} weight="bold" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                      Danh mục
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["work", "personal", "health", "other"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() =>
                            updateFilter(
                              "category",
                              filters.category === cat ? undefined : cat
                            )
                          }
                          className={cn(
                            "rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                            filters.category === cat
                              ? "border-slate-400 bg-white shadow-md"
                              : "border-slate-300/50 bg-white/70 hover:bg-white"
                          )}
                        >
                          {cat === "work" && "Công việc"}
                          {cat === "personal" && "Cá nhân"}
                          {cat === "health" && "Sức khỏe"}
                          {cat === "other" && "Khác"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                      Ưu tiên
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["high", "medium", "low"] as Priority[]).map((pri) => (
                        <button
                          key={pri}
                          onClick={() =>
                            updateFilter(
                              "priority",
                              filters.priority === pri ? undefined : pri
                            )
                          }
                          className={cn(
                            "rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                            filters.priority === pri
                              ? "border-slate-400 bg-white shadow-md"
                              : "border-slate-300/50 bg-white/70 hover:bg-white"
                          )}
                        >
                          {pri === "high" && "Cao"}
                          {pri === "medium" && "TB"}
                          {pri === "low" && "Thấp"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                      Trạng thái
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() =>
                          updateFilter(
                            "completed",
                            filters.completed === false ? undefined : false
                          )
                        }
                        className={cn(
                          "rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                          filters.completed === false
                            ? "border-slate-400 bg-white shadow-md"
                            : "border-slate-300/50 bg-white/70 hover:bg-white"
                        )}
                      >
                        Chưa xong
                      </button>
                      <button
                        onClick={() =>
                          updateFilter(
                            "completed",
                            filters.completed === true ? undefined : true
                          )
                        }
                        className={cn(
                          "rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                          filters.completed === true
                            ? "border-slate-400 bg-white shadow-md"
                            : "border-slate-300/50 bg-white/70 hover:bg-white"
                        )}
                      >
                        Hoàn thành
                      </button>
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="w-full rounded-lg border border-slate-300/60 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
