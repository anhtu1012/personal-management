"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from "framer-motion"
import { X, Clock, Tag, ArrowsClockwise, Trash, CheckCircle, Briefcase, User, Heart, PushPin } from "@phosphor-icons/react/dist/ssr"
import { Task } from "@/types"
import { PriorityBadge } from "./priority-badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface TaskDetailModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task
  allTasks: Task[]
  onComplete?: (id: string) => void
  onDelete?: (id: string) => void
  onNavigate?: (task: Task) => void
}

const categoryConfig = {
  work: { label: "Công việc", color: "sky", Icon: Briefcase },
  personal: { label: "Cá nhân", color: "indigo", Icon: User },
  health: { label: "Sức khỏe", color: "emerald", Icon: Heart },
  other: { label: "Khác", color: "slate", Icon: PushPin },
}

export function TaskDetailModal({
  isOpen,
  onClose,
  task,
  allTasks,
  onComplete,
  onDelete,
  onNavigate,
}: TaskDetailModalProps) {
  const [mounted, setMounted] = useState(false)
  const [currentTask, setCurrentTask] = useState(task)
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-300, 0, 300], [0.6, 1, 0.6])
  const scale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setCurrentTask(task)
  }, [task])

  const currentIndex = allTasks.findIndex((t) => t.id === currentTask.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < allTasks.length - 1

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100 && hasPrev) {
      // Swipe right - previous task
      const prevTask = allTasks[currentIndex - 1]
      setCurrentTask(prevTask)
      if (onNavigate) onNavigate(prevTask)
    } else if (info.offset.x < -100 && hasNext) {
      // Swipe left - next task
      const nextTask = allTasks[currentIndex + 1]
      setCurrentTask(nextTask)
      if (onNavigate) onNavigate(nextTask)
    }
  }

  const handleComplete = () => {
    if (onComplete) {
      onComplete(currentTask.id)
      onClose()
    }
  }

  const handleDelete = () => {
    if (onDelete && confirm("Bạn có chắc muốn xóa task này?")) {
      onDelete(currentTask.id)
      onClose()
    }
  }

  const categoryInfo = currentTask.category
    ? categoryConfig[currentTask.category]
    : categoryConfig.other

  const CategoryIcon = categoryInfo.Icon

  if (!isOpen || !mounted) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center sm:justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md dark:bg-black/80"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative z-10 w-full sm:mx-4 sm:max-w-2xl"
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              style={{ x, opacity, scale }}
              className="glass-strong overflow-hidden rounded-t-3xl shadow-2xl sm:rounded-3xl"
            >
              {/* Header with liquid glass */}
              <div className="liquid-panel relative border-b border-slate-300/40 px-5 py-4 dark:border-slate-600/40">
                {/* Swipe Indicator */}
                <div className="mb-3 flex justify-center sm:hidden">
                  <div className="h-1 w-12 rounded-full bg-slate-400/60 dark:bg-slate-500/60" />
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Task {currentIndex + 1} / {allTasks.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-500">
                      {hasPrev && <span>← Vuốt sang phải</span>}
                      {hasNext && <span>Vuốt sang trái →</span>}
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="liquid-chip flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:scale-105"
                  >
                    <X size={20} weight="bold" className="text-slate-700 dark:text-slate-300" />
                  </button>
                </div>
              </div>

              {/* Content with liquid glass background */}
              <div className="max-h-[60vh] overflow-y-auto p-5 sm:max-h-[70vh] sm:p-6">
                {/* Category & Status */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <div
                    className={cn(
                      "liquid-chip flex items-center gap-2 rounded-xl px-3 py-2",
                      categoryInfo.color === "sky" && "border-sky-400/40 bg-sky-100/40 dark:bg-sky-900/30",
                      categoryInfo.color === "indigo" && "border-indigo-400/40 bg-indigo-100/40 dark:bg-indigo-900/30",
                      categoryInfo.color === "emerald" && "border-emerald-400/40 bg-emerald-100/40 dark:bg-emerald-900/30",
                      categoryInfo.color === "slate" && "border-slate-400/40 bg-slate-100/40 dark:bg-slate-700/40"
                    )}
                  >
                    <CategoryIcon 
                      size={18} 
                      weight="bold"
                      className={cn(
                        categoryInfo.color === "sky" && "text-sky-700 dark:text-sky-300",
                        categoryInfo.color === "indigo" && "text-indigo-700 dark:text-indigo-300",
                        categoryInfo.color === "emerald" && "text-emerald-700 dark:text-emerald-300",
                        categoryInfo.color === "slate" && "text-slate-700 dark:text-slate-300"
                      )}
                    />
                    <span className={cn(
                      "text-sm font-medium",
                      categoryInfo.color === "sky" && "text-sky-700 dark:text-sky-300",
                      categoryInfo.color === "indigo" && "text-indigo-700 dark:text-indigo-300",
                      categoryInfo.color === "emerald" && "text-emerald-700 dark:text-emerald-300",
                      categoryInfo.color === "slate" && "text-slate-700 dark:text-slate-300"
                    )}>
                      {categoryInfo.label}
                    </span>
                  </div>

                  {currentTask.priority && (
                    <PriorityBadge priority={currentTask.priority} size="md" />
                  )}

                  {currentTask.completed && (
                    <div className="liquid-chip flex items-center gap-2 rounded-xl border-emerald-400/40 bg-emerald-100/40 px-3 py-2 dark:bg-emerald-900/30">
                      <CheckCircle size={18} weight="fill" className="text-emerald-700 dark:text-emerald-300" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        Hoàn thành
                      </span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h2 className={cn(
                  "mb-4 text-xl font-bold leading-tight text-slate-800 dark:text-slate-100 sm:text-2xl",
                  currentTask.completed && "line-through opacity-60"
                )}>
                  {currentTask.title}
                </h2>

                {/* Description */}
                {currentTask.description && (
                  <div className="glass mb-5 rounded-2xl p-4">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                      Mô tả
                    </h3>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {currentTask.description}
                    </p>
                  </div>
                )}

                {/* Details */}
                <div className="mb-4 space-y-3">
                  {/* Date & Time */}
                  <div className="flex flex-wrap gap-3">
                    <div className="glass flex-1 rounded-xl p-3">
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                        Ngày
                      </div>
                      <div className="text-base font-semibold text-slate-800 dark:text-slate-100">
                        {format(new Date(currentTask.date), "dd/MM/yyyy")}
                      </div>
                    </div>

                    {currentTask.time && (
                      <div className="glass flex-1 rounded-xl p-3">
                        <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                          <Clock size={12} weight="bold" />
                          Giờ
                        </div>
                        <div className="text-base font-semibold text-slate-800 dark:text-slate-100">
                          {currentTask.time}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recurring */}
                  {currentTask.recurring && currentTask.recurring !== "none" && (
                    <div className="glass rounded-xl border border-purple-300/50 bg-purple-100/30 p-3 dark:border-purple-500/50 dark:bg-purple-900/20">
                      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-400">
                        <ArrowsClockwise size={12} weight="bold" />
                        Lặp lại
                      </div>
                      <div className="text-base font-semibold text-purple-800 dark:text-purple-300">
                        {currentTask.recurring === "daily" && "Hàng ngày"}
                        {currentTask.recurring === "weekly" && "Hàng tuần"}
                        {currentTask.recurring === "monthly" && "Hàng tháng"}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {currentTask.tags && currentTask.tags.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                      <Tag size={14} weight="bold" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentTask.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="liquid-chip rounded-lg px-3 py-1.5 text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {currentTask.notes && (
                  <div className="glass rounded-2xl p-4">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                      Ghi chú
                    </h3>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {currentTask.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Actions with liquid glass */}
              <div className="liquid-panel flex gap-3 border-t border-slate-300/40 px-5 py-4 dark:border-slate-600/40">
                {!currentTask.completed && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleComplete}
                    className="glass-strong flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-50/50 px-4 py-3 font-semibold text-emerald-700 transition hover:scale-105 dark:border-emerald-500/40 dark:bg-emerald-900/30 dark:text-emerald-300"
                  >
                    <CheckCircle size={20} weight="bold" />
                    <span className="text-sm sm:text-base">Hoàn thành</span>
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDelete}
                  className="glass-strong flex items-center justify-center gap-2 rounded-xl border border-red-400/50 bg-red-50/50 px-4 py-3 font-semibold text-red-700 transition hover:scale-105 dark:border-red-500/40 dark:bg-red-900/30 dark:text-red-300"
                >
                  <Trash size={20} weight="bold" />
                  <span className="text-sm sm:text-base">Xóa</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}
