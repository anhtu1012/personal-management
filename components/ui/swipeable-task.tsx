"use client"

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion"
import { Task } from "@/types"
import { Clock, Circle, CheckCircle, Tag } from "@phosphor-icons/react"
import { PriorityBadge } from "./priority-badge"
import { cn } from "@/lib/utils"
import { haptics } from "@/lib/haptics"

interface SwipeableTaskProps {
  task: Task
  onComplete: () => void
  onDelete: () => void
  onClick: () => void
}

const categoryConfig = {
  work: { label: "Công việc", color: "zinc-1" },
  personal: { label: "Cá nhân", color: "zinc-2" },
  health: { label: "Sức khỏe", color: "zinc-3" },
  other: { label: "Khác", color: "zinc-4" },
}

export function SwipeableTask({
  task,
  onComplete,
  onDelete,
  onClick,
}: SwipeableTaskProps) {
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8])
  const scale = useTransform(x, [-200, -150, 0, 150, 200], [0.98, 0.95, 1, 0.95, 0.98])
  const bgOpacity = useTransform(x, [-200, 0, 200], [1, 0, 1])
  
  // Scale up icons when reaching threshold
  const leftIconScale = useTransform(x, [-200, -150, 0], [1.2, 1, 1])
  const rightIconScale = useTransform(x, [0, 150, 200], [1, 1, 1.2])

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // Increase threshold - need to drag further to trigger action
    if (info.offset.x < -120) {
      // Swipe left = Delete (reduced from 150px to 120px for easier mobile use)
      haptics.error()
      onDelete()
    } else if (info.offset.x > 120) {
      // Swipe right = Complete (reduced from 150px to 120px)
      haptics.success()
      onComplete()
    }
  }

  const categoryInfo = task.category
    ? categoryConfig[task.category]
    : categoryConfig.other

  // Background color when dragging
  const bgColor = useTransform(
    x,
    [-200, -80, 0, 80, 200],
    [
      "rgba(254, 226, 226, 0.95)", // red-100 for delete (left)
      "rgba(254, 226, 226, 0.3)",
      "rgba(255, 255, 255, 0)",
      "rgba(209, 250, 229, 0.3)",
      "rgba(209, 250, 229, 0.95)", // emerald-100 for complete (right)
    ]
  )

  return (
    <div className="relative touch-pan-y overflow-hidden rounded-2xl sm:rounded-3xl">
      {/* Colored background when dragging */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: bgColor }}
      />
      {/* Background indicators */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-between px-3 sm:px-6"
        style={{ opacity: bgOpacity }}
      >
        {/* Left side - Delete */}
        <motion.div
          className="flex items-center gap-1.5 sm:gap-2"
          style={{ 
            opacity: useTransform(x, [-200, 0], [1, 0]),
            scale: leftIconScale
          }}
        >
          <div className="rounded-xl border-2 border-red-400/80 bg-red-200/90 p-2 shadow-lg backdrop-blur-xl sm:rounded-2xl sm:p-3">
            <svg className="h-5 w-5 text-red-700 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <svg className="hidden h-6 w-6 text-red-700 sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <span className="text-sm font-bold text-red-700 drop-shadow-sm sm:text-base md:text-lg">
            Xóa
          </span>
        </motion.div>
        
        {/* Right side - Complete */}
        <motion.div
          className="flex items-center gap-1.5 sm:gap-2"
          style={{ 
            opacity: useTransform(x, [0, 200], [0, 1]),
            scale: rightIconScale
          }}
        >
          <span className="text-sm font-bold text-emerald-700 drop-shadow-sm sm:text-base md:text-lg">
            Hoàn thành
          </span>
          <div className="rounded-xl border-2 border-emerald-400/80 bg-emerald-200/90 p-2 shadow-lg backdrop-blur-xl sm:rounded-2xl sm:p-3">
            <CheckCircle size={20} weight="fill" className="text-emerald-700 sm:hidden" />
            <CheckCircle size={24} weight="fill" className="hidden text-emerald-700 sm:block" />
          </div>
        </motion.div>
      </motion.div>

      {/* Task card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        dragMomentum={false}
        style={{ x, opacity, scale }}
        onDragEnd={handleDragEnd}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative z-10 cursor-pointer overflow-hidden rounded-2xl border-2 p-3 backdrop-blur-2xl transition-all sm:rounded-3xl sm:p-4 md:p-5",
          task.completed
            ? "border-slate-300/45 bg-white/65 opacity-70 dark:border-slate-600/45 dark:bg-slate-800/65"
            : task.category === "work"
              ? "border-sky-400/60 bg-white/90 hover:border-sky-500/70 hover:bg-white/95 active:scale-[0.995] dark:border-sky-500/50 dark:bg-slate-800/90 dark:hover:border-sky-400/70 dark:hover:bg-slate-800/95"
              : task.category === "personal"
                ? "border-indigo-400/60 bg-white/90 hover:border-indigo-500/70 hover:bg-white/95 active:scale-[0.995] dark:border-indigo-500/50 dark:bg-slate-800/90 dark:hover:border-indigo-400/70 dark:hover:bg-slate-800/95"
                : task.category === "health"
                  ? "border-emerald-400/60 bg-white/90 hover:border-emerald-500/70 hover:bg-white/95 active:scale-[0.995] dark:border-emerald-500/50 dark:bg-slate-800/90 dark:hover:border-emerald-400/70 dark:hover:bg-slate-800/95"
                  : "border-slate-400/60 bg-white/90 hover:border-slate-500/70 hover:bg-white/95 active:scale-[0.995] dark:border-slate-600/60 dark:bg-slate-800/90 dark:hover:border-slate-500/70 dark:hover:bg-slate-800/95"
        )}
      >
        <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
          {/* Checkbox */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              haptics.light()
              onComplete()
            }}
            className="mt-0.5 shrink-0 sm:mt-1"
          >
            {task.completed ? (
              <div className="rounded-lg border border-emerald-300/60 bg-emerald-100/75 p-0.5 sm:rounded-xl sm:p-1">
                <CheckCircle
                  size={20}
                  weight="fill"
                  className="text-emerald-700 sm:hidden"
                />
                <CheckCircle
                  size={24}
                  weight="fill"
                  className="hidden text-emerald-700 sm:block"
                />
              </div>
            ) : (
              <div className="rounded-lg border border-slate-300/60 bg-white/70 p-0.5 transition-colors hover:border-slate-400/70 dark:border-slate-600/60 dark:bg-slate-700/70 dark:hover:border-slate-500/70 sm:rounded-xl sm:p-1">
                <Circle
                  size={20}
                  weight="bold"
                  className="text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 sm:hidden"
                />
                <Circle
                  size={24}
                  weight="bold"
                  className="hidden text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 sm:block"
                />
              </div>
            )}
          </motion.button>

          {/* Content */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <h3
              className={cn(
                "wrap-break-word text-sm font-semibold text-slate-800 dark:text-slate-100 sm:text-base md:text-lg",
                task.completed && "line-through opacity-50"
              )}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="mt-0.5 line-clamp-2 wrap-break-word text-xs text-slate-600 dark:text-slate-400 sm:mt-1 sm:text-sm">
                {task.description}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:mt-3 sm:gap-2">
              {task.priority && (
                <div className="shrink-0">
                  <PriorityBadge priority={task.priority} size="sm" />
                </div>
              )}

              {task.time && (
                <div className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-300/55 bg-white/72 px-2 py-1 dark:border-slate-600/55 dark:bg-slate-700/72 sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-1.5">
                  <Clock size={12} weight="bold" className="shrink-0 text-slate-700 dark:text-slate-300 sm:hidden" />
                  <Clock size={14} weight="bold" className="hidden shrink-0 text-slate-700 dark:text-slate-300 sm:block" />
                  <span className="whitespace-nowrap text-[11px] font-medium text-slate-700 dark:text-slate-300 sm:text-xs">
                    {task.time}
                  </span>
                </div>
              )}

              {task.category && (
                <div
                  className={cn(
                    "shrink-0 rounded-lg border px-2 py-1 text-[11px] font-medium sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs",
                    categoryInfo.color === "zinc-1" &&
                      "border-sky-300/45 bg-sky-100/70 text-sky-700 dark:border-sky-500/50 dark:bg-sky-900/40 dark:text-sky-300",
                    categoryInfo.color === "zinc-2" &&
                      "border-indigo-300/45 bg-indigo-100/70 text-indigo-700 dark:border-indigo-500/50 dark:bg-indigo-900/40 dark:text-indigo-300",
                    categoryInfo.color === "zinc-3" &&
                      "border-emerald-300/45 bg-emerald-100/70 text-emerald-700 dark:border-emerald-500/50 dark:bg-emerald-900/40 dark:text-emerald-300",
                    categoryInfo.color === "zinc-4" &&
                      "border-slate-300/55 bg-slate-100/75 text-slate-600 dark:border-slate-600/55 dark:bg-slate-700/75 dark:text-slate-300"
                  )}
                >
                  <span className="whitespace-nowrap">{categoryInfo.label}</span>
                </div>
              )}

              {task.tags && task.tags.length > 0 && (
                <div className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-300/55 bg-white/72 px-2 py-1 dark:border-slate-600/55 dark:bg-slate-700/72 sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-1.5">
                  <Tag size={12} weight="bold" className="shrink-0 text-slate-700 dark:text-slate-300 sm:hidden" />
                  <Tag size={14} weight="bold" className="hidden shrink-0 text-slate-700 dark:text-slate-300 sm:block" />
                  <span className="whitespace-nowrap text-[11px] font-medium text-slate-700 dark:text-slate-300 sm:text-xs">
                    {task.tags[0]}
                    {task.tags.length > 1 && ` +${task.tags.length - 1}`}
                  </span>
                </div>
              )}

              {task.delayed && (
                <div className="shrink-0 rounded-lg border border-amber-300/60 bg-amber-100/75 px-2 py-1 dark:border-amber-500/50 dark:bg-amber-900/40 dark:text-amber-300 sm:rounded-xl sm:px-3 sm:py-1.5">
                  <span className="whitespace-nowrap text-[11px] font-medium text-amber-700 dark:text-amber-300 sm:text-xs">
                    Delayed
                  </span>
                </div>
              )}

              {task.recurring && task.recurring !== "none" && (
                <div className="shrink-0 rounded-lg border border-purple-300/60 bg-purple-100/75 px-2 py-1 dark:border-purple-500/50 dark:bg-purple-900/40 dark:text-purple-300 sm:rounded-xl sm:px-3 sm:py-1.5">
                  <span className="whitespace-nowrap text-[11px] font-medium text-purple-700 dark:text-purple-300 sm:text-xs">
                    {task.recurring === "daily" && "Hàng ngày"}
                    {task.recurring === "weekly" && "Hàng tuần"}
                    {task.recurring === "monthly" && "Hàng tháng"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
