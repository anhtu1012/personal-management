"use client"

import { useState, useEffect } from "react"
import { Task } from "@/types"
import { storage } from "@/lib/storage"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadedTasks = storage.getTasks()
    const rafId = requestAnimationFrame(() => {
      setTasks(loadedTasks)
      setLoading(false)
    })

    return () => cancelAnimationFrame(rafId)
  }, [])

  const addTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    }
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    storage.saveTasks(updatedTasks)
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    )
    setTasks(updatedTasks)
    storage.saveTasks(updatedTasks)
  }

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id)
    setTasks(updatedTasks)
    storage.saveTasks(updatedTasks)
  }

  const completeTask = (id: string) => {
    updateTask(id, { completed: true, delayed: false })
  }

  const delayTask = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      const tomorrow = new Date(task.date)
      tomorrow.setDate(tomorrow.getDate() + 1)
      updateTask(id, {
        date: tomorrow.toISOString().split("T")[0],
        delayed: true,
      })
    }
  }

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    delayTask,
  }
}
