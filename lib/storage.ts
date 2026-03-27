import { Task, UserProfile } from "@/types"

const TASKS_KEY = "schedule_tasks"
const PROFILE_KEY = "user_profile"

export const storage = {
  getTasks: (): Task[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(TASKS_KEY)
    return data ? JSON.parse(data) : []
  },

  saveTasks: (tasks: Task[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  },

  getProfile: (): UserProfile | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(PROFILE_KEY)
    return data ? JSON.parse(data) : null
  },

  saveProfile: (profile: UserProfile) => {
    if (typeof window === "undefined") return
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  },
}
