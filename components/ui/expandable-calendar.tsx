"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, PanInfo, AnimatePresence } from "framer-motion"
import { format, isSameDay, isToday, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from "date-fns"
import { vi } from "date-fns/locale"
import { CaretDown, CaretUp, CaretLeft, CaretRight, X } from "@phosphor-icons/react/dist/ssr"
import { GlassCard } from "@/components/ui/glass-card"
import { SwipeableTask } from "@/components/ui/swipeable-task"
import { TaskDetailModal } from "@/components/ui/task-detail-modal"
import { cn } from "@/lib/utils"
import { Task } from "@/types"

interface ExpandableCalendarProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
  tasks: Task[]
  onCompleteTask?: (id: string) => void
  onDeleteTask?: (id: string) => void
}

export function ExpandableCalendar({ 
  selectedDate, 
  onSelectDate, 
  tasks,
  onCompleteTask,
  onDeleteTask 
}: ExpandableCalendarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [currentMonth, setCurrentMonth] = useState(selectedDate)
  const [showDayModal, setShowDayModal] = useState(false)
  const [modalDayTasks, setModalDayTasks] = useState<Task[]>([])
  const [modalDate, setModalDate] = useState<Date | null>(null)
  const y = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  })

  const firstDayOfMonth = startOfMonth(currentMonth)
  const startDay = (firstDayOfMonth.getDay() + 6) % 7
  const paddingDays = Array(startDay).fill(null)
  const calendarDays = [...paddingDays, ...monthDays]

  const getTasksForDay = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd")
    return tasks.filter(t => t.date === dateStr)
  }

  const selectedDayTasks = getTasksForDay(selectedDate)

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 80) {
      setIsExpanded(true)
    } else if (info.offset.y < -80) {
      setIsExpanded(false)
    }
  }

  const handleDayClick = (day: Date) => {
    if (isExpanded) {
      // In expanded view, open modal with tasks
      const dayTasks = getTasksForDay(day)
      if (dayTasks.length > 0) {
        setModalDate(day)
        setModalDayTasks(dayTasks)
        setShowDayModal(true)
      }
    } else {
      // In compact view, just select the date
      onSelectDate(day)
    }
  }

  return (
    <>
      <GlassCard variant="strong" className="w-full overflow-hidden p-0" glow="none">
        <motion.div
          ref={containerRef}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ y }}
          className="relative"
        >
          {/* Header with liquid glass */}
          <div className="liquid-panel flex items-center justify-between border-b border-slate-300/40 px-3 py-2.5 dark:border-slate-600/40 sm:px-4 sm:py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="liquid-chip rounded-lg p-1.5 transition-transform duration-200 active:scale-95 sm:p-2"
              >
                <CaretLeft size={16} className="text-slate-700 dark:text-slate-300 sm:hidden" weight="bold" />
                <CaretLeft size={18} className="hidden text-slate-700 dark:text-slate-300 sm:block" weight="bold" />
              </button>

              <div className="text-sm font-semibold capitalize text-slate-800 dark:text-slate-100 sm:text-base">
                {format(currentMonth, "MMMM yyyy", { locale: vi })}
              </div>

              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="liquid-chip rounded-lg p-1.5 transition-transform duration-200 active:scale-95 sm:p-2"
              >
                <CaretRight size={16} className="text-slate-700 dark:text-slate-300 sm:hidden" weight="bold" />
                <CaretRight size={18} className="hidden text-slate-700 dark:text-slate-300 sm:block" weight="bold" />
              </button>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="liquid-chip flex items-center gap-1 rounded-lg px-2 py-1 transition-transform duration-200 active:scale-95"
            >
              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 sm:text-xs">
                {isExpanded ? "Thu gọn" : "Chi tiết"}
              </span>
              {isExpanded ? (
                <>
                  <CaretUp size={14} weight="bold" className="text-slate-600 dark:text-slate-400 sm:hidden" />
                  <CaretUp size={16} weight="bold" className="hidden text-slate-600 dark:text-slate-400 sm:block" />
                </>
              ) : (
                <>
                  <CaretDown size={14} weight="bold" className="text-slate-600 dark:text-slate-400 sm:hidden" />
                  <CaretDown size={16} weight="bold" className="hidden text-slate-600 dark:text-slate-400 sm:block" />
                </>
              )}
            </button>
          </div>

          {/* Compact View */}
          {!isExpanded && (
            <div className="p-2.5 sm:p-3">
              {/* Day headers */}
              <div className="mb-2 grid grid-cols-7 gap-1">
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                  <div key={day} className="text-center text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-400 sm:text-xs">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid - Liquid glass cells */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="aspect-square" />
                  }

                  const isSelected = isSameDay(day, selectedDate)
                  const isTodayDate = isToday(day)
                  const dayTasks = getTasksForDay(day)
                  const isCurrentMonth = isSameMonth(day, currentMonth)

                  return (
                    <motion.button
                      key={day.toISOString()}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.008, duration: 0.2 }}
                      onClick={() => handleDayClick(day)}
                      className={cn(
                        "glass relative flex aspect-square flex-col items-center justify-center rounded-lg text-center transition-all sm:rounded-xl",
                        isSelected && "ring-2 ring-slate-400/60 dark:ring-slate-500/60",
                        isTodayDate && !isSelected && "ring-2 ring-sky-400/50 dark:ring-sky-500/50",
                        !isCurrentMonth && "opacity-40"
                      )}
                    >
                      <span className={cn(
                        "text-xs font-semibold sm:text-sm",
                        isSelected ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"
                      )}>
                        {format(day, "d")}
                      </span>
                      
                      {dayTasks.length > 0 && (
                        <div className="absolute bottom-0.5 flex gap-0.5 sm:bottom-1">
                          {dayTasks.slice(0, 3).map((task, i) => (
                            <span 
                              key={i} 
                              className={cn(
                                "h-1 w-1 rounded-full",
                                task.category === "work" && "bg-sky-500",
                                task.category === "personal" && "bg-indigo-500",
                                task.category === "health" && "bg-emerald-500",
                                task.category === "other" && "bg-slate-500"
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Tasks below - Liquid glass */}
              <div className="glass mt-3 rounded-xl p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {format(selectedDate, "dd MMMM", { locale: vi })}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {selectedDayTasks.length} task{selectedDayTasks.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {selectedDayTasks.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDayTasks.slice(0, 3).map((task) => (
                      <SwipeableTask
                        key={task.id}
                        task={task}
                        onComplete={() => onCompleteTask?.(task.id)}
                        onDelete={() => onDeleteTask?.(task.id)}
                        onClick={() => setSelectedTask(task)}
                      />
                    ))}
                    {selectedDayTasks.length > 3 && (
                      <button
                        onClick={() => setSelectedTask(selectedDayTasks[3])}
                        className="liquid-chip w-full rounded-lg py-2 text-xs font-medium dark:text-slate-300"
                      >
                        Xem thêm {selectedDayTasks.length - 3} task
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Không có task nào
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Expanded View */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-2.5 sm:p-3"
            >
              {/* Day headers */}
              <div className="mb-2 grid grid-cols-7 gap-1 sm:gap-1.5">
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                  <div key={day} className="text-center text-[9px] font-semibold uppercase text-slate-600 dark:text-slate-400 sm:text-[10px]">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid - Expanded with liquid glass */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="min-h-28 sm:min-h-32" />
                  }

                  const isSelected = isSameDay(day, selectedDate)
                  const isTodayDate = isToday(day)
                  const dayTasks = getTasksForDay(day)
                  const isCurrentMonth = isSameMonth(day, currentMonth)

                  return (
                    <motion.div
                      key={day.toISOString()}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.008, duration: 0.2 }}
                      onClick={() => handleDayClick(day)}
                      className={cn(
                        "glass group relative flex min-h-28 cursor-pointer flex-col overflow-hidden rounded-lg transition-all sm:min-h-32 sm:rounded-xl",
                        isSelected && "ring-2 ring-slate-400/60 dark:ring-slate-500/60",
                        isTodayDate && !isSelected && "ring-2 ring-sky-400/50 dark:ring-sky-500/50",
                        !isCurrentMonth && "opacity-40"
                      )}
                    >
                      {/* Date header */}
                      <div className={cn(
                        "liquid-chip flex items-center justify-between border-b px-1.5 py-1",
                        isSelected && "border-slate-400/40 dark:border-slate-500/40"
                      )}>
                        <span className={cn(
                          "text-xs font-bold sm:text-sm",
                          isSelected ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"
                        )}>
                          {format(day, "d")}
                        </span>
                        {dayTasks.length > 0 && (
                          <span className="liquid-chip rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none dark:text-slate-300">
                            {dayTasks.length}
                          </span>
                        )}
                      </div>

                      {/* Tasks in cell */}
                      <div className="flex-1 space-y-1 overflow-hidden p-1">
                        {dayTasks.length === 0 ? (
                          <div className="flex h-full items-center justify-center">
                            <span className="text-[9px] text-slate-400 dark:text-slate-500">-</span>
                          </div>
                        ) : (
                          <>
                            {dayTasks.slice(0, 2).map((task) => (
                              <div
                                key={task.id}
                                className={cn(
                                  "glass-subtle group/task relative overflow-hidden rounded-md px-1.5 py-1 transition-all",
                                  task.category === "work" && "border-l-2 border-sky-500",
                                  task.category === "personal" && "border-l-2 border-indigo-500",
                                  task.category === "health" && "border-l-2 border-emerald-500",
                                  task.category === "other" && "border-l-2 border-slate-500"
                                )}
                              >
                                {task.time && (
                                  <div className="mb-0.5 text-[8px] font-semibold leading-none text-slate-600 dark:text-slate-400">
                                    {task.time}
                                  </div>
                                )}
                                <div className="line-clamp-2 text-[9px] font-medium leading-tight text-slate-800 dark:text-slate-200 sm:text-[10px]">
                                  {task.title}
                                </div>
                              </div>
                            ))}
                            {dayTasks.length > 2 && (
                              <div className="liquid-chip rounded-md px-1.5 py-1 text-center">
                                <span className="text-[9px] font-semibold dark:text-slate-300">
                                  +{dayTasks.length - 2}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Drag indicator */}
          <div className="flex justify-center pb-2 pt-1">
            <div className="h-1 w-12 rounded-full bg-slate-400/40 dark:bg-slate-500/40" />
          </div>
        </motion.div>

        {/* Task Detail Modal */}
        {selectedTask && (
          <TaskDetailModal
            isOpen={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            task={selectedTask}
            allTasks={selectedDayTasks}
            onComplete={onCompleteTask}
            onDelete={onDeleteTask}
            onNavigate={(task) => setSelectedTask(task)}
          />
        )}
      </GlassCard>

      {/* Day Tasks Modal */}
      <AnimatePresence>
        {showDayModal && modalDate && (
          <div className="fixed inset-0 z-9999 flex items-end sm:items-center sm:justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDayModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md dark:bg-black/80"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative z-10 w-full sm:mx-4 sm:max-w-2xl lg:max-w-3xl"
            >
              <div className="glass-strong overflow-hidden rounded-t-3xl shadow-2xl sm:rounded-3xl">
                {/* Header */}
                <div className="liquid-panel relative border-b border-slate-300/40 px-4 py-3 dark:border-slate-600/40 sm:px-5 sm:py-4">
                  {/* Swipe Indicator */}
                  <div className="mb-2 flex justify-center sm:hidden">
                    <div className="h-1 w-12 rounded-full bg-slate-400/60 dark:bg-slate-500/60" />
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl">
                        {format(modalDate, "dd MMMM yyyy", { locale: vi })}
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                        {modalDayTasks.length} task{modalDayTasks.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowDayModal(false)}
                      className="liquid-chip flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-105 sm:h-9 sm:w-9"
                    >
                      <X size={18} weight="bold" className="text-slate-700 dark:text-slate-300 sm:hidden" />
                      <X size={20} weight="bold" className="hidden text-slate-700 dark:text-slate-300 sm:block" />
                    </button>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="max-h-[60vh] overflow-y-auto p-4 sm:max-h-[65vh] sm:p-5">
                  <div className="space-y-3">
                    {modalDayTasks.map((task) => (
                      <SwipeableTask
                        key={task.id}
                        task={task}
                        onComplete={() => onCompleteTask?.(task.id)}
                        onDelete={() => onDeleteTask?.(task.id)}
                        onClick={() => {
                          setSelectedTask(task)
                          setShowDayModal(false)
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
