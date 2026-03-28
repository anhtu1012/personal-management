"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarBlank, Plus } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/ui/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { ExpandableCalendar } from "@/components/ui/expandable-calendar"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { completeTask, deleteTask } from "@/store/slices/taskSlice"

export default function CalendarPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const tasks = useAppSelector((state) => state.tasks.tasks)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleCompleteTask = (id: string) => {
    dispatch(completeTask(id))
  }

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id))
  }

  return (
    <div className="liquid-page">
      <span className="liquid-orb liquid-orb-indigo -top-16 -left-8 h-40 w-40 sm:h-52 sm:w-52" />
      <span className="liquid-orb liquid-orb-sky top-30 -right-10 h-44 w-44 sm:h-56 sm:w-56" />

      <div className="liquid-container relative z-10 w-full max-w-full space-y-3 overflow-hidden sm:space-y-5">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="liquid-panel flex size-8 items-center justify-center rounded-xl sm:size-10 sm:rounded-2xl">
              <CalendarBlank
                size={18}
                weight="fill"
                className="text-slate-700 dark:text-slate-300 sm:hidden"
              />
              <CalendarBlank
                size={22}
                weight="fill"
                className="hidden text-slate-700 dark:text-slate-300 sm:block"
              />
            </div>
            <h1 className="liquid-title text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Lịch
            </h1>
          </div>

          <button
            onClick={() => router.push("/calendar/create")}
            className="liquid-panel flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 transition-transform duration-200 active:scale-95 dark:text-slate-100 sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-2 sm:text-sm"
          >
            <Plus size={16} weight="bold" className="sm:hidden" />
            <Plus size={18} weight="bold" className="hidden sm:block" />
            <span className="hidden sm:inline">Tạo task</span>
            <span className="sm:hidden">Tạo</span>
          </button>
        </motion.header>

        <ExpandableCalendar
          selectedDate={selectedDate}
          onSelectDate={handleDateSelect}
          tasks={tasks}
          onCompleteTask={handleCompleteTask}
          onDeleteTask={handleDeleteTask}
        />

        <GlassCard className="p-3 sm:p-4" glow="none">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 dark:text-slate-300 sm:gap-3 sm:text-sm">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Danh mục:</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-500" /> Công việc
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-500" /> Cá nhân
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Sức khỏe
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-500" /> Khác
            </span>
          </div>
        </GlassCard>
      </div>

      <Navigation />
    </div>
  )
}
