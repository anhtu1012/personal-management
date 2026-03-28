"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChartBar, TrendUp, Fire, Target } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subDays } from "date-fns"
import { vi } from "date-fns/locale"
import { useTasks } from "@/hooks/use-tasks"
import { GlassCard } from "@/components/ui/glass-card"
import { Navigation } from "@/components/ui/navigation"
import { cn } from "@/lib/utils"

export default function StatisticsPage() {
  const router = useRouter()
  const { tasks } = useTasks()

  const stats = useMemo(() => {
    const now = new Date()
    const last7Days = eachDayOfInterval({
      start: subDays(now, 6),
      end: now,
    })

    const completedByDay = last7Days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd")
      const count = tasks.filter(
        (t) => t.date === dateStr && t.completed
      ).length
      return { date: format(day, "EEE", { locale: vi }), count }
    })

    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t) => t.completed).length
    const pendingTasks = totalTasks - completedTasks
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const byCategory = {
      work: tasks.filter((t) => t.category === "work").length,
      personal: tasks.filter((t) => t.category === "personal").length,
      health: tasks.filter((t) => t.category === "health").length,
      other: tasks.filter((t) => t.category === "other").length,
    }

    const byPriority = {
      high: tasks.filter((t) => t.priority === "high").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      low: tasks.filter((t) => t.priority === "low").length,
    }

    const currentStreak = calculateStreak(tasks)

    return {
      completedByDay,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      byCategory,
      byPriority,
      currentStreak,
    }
  }, [tasks])

  const maxCount = Math.max(...stats.completedByDay.map((d) => d.count), 1)

  return (
    <div className="liquid-page">
      <span className="liquid-orb liquid-orb-indigo -top-16 -left-8 h-40 w-40 sm:h-52 sm:w-52" />
      <span className="liquid-orb liquid-orb-emerald top-30 -right-10 h-44 w-44 sm:h-56 sm:w-56" />

      <div className="liquid-container relative z-10 w-full max-w-full space-y-3 overflow-hidden sm:space-y-5">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          <button
            onClick={() => router.back()}
            className="liquid-panel rounded-xl p-2 transition-transform duration-200 active:scale-95 sm:p-2.5"
          >
            <ArrowLeft size={18} weight="bold" className="text-slate-700 dark:text-slate-300 sm:hidden" />
            <ArrowLeft size={20} weight="bold" className="hidden text-slate-700 dark:text-slate-300 sm:block" />
          </button>
          <div className="flex items-center gap-2">
            <div className="liquid-panel flex size-8 items-center justify-center rounded-xl sm:size-10 sm:rounded-2xl">
              <ChartBar size={18} weight="fill" className="text-slate-700 dark:text-slate-300 sm:hidden" />
              <ChartBar size={22} weight="fill" className="hidden text-slate-700 dark:text-slate-300 sm:block" />
            </div>
            <h1 className="liquid-title text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
              Thống kê
            </h1>
          </div>
        </motion.header>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
          <GlassCard className="p-3 sm:p-4" glow="none">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <Target size={14} weight="bold" />
              <span>Tổng</span>
            </div>
            <p className="text-2xl font-bold dark:text-slate-100 sm:text-3xl">{stats.totalTasks}</p>
          </GlassCard>

          <GlassCard className="p-3 sm:p-4" glow="none">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <TrendUp size={14} weight="bold" />
              <span>Hoàn thành</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 sm:text-3xl">
              {stats.completedTasks}
            </p>
          </GlassCard>

          <GlassCard className="p-3 sm:p-4" glow="none">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <Fire size={14} weight="fill" />
              <span>Streak</span>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 sm:text-3xl">
              {stats.currentStreak}
            </p>
          </GlassCard>

          <GlassCard className="p-3 sm:p-4" glow="none">
            <div className="mb-1 text-xs text-slate-600 dark:text-slate-400">Tỷ lệ</div>
            <p className="text-2xl font-bold text-sky-600 dark:text-sky-400 sm:text-3xl">
              {stats.completionRate}%
            </p>
          </GlassCard>
        </div>

        <GlassCard variant="strong" className="p-4 sm:p-5" glow="none">
          <h3 className="mb-3 text-sm font-semibold dark:text-slate-100 sm:text-base">
            Hoàn thành 7 ngày qua
          </h3>
          <div className="flex items-end justify-between gap-2">
            {stats.completedByDay.map((day, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative w-full">
                  <div className="h-32 w-full rounded-t-lg bg-slate-200/50 dark:bg-slate-700/50" />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.count / maxCount) * 100}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="absolute bottom-0 w-full rounded-t-lg bg-linear-to-t from-sky-500 to-indigo-500 dark:from-sky-600 dark:to-indigo-600"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
                    {day.count}
                  </span>
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">{day.date}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="grid gap-3 sm:grid-cols-2">
          <GlassCard variant="strong" className="p-4" glow="none">
            <h3 className="mb-3 text-sm font-semibold dark:text-slate-100">Theo danh mục</h3>
            <div className="space-y-2">
              {Object.entries(stats.byCategory).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-3 w-3 rounded-full",
                        key === "work" && "bg-sky-500",
                        key === "personal" && "bg-indigo-500",
                        key === "health" && "bg-emerald-500",
                        key === "other" && "bg-slate-500"
                      )}
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {key === "work" && "Công việc"}
                      {key === "personal" && "Cá nhân"}
                      {key === "health" && "Sức khỏe"}
                      {key === "other" && "Khác"}
                    </span>
                  </div>
                  <span className="text-sm font-bold dark:text-slate-100">{value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard variant="strong" className="p-4" glow="none">
            <h3 className="mb-3 text-sm font-semibold dark:text-slate-100">Theo ưu tiên</h3>
            <div className="space-y-2">
              {Object.entries(stats.byPriority).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-3 w-3 rounded-full",
                        key === "high" && "bg-red-500",
                        key === "medium" && "bg-amber-500",
                        key === "low" && "bg-blue-500"
                      )}
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {key === "high" && "Cao"}
                      {key === "medium" && "Trung bình"}
                      {key === "low" && "Thấp"}
                    </span>
                  </div>
                  <span className="text-sm font-bold dark:text-slate-100">{value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <Navigation />
    </div>
  )
}

function calculateStreak(tasks: any[]): number {
  const completedDates = tasks
    .filter((t) => t.completed && t.completedAt)
    .map((t) => format(new Date(t.completedAt), "yyyy-MM-dd"))
    .sort()
    .reverse()

  if (completedDates.length === 0) return 0

  let streak = 0
  let currentDate = new Date()

  for (let i = 0; i < 365; i++) {
    const dateStr = format(currentDate, "yyyy-MM-dd")
    if (completedDates.includes(dateStr)) {
      streak++
      currentDate = subDays(currentDate, 1)
    } else if (i === 0) {
      currentDate = subDays(currentDate, 1)
    } else {
      break
    }
  }

  return streak
}
