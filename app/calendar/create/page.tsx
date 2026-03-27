"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  AlignLeft,
  ArrowLeft,
  CalendarBlank,
  Clock,
  TextAa,
} from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/ui/navigation"
import { Textarea } from "@/components/ui/textarea"
import { useTasks } from "@/hooks/use-tasks"
import { Task } from "@/types"
import { cn } from "@/lib/utils"

function CreateTaskForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addTask } = useTasks()

  const initialDate =
    searchParams.get("date") || new Date().toISOString().split("T")[0]

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(initialDate)
  const [time, setTime] = useState("")
  const [category, setCategory] = useState<Task["category"]>("personal")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    addTask({
      title,
      description,
      date,
      time,
      category,
      completed: false,
      delayed: false,
    })

    router.push("/calendar")
  }

  return (
    <div className="liquid-container w-full max-w-full space-y-3 overflow-hidden sm:space-y-5">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 sm:gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => router.back()}
          className="liquid-panel rounded-xl p-2 sm:p-2.5"
        >
          <ArrowLeft size={18} weight="bold" className="text-slate-700 sm:hidden" />
          <ArrowLeft size={20} weight="bold" className="hidden text-slate-700 sm:block" />
        </motion.button>
        <h1 className="liquid-title text-xl font-bold tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
          Tạo Task Mới
        </h1>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard variant="strong" className="p-3 sm:p-4 md:p-6" glow="none">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <Label
                htmlFor="title"
                className="mb-1.5 flex items-center gap-2 text-xs font-semibold sm:mb-2 sm:text-sm md:text-base"
              >
                <span className="liquid-panel rounded-lg p-1 sm:p-1.5">
                  <TextAa size={14} className="text-slate-700 sm:hidden" />
                  <TextAa size={16} className="hidden text-slate-700 sm:block" />
                </span>
                Tiêu đề
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề task..."
                className="h-10 rounded-xl border-slate-300/60 bg-white/75 text-sm sm:h-11"
                required
                autoFocus
              />
            </div>

            <div>
              <Label
                htmlFor="description"
                className="mb-1.5 flex items-center gap-2 text-xs font-semibold sm:mb-2 sm:text-sm md:text-base"
              >
                <span className="liquid-panel rounded-lg p-1 sm:p-1.5">
                  <AlignLeft size={14} className="text-slate-700 sm:hidden" />
                  <AlignLeft size={16} className="hidden text-slate-700 sm:block" />
                </span>
                Mô tả
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết về task..."
                rows={4}
                className="min-h-24 rounded-xl border-slate-300/60 bg-white/75 text-sm sm:min-h-30 sm:rows-5"
              />
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
              <div>
                <Label
                  htmlFor="date"
                  className="mb-1.5 flex items-center gap-2 text-xs font-semibold sm:mb-2 sm:text-sm md:text-base"
                >
                  <span className="liquid-panel rounded-lg p-1 sm:p-1.5">
                    <CalendarBlank size={14} className="text-slate-700 sm:hidden" />
                    <CalendarBlank size={16} className="hidden text-slate-700 sm:block" />
                  </span>
                  Ngày
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-10 rounded-xl border-slate-300/60 bg-white/75 text-sm sm:h-11"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="time"
                  className="mb-1.5 flex items-center gap-2 text-xs font-semibold sm:mb-2 sm:text-sm md:text-base"
                >
                  <span className="liquid-panel rounded-lg p-1 sm:p-1.5">
                    <Clock size={14} className="text-slate-700 sm:hidden" />
                    <Clock size={16} className="hidden text-slate-700 sm:block" />
                  </span>
                  Giờ
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-10 rounded-xl border-slate-300/60 bg-white/75 text-sm sm:h-11"
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-xs font-semibold sm:text-sm md:text-base">
                Danh mục & Màu sắc
              </Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCategory("work")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
                    category === "work"
                      ? "border-sky-400 bg-sky-50 shadow-md ring-2 ring-sky-300/50"
                      : "border-slate-300/50 bg-white/70 hover:border-sky-300 hover:bg-sky-50/50"
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500">
                    <span className="text-xs font-bold text-white">CV</span>
                  </div>
                  <span className={cn(
                    "text-xs font-semibold",
                    category === "work" ? "text-sky-700" : "text-slate-700"
                  )}>
                    Công việc
                  </span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCategory("personal")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
                    category === "personal"
                      ? "border-indigo-400 bg-indigo-50 shadow-md ring-2 ring-indigo-300/50"
                      : "border-slate-300/50 bg-white/70 hover:border-indigo-300 hover:bg-indigo-50/50"
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
                    <span className="text-xs font-bold text-white">CN</span>
                  </div>
                  <span className={cn(
                    "text-xs font-semibold",
                    category === "personal" ? "text-indigo-700" : "text-slate-700"
                  )}>
                    Cá nhân
                  </span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCategory("health")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
                    category === "health"
                      ? "border-emerald-400 bg-emerald-50 shadow-md ring-2 ring-emerald-300/50"
                      : "border-slate-300/50 bg-white/70 hover:border-emerald-300 hover:bg-emerald-50/50"
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
                    <span className="text-xs font-bold text-white">SK</span>
                  </div>
                  <span className={cn(
                    "text-xs font-semibold",
                    category === "health" ? "text-emerald-700" : "text-slate-700"
                  )}>
                    Sức khỏe
                  </span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCategory("other")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
                    category === "other"
                      ? "border-slate-400 bg-slate-50 shadow-md ring-2 ring-slate-300/50"
                      : "border-slate-300/50 bg-white/70 hover:border-slate-300 hover:bg-slate-50/50"
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-500">
                    <span className="text-xs font-bold text-white">KC</span>
                  </div>
                  <span className={cn(
                    "text-xs font-semibold",
                    category === "other" ? "text-slate-700" : "text-slate-700"
                  )}>
                    Khác
                  </span>
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1 sm:gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-xl border border-slate-300/60 bg-white/78 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white sm:px-4 sm:py-2.5"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-xl border border-slate-300/70 bg-white/92 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white sm:px-4 sm:py-2.5"
              >
                Tạo Task
              </button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  )
}

export default function CreateTaskPage() {
  return (
    <div className="liquid-page">
      <Suspense
        fallback={
          <div className="liquid-container">
            <div className="animate-pulse space-y-3">
              <div className="h-12 rounded-2xl bg-white/70" />
              <div className="h-105 rounded-3xl bg-white/70" />
            </div>
          </div>
        }
      >
        <CreateTaskForm />
      </Suspense>

      <Navigation />
    </div>
  )
}
