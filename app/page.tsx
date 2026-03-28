"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/ui/navigation"
import { SearchBar } from "@/components/ui/search-bar"
import { SwipeableTask } from "@/components/ui/swipeable-task"
import { TaskDetailModal } from "@/components/ui/task-detail-modal"
import { Textarea } from "@/components/ui/textarea"
import { useTaskContext } from "@/contexts/TaskContext"
import { notifications } from "@/lib/notifications"
import { cn } from "@/lib/utils"
import { Task } from "@/types"
import { Check, Clock, Lightning, Plus } from "@phosphor-icons/react/dist/ssr"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { AnimatePresence, motion } from "framer-motion"
import { useMemo, useState } from "react"

export default function HomePage() {
  const { tasks, loading, addTask, completeTask, deleteTask } = useTaskContext()
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [time, setTime] = useState("")
  const [category, setCategory] = useState<Task["category"]>("personal")

  const selectedDateStr = format(new Date(), "yyyy-MM-dd")

  const filteredTasks = useMemo(() => {
    let result = tasks

    if (searchQuery) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    }

    return result
  }, [tasks, searchQuery])

  const todayTasks = useMemo(() => {
    return filteredTasks
      .filter((task) => task.date === selectedDateStr && !task.completed)
      .sort((a, b) => {
        if (a.priority && b.priority) {
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority]
          }
        }
        return (a.time || "").localeCompare(b.time || "")
      })
  }, [filteredTasks, selectedDateStr])

  const completedToday = useMemo(() => {
    return filteredTasks.filter(
      (task) => task.date === selectedDateStr && task.completed
    ).length
  }, [filteredTasks, selectedDateStr])

  const progressValue =
    todayTasks.length + completedToday > 0
      ? Math.round(
          (completedToday / (todayTasks.length + completedToday)) * 100
        )
      : 0

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newTask = addTask({
      title,
      description,
      date: selectedDateStr,
      time,
      category,
      completed: false,
      delayed: false,
    })

    // Schedule notification if time is set
    if (time && newTask) {
      const taskDateTime = `${selectedDateStr}T${time}`
      const hasPermission = await notifications.requestPermission()
      if (hasPermission) {
        notifications.scheduleTaskReminder(title, taskDateTime)
      }
    }

    setTitle("")
    setDescription("")
    setTime("")
    setShowQuickAdd(false)
  }

  if (loading) {
    return (
      <div className="liquid-page flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        >
          <Lightning size={46} className="text-slate-700" weight="fill" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="liquid-page">
      <span className="liquid-orb liquid-orb-sky -top-20 -left-10 h-44 w-44 sm:h-56 sm:w-56" />
      <span className="liquid-orb liquid-orb-indigo top-22 -right-10 h-40 w-40 sm:h-52 sm:w-52" />
      <span className="liquid-orb liquid-orb-mint top-[44%] left-[40%] h-36 w-36 sm:h-44 sm:w-44" />

      <div className="liquid-container relative z-10">
        <div className="w-full max-w-full overflow-hidden">
          <section className="w-full space-y-3 sm:space-y-5">
            <motion.header
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <div className="mb-1.5 flex items-center gap-2 sm:mb-2 sm:gap-2.5">
                <div className="liquid-panel flex size-8 items-center justify-center rounded-xl sm:size-10 sm:rounded-2xl">
                  <Lightning
                    size={18}
                    className="text-slate-700 sm:hidden"
                    weight="fill"
                  />
                  <Lightning
                    size={24}
                    className="hidden text-slate-700 sm:block"
                    weight="fill"
                  />
                </div>
                <h1 className="liquid-title text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                  Dashboard
                </h1>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm md:text-base">
                {format(new Date(), "EEEE, dd MMMM yyyy", { locale: vi })}
              </p>
            </motion.header>


            <div className="grid w-full grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
              <GlassCard className="overflow-hidden p-2.5 sm:p-3 md:p-4" glow="none">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 sm:mb-2 sm:gap-2 sm:text-xs md:text-sm">
                  <Clock size={14} className="shrink-0 text-slate-700 dark:text-slate-300 sm:hidden" />
                  <Clock size={16} className="hidden shrink-0 text-slate-700 dark:text-slate-300 sm:block" />
                  <span className="truncate">Đang chờ</span>
                </div>
                <p className="truncate text-xl font-bold text-slate-800 dark:text-slate-100 sm:text-2xl md:text-3xl">
                  {todayTasks.length}
                </p>
              </GlassCard>

              <GlassCard className="overflow-hidden p-2.5 sm:p-3 md:p-4" glow="none">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 sm:mb-2 sm:gap-2 sm:text-xs md:text-sm">
                  <Check size={14} className="shrink-0 text-slate-700 dark:text-slate-300 sm:hidden" weight="bold" />
                  <Check size={16} className="hidden shrink-0 text-slate-700 dark:text-slate-300 sm:block" weight="bold" />
                  <span className="truncate">Hoàn thành</span>
                </div>
                <p className="truncate text-xl font-bold text-slate-800 dark:text-slate-100 sm:text-2xl md:text-3xl">
                  {completedToday}
                </p>
              </GlassCard>

              <GlassCard className="col-span-2 overflow-hidden p-2.5 sm:p-3 md:p-4" glow="none">
                <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-400 sm:mb-2 sm:text-xs md:text-sm">
                  <span className="truncate">Tiến độ hôm nay</span>
                  <span className="shrink-0 text-base font-bold text-slate-800 dark:text-slate-100 sm:text-lg md:text-2xl">
                    {progressValue}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full border border-slate-300/55 bg-white/65 dark:border-slate-600/55 dark:bg-slate-800/65 sm:h-2.5 md:h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressValue}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-linear-to-r from-zinc-100 via-zinc-300 to-zinc-500 dark:from-zinc-700 dark:via-zinc-500 dark:to-zinc-300"
                  />
                </div>
              </GlassCard>
            </div>

            <section className="w-full">
              <div className="mb-3 space-y-2">
                <SearchBar
                  onSearch={setSearchQuery}
                  placeholder="Tìm kiếm tasks..."
                />
                <div className="flex items-center justify-between gap-2">
                  <h2 className="truncate text-lg font-semibold text-slate-800 dark:text-slate-100 sm:text-xl md:text-2xl">
                    {format(new Date(), "dd MMMM", { locale: vi })}
                  </h2>
                  <div className="flex shrink-0 items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowQuickAdd((prev) => !prev)}
                      className="liquid-panel flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 sm:gap-2 sm:rounded-2xl sm:px-3 sm:text-sm"
                    >
                      <Plus size={16} weight="bold" className="sm:hidden dark:text-slate-100" />
                      <Plus size={18} weight="bold" className="hidden sm:block dark:text-slate-100" />
                      <span>{showQuickAdd ? "Đóng" : "Thêm"}</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {showQuickAdd && (
                  <>
                    <motion.div
                      key="quick-add-backdrop"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowQuickAdd(false)}
                      className="fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-[1px] sm:hidden"
                    />

                    <motion.div
                      key="quick-add-mobile"
                      initial={{ opacity: 0, y: 36 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      className="fixed inset-x-0 bottom-20 z-50 px-2 sm:hidden"
                    >
                      <div className="liquid-sheet p-3">
                        <form onSubmit={handleQuickAdd} className="space-y-2.5">
                          <div>
                            <Label
                              htmlFor="title-mobile"
                              className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300"
                            >
                              Tiêu đề
                            </Label>
                            <Input
                              id="title-mobile"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Nhập tiêu đề task..."
                              className="h-9 rounded-xl border-slate-300/60 bg-white/75 text-sm"
                              required
                            />
                          </div>

                          <div>
                            <Label
                              htmlFor="time-mobile"
                              className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300"
                            >
                              Thời gian
                            </Label>
                            <Input
                              id="time-mobile"
                              type="time"
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                              className="h-9 rounded-xl border-slate-300/60 bg-white/75 text-sm"
                            />
                          </div>

                          <div>
                            <Label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                              Danh mục
                            </Label>
                            <div className="flex gap-1.5">
                              {[
                                { value: "work", color: "bg-sky-500", label: "CV" },
                                { value: "personal", color: "bg-indigo-500", label: "CN" },
                                { value: "health", color: "bg-emerald-500", label: "SK" },
                                { value: "other", color: "bg-slate-500", label: "KC" }
                              ].map((cat) => (
                                <button
                                  key={cat.value}
                                  type="button"
                                  onClick={() => setCategory(cat.value as Task["category"])}
                                  className={cn(
                                    "flex h-9 flex-1 items-center justify-center rounded-lg border transition-all",
                                    category === cat.value
                                      ? "border-slate-400 bg-white shadow-md ring-2 ring-slate-300/50"
                                      : "border-slate-300/50 bg-white/70 hover:bg-white"
                                  )}
                                >
                                  <span className={cn("h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white", cat.color)}>
                                    {cat.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full rounded-xl border border-slate-300/70 bg-white/92 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white dark:border-slate-600/70 dark:bg-slate-800/92 dark:text-slate-100 dark:hover:bg-slate-800"
                          >
                            Tạo task
                          </button>
                        </form>
                      </div>
                    </motion.div>

                    <motion.div
                      key="quick-add-inline"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mb-4 hidden sm:block"
                    >
                      <GlassCard
                        variant="strong"
                        className="p-4 sm:p-5"
                        glow="none"
                      >
                        <form onSubmit={handleQuickAdd} className="space-y-4">
                          <div>
                            <Label
                              htmlFor="title"
                              className="mb-2 block text-sm text-slate-700 dark:text-slate-300"
                            >
                              Tiêu đề
                            </Label>
                            <Input
                              id="title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Nhập tiêu đề task..."
                              className="h-10 rounded-xl border-slate-300/60 bg-white/75 text-sm"
                              required
                            />
                          </div>

                          <div>
                            <Label
                              htmlFor="description"
                              className="mb-2 block text-sm text-slate-700 dark:text-slate-300"
                            >
                              Mô tả
                            </Label>
                            <Textarea
                              id="description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Mô tả chi tiết..."
                              rows={3}
                              className="rounded-xl border-slate-300/60 bg-white/75"
                            />
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <Label
                                htmlFor="time"
                                className="mb-2 block text-sm text-slate-700 dark:text-slate-300"
                              >
                                Thời gian
                              </Label>
                              <Input
                                id="time"
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="h-10 rounded-xl border-slate-300/60 bg-white/75"
                              />
                            </div>

                            <div>
                              <Label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                                Danh mục
                              </Label>
                              <div className="flex gap-2">
                                {[
                                  { value: "work", color: "bg-sky-500", label: "CV" },
                                  { value: "personal", color: "bg-indigo-500", label: "CN" },
                                  { value: "health", color: "bg-emerald-500", label: "SK" },
                                  { value: "other", color: "bg-slate-500", label: "KC" }
                                ].map((cat) => (
                                  <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setCategory(cat.value as Task["category"])}
                                    className={cn(
                                      "flex h-10 flex-1 items-center justify-center rounded-xl border transition-all",
                                      category === cat.value
                                        ? "border-slate-400 bg-white shadow-md ring-2 ring-slate-300/50"
                                        : "border-slate-300/50 bg-white/70 hover:bg-white"
                                    )}
                                  >
                                    <span className={cn("h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white", cat.color)}>
                                      {cat.label}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full rounded-xl border border-slate-300/70 bg-white/90 px-4 py-2.5 font-semibold text-slate-800 transition hover:bg-white dark:border-slate-600/70 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-800"
                          >
                            Tạo task
                          </button>
                        </form>
                      </GlassCard>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              <div className="space-y-2 sm:space-y-3">
                <AnimatePresence>
                  {todayTasks.length === 0 && !showQuickAdd && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
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
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 sm:mt-3 sm:text-base md:text-lg">
                          Không có task nào
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:mt-1 sm:text-sm">
                          Nhấn &quot;Thêm&quot; để bắt đầu.
                        </p>
                      </GlassCard>
                    </motion.div>
                  )}

                  {todayTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <SwipeableTask
                        task={task}
                        onComplete={() => completeTask(task.id)}
                        onDelete={() => deleteTask(task.id)}
                        onClick={() => setSelectedTask(task)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          </section>
        </div>
      </div>

      {selectedTask && (
        <TaskDetailModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          allTasks={todayTasks}
          onComplete={completeTask}
          onDelete={deleteTask}
          onNavigate={(task) => setSelectedTask(task)}
        />
      )}

      <Navigation />
    </div>
  )
}
