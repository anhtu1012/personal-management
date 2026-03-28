"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  CheckCircle,
  Clock,
  Fire,
  TrendUp,
  User,
  ListChecks,
  ChartBar,
} from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/ui/navigation"
import { SwipeableTask } from "@/components/ui/swipeable-task"
import { useTasks } from "@/hooks/use-tasks"
import { storage } from "@/lib/storage"
import { UserProfile } from "@/types"

export default function ProfilePage() {
  const router = useRouter()
  const { tasks, completeTask, deleteTask } = useTasks()
  const [showCompletedTasks, setShowCompletedTasks] = useState(false)
  const [profile, setProfile] = useState<UserProfile>(() => {
    return (
      storage.getProfile() || {
        name: "Người dùng",
        email: "",
        timezone: "Asia/Ho_Chi_Minh",
      }
    )
  })
  const [isEditing, setIsEditing] = useState(false)
  const [tempProfile, setTempProfile] = useState<UserProfile>(() => {
    return (
      storage.getProfile() || {
        name: "Người dùng",
        email: "",
        timezone: "Asia/Ho_Chi_Minh",
      }
    )
  })

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.completed).length
    const delayed = tasks.filter((t) => t.delayed).length
    const pending = tasks.filter((t) => !t.completed).length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    const byCategory = {
      work: tasks.filter((t) => t.category === "work").length,
      personal: tasks.filter((t) => t.category === "personal").length,
      health: tasks.filter((t) => t.category === "health").length,
      other: tasks.filter((t) => t.category === "other").length,
    }

    return { total, completed, delayed, pending, completionRate, byCategory }
  }, [tasks])

  const completedTasks = useMemo(() => {
    return tasks
      .filter((t) => t.completed)
      .sort((a, b) => {
        // Sort by date descending (newest first)
        return b.date.localeCompare(a.date)
      })
  }, [tasks])

  const handleSave = () => {
    storage.saveProfile(tempProfile)
    setProfile(tempProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempProfile(profile)
    setIsEditing(false)
  }

  return (
    <div className="liquid-page">
      <div className="liquid-container space-y-5">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="liquid-panel flex size-10 items-center justify-center rounded-2xl">
              <User size={22} weight="fill" className="text-slate-700" />
            </div>
            <h1 className="liquid-title text-3xl font-bold tracking-tight sm:text-4xl">
              Hồ Sơ
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/statistics")}
            className="liquid-panel flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800"
          >
            <ChartBar size={18} weight="bold" />
            <span className="hidden sm:inline">Thống kê</span>
          </motion.button>
        </motion.header>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard variant="strong" className="p-4 sm:p-6" glow="none">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative mx-auto sm:mx-0">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-300/60 bg-linear-to-br from-white via-sky-50 to-indigo-100 shadow-[0_10px_26px_rgba(15,23,42,0.14)] sm:h-24 sm:w-24">
                      <User
                        size={40}
                        weight="bold"
                        className="text-slate-800"
                      />
                    </div>
                    <div className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-slate-700 sm:size-8">
                      <Fire size={14} weight="fill" />
                    </div>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <Label
                            htmlFor="name"
                            className="text-sm text-slate-700"
                          >
                            Tên
                          </Label>
                          <Input
                            id="name"
                            value={tempProfile.name}
                            onChange={(e) =>
                              setTempProfile({
                                ...tempProfile,
                                name: e.target.value,
                              })
                            }
                            className="mt-1 h-10 rounded-xl border-slate-300/60 bg-white/75"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="email"
                            className="text-sm text-slate-700"
                          >
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={tempProfile.email}
                            onChange={(e) =>
                              setTempProfile({
                                ...tempProfile,
                                email: e.target.value,
                              })
                            }
                            className="mt-1 h-10 rounded-xl border-slate-300/60 bg-white/75"
                            placeholder="email@example.com"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                        {profile.email && (
                          <p className="mt-1 text-sm text-slate-600">
                            {profile.email}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                          <span className="liquid-chip px-3 py-1 text-xs font-semibold">
                            {stats.completionRate}% hoàn thành
                          </span>
                          <span className="rounded-full border border-slate-300/55 bg-white/72 px-3 py-1 text-xs font-semibold text-slate-700">
                            {stats.total} tasks
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="rounded-xl border border-slate-300/70 bg-white/90 px-4 py-2.5 font-semibold text-slate-800 transition hover:bg-white"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={handleCancel}
                        className="rounded-xl border border-slate-300/60 bg-white/78 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-white"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="col-span-2 rounded-xl border border-slate-300/70 bg-white/90 px-4 py-2.5 font-semibold text-slate-800 transition hover:bg-white"
                    >
                      Chỉnh sửa hồ sơ
                    </button>
                  )}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              <h3 className="mb-3 text-lg font-semibold sm:text-xl">
                Thống kê tổng quan
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <GlassCard className="p-3 sm:p-4" glow="none">
                  <div className="mb-2 flex items-center gap-2 text-xs text-slate-600 sm:text-sm">
                    <Calendar size={16} /> Tổng
                  </div>
                  <p className="text-2xl font-bold sm:text-3xl">
                    {stats.total}
                  </p>
                </GlassCard>
                <GlassCard className="p-3 sm:p-4" glow="none">
                  <div className="mb-2 flex items-center gap-2 text-xs text-slate-600 sm:text-sm">
                    <CheckCircle size={16} /> Xong
                  </div>
                  <p className="text-2xl font-bold text-slate-800 sm:text-3xl">
                    {stats.completed}
                  </p>
                </GlassCard>
                <GlassCard className="p-3 sm:p-4" glow="none">
                  <div className="mb-2 flex items-center gap-2 text-xs text-slate-600 sm:text-sm">
                    <Clock size={16} /> Chờ
                  </div>
                  <p className="text-2xl font-bold text-slate-800 sm:text-3xl">
                    {stats.pending}
                  </p>
                </GlassCard>
                <GlassCard className="p-3 sm:p-4" glow="none">
                  <div className="mb-2 flex items-center gap-2 text-xs text-slate-600 sm:text-sm">
                    <Clock size={16} /> Delay
                  </div>
                  <p className="text-2xl font-bold text-slate-800 sm:text-3xl">
                    {stats.delayed}
                  </p>
                </GlassCard>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
            >
              <GlassCard variant="strong" className="p-4 sm:p-6" glow="none">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold sm:text-xl">
                    Tỷ lệ hoàn thành
                  </h3>
                  <span className="flex items-center gap-1 text-2xl font-bold text-slate-800 sm:text-3xl">
                    <TrendUp
                      size={20}
                      className="text-slate-700"
                      weight="bold"
                    />
                    {stats.completionRate}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full border border-slate-300/55 bg-white/65">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.completionRate}%` }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                    className="h-full rounded-full bg-linear-to-r from-zinc-100 via-zinc-300 to-zinc-500"
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-slate-500 sm:text-sm">
                  <span>{stats.completed} hoàn thành</span>
                  <span>{stats.total} tổng cộng</span>
                </div>
              </GlassCard>
            </motion.div>
          </section>

          <aside className="space-y-5 xl:pt-0.5">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard variant="strong" className="p-4" glow="none">
                <h3 className="mb-3 text-lg font-semibold">Danh mục</h3>
                <div className="space-y-3">
                  {[
                    { key: "work", label: "Công việc", color: "bg-sky-500" },
                    {
                      key: "personal",
                      label: "Cá nhân",
                      color: "bg-indigo-500",
                    },
                    {
                      key: "health",
                      label: "Sức khỏe",
                      color: "bg-emerald-500",
                    },
                    { key: "other", label: "Khác", color: "bg-slate-500" },
                  ].map(({ key, label, color }) => {
                    const count =
                      stats.byCategory[key as keyof typeof stats.byCategory]
                    const percent =
                      stats.total > 0 ? (count / stats.total) * 100 : 0

                    return (
                      <div key={key}>
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                          <span className="text-slate-700">{label}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full border border-slate-300/55 bg-white/65">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.9, delay: 0.3 }}
                            className={`h-full ${color}`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.26 }}
            >
              <GlassCard variant="strong" className="p-4" glow="none">
                <h3 className="mb-3 text-lg font-semibold">Thành tích</h3>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="liquid-panel flex items-center gap-3 rounded-xl p-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-slate-200/70 text-slate-700">
                      <Fire size={20} weight="fill" />
                    </div>
                    <div>
                      <p className="font-semibold">Streak hiện tại</p>
                      <p className="text-slate-500">0 ngày liên tiếp</p>
                    </div>
                  </div>
                  <div className="liquid-panel flex items-center gap-3 rounded-xl p-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-slate-200/70 text-slate-700">
                      <TrendUp size={20} weight="fill" />
                    </div>
                    <div>
                      <p className="font-semibold">Năng suất</p>
                      <p className="text-slate-500">
                        {stats.completionRate}% hoàn thành
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </aside>
        </div>

        {/* Completed Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListChecks size={24} weight="bold" className="text-slate-700" />
              <h2 className="text-xl font-semibold sm:text-2xl">
                Tasks đã hoàn thành
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCompletedTasks(!showCompletedTasks)}
              className="liquid-panel rounded-xl px-3 py-2 text-sm font-semibold text-slate-800"
            >
              {showCompletedTasks ? "Ẩn" : `Xem (${completedTasks.length})`}
            </motion.button>
          </div>

          <AnimatePresence>
            {showCompletedTasks && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {completedTasks.length > 0 ? (
                  <div className="space-y-3">
                    {completedTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <div className="mb-2">
                          {index === 0 || task.date !== completedTasks[index - 1].date ? (
                            <div className="mb-2 text-sm font-semibold text-slate-600">
                              {format(new Date(task.date), "dd MMMM yyyy", { locale: vi })}
                            </div>
                          ) : null}
                          <SwipeableTask
                            task={task}
                            onComplete={() => completeTask(task.id)}
                            onDelete={() => deleteTask(task.id)}
                            onClick={() => {}}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <GlassCard className="p-8 text-center">
                    <CheckCircle
                      size={42}
                      className="mx-auto text-slate-400"
                      weight="duotone"
                    />
                    <p className="mt-3 text-base text-slate-700">
                      Chưa có task nào hoàn thành
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Hoàn thành task để xem chúng ở đây
                    </p>
                  </GlassCard>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <Navigation />
    </div>
  )
}
