"use client"

import { useState } from "react"
import { X, Clock, CalendarBlank } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "./glass-card"
import { Input } from "./input"
import { Label } from "./label"
import { useTasks } from "@/hooks/use-tasks"
import { Task, Priority } from "@/types"
import { cn } from "@/lib/utils"
import { notifications } from "@/lib/notifications"

interface QuickAddModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  const { addTask } = useTasks()
  const [title, setTitle] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [time, setTime] = useState("")
  const [category, setCategory] = useState<Task["category"]>("personal")
  const [priority, setPriority] = useState<Priority>("medium")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newTask = addTask({
      title,
      date,
      time,
      category,
      priority,
      completed: false,
      delayed: false,
    })

    // Schedule notification if time is set
    if (time && newTask) {
      const taskDateTime = `${date}T${time}`
      const hasPermission = await notifications.requestPermission()
      if (hasPermission) {
        notifications.scheduleTaskReminder(title, taskDateTime)
      }
    }

    // Reset form
    setTitle("")
    setDate(new Date().toISOString().split("T")[0])
    setTime("")
    setCategory("personal")
    setPriority("medium")
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
            className="fixed inset-0 z-100 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 z-101 mx-auto max-w-md -translate-y-1/2 sm:inset-x-auto"
          >
            <GlassCard variant="strong" className="p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                  Tạo Task Nhanh
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 transition-colors hover:bg-slate-200"
                >
                  <X size={20} weight="bold" className="text-slate-700" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Label htmlFor="quick-title" className="mb-1.5 block text-sm font-medium">
                    Tiêu đề
                  </Label>
                  <Input
                    id="quick-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề task..."
                    className="h-10 rounded-xl border-slate-300/60 bg-white/75"
                    required
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="quick-date" className="mb-1.5 block text-sm font-medium">
                      Ngày
                    </Label>
                    <div className="relative">
                      <CalendarBlank
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                      <Input
                        id="quick-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-10 rounded-xl border-slate-300/60 bg-white/75 pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="quick-time" className="mb-1.5 block text-sm font-medium">
                      Giờ
                    </Label>
                    <div className="relative">
                      <Clock
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                      <Input
                        id="quick-time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="h-10 rounded-xl border-slate-300/60 bg-white/75 pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm font-medium">Ưu tiên</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "high", label: "Cao", color: "red" },
                      { value: "medium", label: "TB", color: "amber" },
                      { value: "low", label: "Thấp", color: "blue" },
                    ].map((pri) => (
                      <button
                        key={pri.value}
                        type="button"
                        onClick={() => setPriority(pri.value as Priority)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                          priority === pri.value
                            ? `border-${pri.color}-400 bg-${pri.color}-50 shadow-md ring-2 ring-${pri.color}-300/50`
                            : "border-slate-300/50 bg-white/70 hover:bg-white"
                        )}
                      >
                        {pri.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm font-medium">Danh mục</Label>
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
                        onClick={() => setCategory(cat.value as Task["category"])}
                        className={cn(
                          "flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-all",
                          category === cat.value
                            ? `border-${cat.color}-400 bg-${cat.color}-50 shadow-md`
                            : "border-slate-300/50 bg-white/70 hover:bg-white"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full",
                            `bg-${cat.color}-500`
                          )}
                        >
                          <span className="text-[9px] font-bold text-white">
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
                    className="rounded-xl border border-slate-300/60 bg-white/78 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl border border-emerald-400/70 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
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
