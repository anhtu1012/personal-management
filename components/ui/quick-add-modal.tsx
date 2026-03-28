"use client"

import { useState } from "react"
import { X, Clock, CalendarBlank } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "./glass-card"
import { Input } from "./input"
import { Label } from "./label"
import { useAppDispatch } from "@/store/hooks"
import { addTask } from "@/store/slices/taskSlice"
import { Task, Priority } from "@/types"
import { cn } from "@/lib/utils"
import { notifications } from "@/lib/notifications"
import { haptics } from "@/lib/haptics"

interface QuickAddModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [time, setTime] = useState("")
  const [category, setCategory] = useState<Task["category"]>("personal")
  const [priority, setPriority] = useState<Priority>("medium")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    haptics.medium()

    dispatch(addTask({
      title,
      date,
      time,
      category,
      priority,
      completed: false,
      delayed: false,
    }))

    // Schedule notification if time is set
    if (time) {
      const taskDateTime = `${date}T${time}`
      const hasPermission = await notifications.requestPermission()
      if (hasPermission) {
        notifications.scheduleTaskReminder(title, taskDateTime)
      }
    }

    haptics.success()

    // Reset form
    setTitle("")
    setDate(new Date().toISOString().split("T")[0])
    setTime("")
    setCategory("personal")
    setPriority("medium")
    
    // Close modal
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-100 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-101 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 sm:max-w-lg lg:max-w-xl"
          >
            <GlassCard variant="strong" className="p-4 sm:p-5 lg:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl lg:text-2xl">
                  Tạo Task Nhanh
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 transition-transform hover:scale-110 hover:bg-slate-200 active:scale-95 dark:hover:bg-slate-700"
                >
                  <X size={20} weight="bold" className="text-slate-700 dark:text-slate-300" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="quick-title" className="mb-1.5 block text-sm font-medium dark:text-slate-300 lg:text-base">
                    Tiêu đề
                  </Label>
                  <Input
                    id="quick-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề task..."
                    className="h-11 rounded-xl border-slate-300/60 bg-white/75 text-base dark:border-slate-600/60 dark:bg-slate-800/75 dark:text-slate-100 lg:h-12"
                    required
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="quick-date" className="mb-1.5 block text-sm font-medium dark:text-slate-300 lg:text-base">
                      Ngày
                    </Label>
                    <div className="relative">
                      <CalendarBlank
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
                      />
                      <Input
                        id="quick-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-11 rounded-xl border-slate-300/60 bg-white/75 pl-9 text-base dark:border-slate-600/60 dark:bg-slate-800/75 dark:text-slate-100 lg:h-12"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="quick-time" className="mb-1.5 block text-sm font-medium dark:text-slate-300 lg:text-base">
                      Giờ
                    </Label>
                    <div className="relative">
                      <Clock
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
                      />
                      <Input
                        id="quick-time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="h-11 rounded-xl border-slate-300/60 bg-white/75 pl-9 text-base dark:border-slate-600/60 dark:bg-slate-800/75 dark:text-slate-100 lg:h-12"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm font-medium dark:text-slate-300 lg:text-base">Ưu tiên</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "high", label: "Cao", color: "red", darkColor: "red" },
                      { value: "medium", label: "TB", color: "amber", darkColor: "amber" },
                      { value: "low", label: "Thấp", color: "blue", darkColor: "blue" },
                    ].map((pri) => (
                      <button
                        key={pri.value}
                        type="button"
                        onClick={() => {
                          haptics.selection()
                          setPriority(pri.value as Priority)
                        }}
                        className={cn(
                          "rounded-lg border px-3 py-2.5 text-xs font-medium transition-transform active:scale-95 lg:py-3 lg:text-sm",
                          priority === pri.value
                            ? pri.value === "high"
                              ? "border-red-400 bg-red-50 text-red-700 shadow-md ring-2 ring-red-300/50 dark:border-red-500/60 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-500/30"
                              : pri.value === "medium"
                              ? "border-amber-400 bg-amber-50 text-amber-700 shadow-md ring-2 ring-amber-300/50 dark:border-amber-500/60 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-500/30"
                              : "border-blue-400 bg-blue-50 text-blue-700 shadow-md ring-2 ring-blue-300/50 dark:border-blue-500/60 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-500/30"
                            : "border-slate-300/50 bg-white/70 text-slate-700 hover:bg-white dark:border-slate-600/50 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-800"
                        )}
                      >
                        {pri.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm font-medium dark:text-slate-300 lg:text-base">Danh mục</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: "work", label: "CV", color: "sky" },
                      { value: "personal", label: "CN", color: "indigo" },
                      { value: "health", label: "SK", color: "emerald" },
                      { value: "other", label: "KC", color: "slate" },
                    ].map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          haptics.selection()
                          setCategory(cat.value as Task["category"])
                        }}
                        className={cn(
                          "flex flex-col items-center gap-1.5 rounded-lg border p-2.5 transition-transform active:scale-95 lg:p-3",
                          category === cat.value
                            ? cat.value === "work"
                              ? "border-sky-400 bg-sky-50 shadow-md dark:border-sky-500/60 dark:bg-sky-900/30"
                              : cat.value === "personal"
                              ? "border-indigo-400 bg-indigo-50 shadow-md dark:border-indigo-500/60 dark:bg-indigo-900/30"
                              : cat.value === "health"
                              ? "border-emerald-400 bg-emerald-50 shadow-md dark:border-emerald-500/60 dark:bg-emerald-900/30"
                              : "border-slate-400 bg-slate-50 shadow-md dark:border-slate-500/60 dark:bg-slate-700/30"
                            : "border-slate-300/50 bg-white/70 hover:bg-white dark:border-slate-600/50 dark:bg-slate-800/70 dark:hover:bg-slate-800"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full lg:h-8 lg:w-8",
                            cat.value === "work" && "bg-sky-500 dark:bg-sky-600",
                            cat.value === "personal" && "bg-indigo-500 dark:bg-indigo-600",
                            cat.value === "health" && "bg-emerald-500 dark:bg-emerald-600",
                            cat.value === "other" && "bg-slate-500 dark:bg-slate-600"
                          )}
                        >
                          <span className="text-[10px] font-bold text-white lg:text-xs">
                            {cat.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-slate-300/60 bg-white/78 px-4 py-3 text-sm font-semibold text-slate-700 transition-transform active:scale-95 dark:border-slate-600/60 dark:bg-slate-800/78 dark:text-slate-200 lg:text-base"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl border border-emerald-400/70 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition-transform active:scale-95 dark:border-emerald-500/60 dark:bg-emerald-900/30 dark:text-emerald-300 lg:text-base"
                  >
                    Tạo Task
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
