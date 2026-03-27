"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, PanInfo } from "framer-motion"
import { format, isSameDay, isToday, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from "date-fns"
import { vi } from "date-fns/locale"
import { CaretDown, CaretUp, CaretLeft, CaretRight } from "@phosphor-icons/react"
import { GlassCard } from "@/components/ui/glass-card"
import { SwipeableTask } from "@/components/ui/swipeable-task"
import { DayDetailModal } from "@/components/ui/day-detail-modal"
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(selectedDate)
  const y = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  })

  // Tạo grid calendar với padding days
  const firstDayOfMonth = startOfMonth(currentMonth)
  const startDay = (firstDayOfMonth.getDay() + 6) % 7 // Convert to Monday = 0
  const paddingDays = Array(startDay).fill(null)
  const calendarDays = [...paddingDays, ...monthDays]

  const getTasksForDay = (day: Date) => {
    return tasks.filter(t => t.date === format(day, "yyyy-MM-dd") && !t.completed)
  }

  const selectedDayTasks = getTasksForDay(selectedDate)

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 80) {
      setIsExpanded(true)
    } else if (info.offset.y < -80) {
      setIsExpanded(false)
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  return (
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
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-300/40 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevMonth}
              className="liquid-panel rounded-lg p-1.5 sm:p-2"
            >
              <CaretLeft size={16} className="text-slate-700 sm:hidden" weight="bold" />
              <CaretLeft size={18} className="hidden text-slate-700 sm:block" weight="bold" />
            </motion.button>

            <div className="text-sm font-semibold capitalize sm:text-base">
              {format(currentMonth, "MMMM yyyy", { locale: vi })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextMonth}
              className="liquid-panel rounded-lg p-1.5 sm:p-2"
            >
              <CaretRight size={16} className="text-slate-700 sm:hidden" weight="bold" />
              <CaretRight size={18} className="hidden text-slate-700 sm:block" weight="bold" />
            </motion.button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-slate-600 transition-colors hover:bg-slate-100/50"
          >
            <span className="text-[10px] font-medium text-slate-500 sm:text-xs">
              {isExpanded ? "Thu gọn" : "Chi tiết"}
            </span>
            {isExpanded ? (
              <>
                <CaretUp size={14} weight="bold" className="sm:hidden" />
                <CaretUp size={16} weight="bold" className="hidden sm:block" />
              </>
            ) : (
              <>
                <CaretDown size={14} weight="bold" className="sm:hidden" />
                <CaretDown size={16} weight="bold" className="hidden sm:block" />
              </>
            )}
          </button>
        </div>

        {/* Compact Calendar View (Default) */}
        {!isExpanded && (
          <div className="p-2.5 sm:p-3">
            {/* Day headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                <div key={day} className="text-center text-[10px] font-semibold text-slate-500 uppercase sm:text-xs">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid - Compact */}
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
                    transition={{ delay: index * 0.008 }}
                    onClick={() => onSelectDate(day)}
                    className={cn(
                      "relative flex aspect-square flex-col items-center justify-center rounded-lg border text-center transition-all sm:rounded-xl",
                      isSelected
                        ? "border-slate-300/70 bg-white/90 text-slate-800 shadow-md"
                        : "border-slate-300/30 bg-white/50 hover:border-slate-400/60 hover:bg-white/80",
                      isTodayDate && !isSelected && "ring-1 ring-sky-300/70 sm:ring-2",
                      !isCurrentMonth && "opacity-40"
                    )}
                  >
                    <span className={cn(
                      "text-xs font-semibold sm:text-sm",
                      isSelected && "text-slate-900"
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

            {/* Tasks below calendar - Default view */}
            <div className="mt-3 rounded-xl border border-slate-300/40 bg-white/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  {format(selectedDate, "dd MMMM", { locale: vi })}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    {selectedDayTasks.length} task{selectedDayTasks.length !== 1 ? 's' : ''}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-lg border border-slate-300/60 bg-white/80 px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-white"
                  >
                    Chi tiết
                  </motion.button>
                </div>
              </div>
              
              {selectedDayTasks.length > 0 ? (
                <div className="space-y-2">
                  {selectedDayTasks.slice(0, 3).map((task) => (
                    <SwipeableTask
                      key={task.id}
                      task={task}
                      onComplete={() => onCompleteTask?.(task.id)}
                      onDelete={() => onDeleteTask?.(task.id)}
                      onClick={() => {}}
                    />
                  ))}
                  {selectedDayTasks.length > 3 && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full rounded-lg border border-slate-300/50 bg-white/70 py-2 text-xs font-medium text-slate-600 transition hover:bg-white"
                    >
                      Xem thêm {selectedDayTasks.length - 3} task
                    </button>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-slate-600">
                    Không có task nào
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expanded Calendar View with Tasks in cells */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-2.5 sm:p-3"
          >
            {/* Day headers */}
            <div className="mb-2 grid grid-cols-7 gap-1 sm:gap-1.5">
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                <div key={day} className="text-center text-[9px] font-semibold text-slate-500 uppercase sm:text-[10px]">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid - Expanded with tasks inside */}
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
                    transition={{ delay: index * 0.008 }}
                    onClick={() => onSelectDate(day)}
                    className={cn(
                      "group relative flex min-h-28 cursor-pointer flex-col overflow-hidden rounded-lg border transition-all sm:min-h-32 sm:rounded-xl",
                      isSelected
                        ? "border-slate-400/70 bg-white/95 shadow-md"
                        : "border-slate-300/30 bg-white/50 hover:border-slate-400/60 hover:bg-white/80",
                      isTodayDate && !isSelected && "ring-2 ring-sky-400/50",
                      !isCurrentMonth && "opacity-40"
                    )}
                  >
                    {/* Date header with gradient background */}
                    <div className={cn(
                      "flex items-center justify-between border-b px-1.5 py-1",
                      isSelected 
                        ? "border-slate-300/50 bg-gradient-to-r from-slate-100/80 to-slate-50/80" 
                        : "border-slate-200/40 bg-slate-50/30"
                    )}>
                      <span className={cn(
                        "text-xs font-bold sm:text-sm",
                        isSelected ? "text-slate-900" : "text-slate-700"
                      )}>
                        {format(day, "d")}
                      </span>
                      {dayTasks.length > 0 && (
                        <span className={cn(
                          "rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none",
                          isSelected 
                            ? "bg-slate-800 text-white" 
                            : "bg-slate-700/90 text-white"
                        )}>
                          {dayTasks.length}
                        </span>
                      )}
                    </div>

                    {/* Tasks list in cell */}
                    <div className="flex-1 space-y-1 overflow-hidden p-1">
                      {dayTasks.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-[9px] text-slate-400">-</span>
                        </div>
                      ) : (
                        <>
                          {dayTasks.slice(0, 2).map((task) => (
                            <div
                              key={task.id}
                              className={cn(
                                "group/task relative overflow-hidden rounded-md border px-1.5 py-1 transition-all",
                                task.category === "work" && "border-sky-300/60 bg-sky-50/80",
                                task.category === "personal" && "border-indigo-300/60 bg-indigo-50/80",
                                task.category === "health" && "border-emerald-300/60 bg-emerald-50/80",
                                task.category === "other" && "border-slate-300/60 bg-slate-50/80"
                              )}
                            >
                              {/* Color bar on left */}
                              <div className={cn(
                                "absolute inset-y-0 left-0 w-0.5",
                                task.category === "work" && "bg-sky-500",
                                task.category === "personal" && "bg-indigo-500",
                                task.category === "health" && "bg-emerald-500",
                                task.category === "other" && "bg-slate-500"
                              )} />
                              
                              <div className="pl-1">
                                {task.time && (
                                  <div className={cn(
                                    "mb-0.5 text-[8px] font-semibold leading-none",
                                    task.category === "work" && "text-sky-700",
                                    task.category === "personal" && "text-indigo-700",
                                    task.category === "health" && "text-emerald-700",
                                    task.category === "other" && "text-slate-700"
                                  )}>
                                    {task.time}
                                  </div>
                                )}
                                <div className={cn(
                                  "line-clamp-2 text-[9px] font-medium leading-tight sm:text-[10px]",
                                  task.category === "work" && "text-sky-900",
                                  task.category === "personal" && "text-indigo-900",
                                  task.category === "health" && "text-emerald-900",
                                  task.category === "other" && "text-slate-900"
                                )}>
                                  {task.title}
                                </div>
                              </div>
                            </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <div className="rounded-md border border-slate-300/40 bg-slate-100/50 px-1.5 py-1 text-center">
                              <span className="text-[9px] font-semibold text-slate-600">
                                +{dayTasks.length - 2} task{dayTasks.length - 2 > 1 ? 's' : ''}
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
          <div className="h-1 w-12 rounded-full bg-slate-300/50" />
        </div>
      </motion.div>

      {/* Day Detail Modal */}
      <DayDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onDateChange={onSelectDate}
        tasks={tasks}
        onCompleteTask={onCompleteTask}
        onDeleteTask={onDeleteTask}
      />
    </GlassCard>
  )
}
