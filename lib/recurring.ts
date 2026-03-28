import { Task, RecurringType } from "@/types"

export const recurring = {
  getNextDate: (currentDate: string, type: RecurringType): string => {
    const date = new Date(currentDate)

    switch (type) {
      case "daily":
        date.setDate(date.getDate() + 1)
        break
      case "weekly":
        date.setDate(date.getDate() + 7)
        break
      case "monthly":
        date.setMonth(date.getMonth() + 1)
        break
      default:
        return currentDate
    }

    return date.toISOString().split("T")[0]
  },

  shouldCreateNext: (task: Task): boolean => {
    if (!task.recurring || task.recurring === "none") return false
    if (!task.completed) return false

    if (task.recurringEndDate) {
      const endDate = new Date(task.recurringEndDate)
      const nextDate = new Date(recurring.getNextDate(task.date, task.recurring))
      return nextDate <= endDate
    }

    return true
  },

  createNextTask: (task: Task): Omit<Task, "id"> => {
    const nextDate = recurring.getNextDate(task.date, task.recurring!)

    return {
      ...task,
      date: nextDate,
      completed: false,
      delayed: false,
      parentTaskId: task.parentTaskId || task.id,
      completedAt: undefined,
    }
  },
}
