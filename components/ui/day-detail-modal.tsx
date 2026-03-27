"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from "framer-motion"
import { format, addDays, subDays } from "date-fns"
import { vi } from "date-fns/locale"
import { X, CaretLeft, CaretRight } from "@phosphor-icons/react"
import { SwipeableTask } from "@/components/ui/swipeable-task"
import { Task } from "@/types"

interface DayDetailModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
  onDateChange: (date: Date) => void
  tasks: Task[]
  onCompleteTask?: (id: string) => void
  onDeleteTask?: (id: string) => void
}

export function DayDetailModal({
  isOpen,
  onClose,
  selectedDate,
  onDateChange,
  tasks,
  onCompleteTask,
  onDeleteTask
}: DayDetailModalProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate)
  const [mounted, setMounted] = useState(false)
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setCurrentDate(selectedDate)
  }, [selectedDate])

  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return tasks.filter(t => t.date === dateStr && !t.completed)
  }

  const currentTasks = getTasksForDate(currentDate)

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      // Swipe right - previous day
      handlePrevDay()
    } else if (info.offset.x < -100) {
      // Swipe left - next day
      handleNextDay()
    }
  }

  const handlePrevDay = () => {
    const newDate = subDays(currentDate, 1)
    setCurrentDate(newDate)
    onDateChange(newDate)
  }

  const handleNextDay = () => {
    const newDate = addDays(currentDate, 1)
    setCurrentDate(newDate)
    onDateChange(newDate)
  }

  if (!isOpen) return null
  if (!mounted) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="absolute inset-0 flex items-end justify-center sm:items-center sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl"
            >
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                style={{ x, opacity }}
                className="liquid-sheet max-h-[85vh] w-full overflow-hidden sm:rounded-3xl"
              >
                {/* Header */}
                <div className="sticky top-0 z-10 border-b border-slate-300/40 bg-white/95 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrevDay}
                        className="liquid-panel rounded-lg p-2"
                      >
                        <CaretLeft size={18} weight="bold" className="text-slate-700" />
                      </motion.button>

                      <div>
                        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                          {format(currentDate, "dd MMMM yyyy", { locale: vi })}
                        </h2>
                        <p className="text-xs text-slate-600 sm:text-sm">
                          {format(currentDate, "EEEE", { locale: vi })}
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNextDay}
                        className="liquid-panel rounded-lg p-2"
                      >
                        <CaretRight size={18} weight="bold" className="text-slate-700" />
                      </motion.button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="liquid-panel rounded-lg p-2"
                    >
                      <X size={20} weight="bold" className="text-slate-700" />
                    </motion.button>
                  </div>

                  {/* Stats */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="rounded-lg border border-slate-300/50 bg-white/70 px-3 py-1.5">
                      <span className="text-xs text-slate-600">Tổng: </span>
                      <span className="text-sm font-bold text-slate-900">{currentTasks.length}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Vuốt trái/phải để xem ngày khác
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-4 sm:p-6" style={{ maxHeight: "calc(85vh - 140px)" }}>
                  {currentTasks.length > 0 ? (
                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {currentTasks.map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            layout
                          >
                            <SwipeableTask
                              task={task}
                              onComplete={() => onCompleteTask?.(task.id)}
                              onDelete={() => onDeleteTask?.(task.id)}
                              onClick={() => {}}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12"
                    >
                      <div className="rounded-full bg-slate-100 p-6">
                        <svg
                          className="h-12 w-12 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <p className="mt-4 text-base font-medium text-slate-700">
                        Không có task nào
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Ngày này chưa có công việc nào
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Swipe indicator */}
                <div className="flex justify-center pb-3 pt-1">
                  <div className="h-1 w-12 rounded-full bg-slate-300/50" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}
