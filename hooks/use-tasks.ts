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
      createdAt: new Date().toISOString(),
    }
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    storage.saveTasks(updatedTasks)
    return newTask
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
    updateTask(id, { 
      completed: true, 
      delayed: false,
      completedAt: new Date().toISOString()
    })
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

  const searchTasks = (query: string) => {
    const lowerQuery = query.toLowerCase()
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description?.toLowerCase().includes(lowerQuery) ||
        task.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
  }

  const filterTasks = (filters: {
    category?: string
    priority?: string
    completed?: boolean
    tags?: string[]
  }) => {
    return tasks.filter((task) => {
      if (filters.category && task.category !== filters.category) return false
      if (filters.priority && task.priority !== filters.priority) return false
      if (filters.completed !== undefined && task.completed !== filters.completed)
        return false
      if (
        filters.tags &&
        filters.tags.length > 0 &&
        !filters.tags.some((tag) => task.tags?.includes(tag))
      )
        return false
      return true
    })
  }

  const getTasksByDateRange = (startDate: string, endDate: string) => {
    return tasks.filter((task) => task.date >= startDate && task.date <= endDate)
  }

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    delayTask,
    searchTasks,
    filterTasks,
    getTasksByDateRange,
  }
}
