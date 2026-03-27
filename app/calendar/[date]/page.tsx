"use client"

import { use, useMemo } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Lightning, Plus } from "@phosphor-icons/react"
import { GlassCard } from "@/components/ui/glass-card"
import { Navigation } from "@/components/ui/navigation"
import { SwipeableTask } from "@/components/ui/swipeable-task"
import { useTasks } from "@/hooks/use-tasks"

export default function DateDetailPage({
  params,
}: {
  params: Promise<{ date: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { tasks, completeTask, deleteTask } = useTasks()
  const dateStr = resolvedParams.date

  const date = useMemo(() => new Date(dateStr), [dateStr])

  const dayTasks = useMemo(() => {
    return tasks
      .filter((task) => task.date === dateStr)
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        return (a.time || "").localeCompare(b.time || "")
      })
  }, [tasks, dateStr])

  const pendingTasks = dayTasks.filter((t) => !t.completed)
  const completedTasks = dayTasks.filter((t) => t.completed)

  return (
    <div className="liquid-page">
      <div className="liquid-container w-full max-w-full space-y-3 overflow-hidden sm:space-y-5">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-start justify-between gap-3"
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.back()}
              className="liquid-panel mt-0.5 rounded-xl p-2 sm:mt-1 sm:p-2.5"
            >
              <ArrowLeft size={18} weight="bold" className="text-slate-700 sm:hidden" />
              <ArrowLeft size={20} weight="bold" className="hidden text-slate-700 sm:block" />
            </motion.button>

            <div>
              <h1 className="liquid-title text-xl font-bold tracking-tight sm:text-2xl md:text-4xl">
                {format(date, "dd MMMM yyyy", { locale: vi })}
              </h1>
              <p className="mt-0.5 text-xs text-slate-600 sm:mt-1 sm:text-sm md:text-base">
                {format(date, "EEEE", { locale: vi })}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/calendar/create?date=${dateStr}`)}
            className="liquid-panel flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-2 sm:text-sm"
          >
            <Plus size={16} weight="bold" className="sm:hidden" />
            <Plus size={18} weight="bold" className="hidden sm:block" />
            <span>Thêm task</span>
          </motion.button>
        </motion.header>

        <div className="grid w-full grid-cols-3 gap-2 sm:gap-3">
          <GlassCard className="overflow-hidden p-2.5 sm:p-3 md:p-4" glow="none">
            <p className="truncate text-[11px] text-slate-600 sm:text-xs md:text-sm">Tổng</p>
            <p className="mt-1 truncate text-xl font-bold sm:text-2xl md:text-3xl">
              {dayTasks.length}
            </p>
          </GlassCard>
          <GlassCard className="overflow-hidden p-2.5 sm:p-3 md:p-4" glow="none">
            <p className="truncate text-[11px] text-slate-600 sm:text-xs md:text-sm">Đang chờ</p>
            <p className="mt-1 truncate text-xl font-bold text-slate-800 sm:text-2xl md:text-3xl">
              {pendingTasks.length}
            </p>
          </GlassCard>
          <GlassCard className="overflow-hidden p-2.5 sm:p-3 md:p-4" glow="none">
            <p className="truncate text-[11px] text-slate-600 sm:text-xs md:text-sm">Hoàn thành</p>
            <p className="mt-1 truncate text-xl font-bold text-slate-800 sm:text-2xl md:text-3xl">
              {completedTasks.length}
            </p>
          </GlassCard>
        </div>

        <section className="w-full space-y-3 sm:space-y-5">
          {pendingTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="mb-2 text-base font-semibold sm:mb-3 sm:text-lg md:text-xl">
                Tasks đang chờ
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <AnimatePresence>
                  {pendingTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ delay: index * 0.04 }}
                      className="w-full"
                    >
                      <SwipeableTask
                        task={task}
                        onComplete={() => completeTask(task.id)}
                        onDelete={() => deleteTask(task.id)}
                        onClick={() => {}}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {completedTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="mb-2 text-base font-semibold text-slate-600 sm:mb-3 sm:text-lg md:text-xl">
                Đã hoàn thành
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {completedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full"
                  >
                    <SwipeableTask
                      task={task}
                      onComplete={() => completeTask(task.id)}
                      onDelete={() => deleteTask(task.id)}
                      onClick={() => {}}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {dayTasks.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GlassCard className="p-6 text-center sm:p-8 md:p-12">
                <Lightning
                  size={32}
                  className="mx-auto text-slate-500 sm:hidden"
                  weight="duotone"
                />
                <Lightning
                  size={42}
                  className="mx-auto hidden text-slate-500 sm:block"
                  weight="duotone"
                />
                <p className="mt-2 text-sm text-slate-700 sm:mt-3 sm:text-base md:text-lg">
                  Không có task nào
                </p>
                <p className="mt-0.5 text-xs text-slate-500 sm:mt-1 sm:text-sm">
                  Nhấn &quot;Thêm task&quot; để tạo mới.
                </p>
              </GlassCard>
            </motion.div>
          )}
        </section>
      </div>

      <Navigation />
    </div>
  )
}
