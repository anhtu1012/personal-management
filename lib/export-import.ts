import { Task } from "@/types"

export const exportData = {
  toJSON: (tasks: Task[]): string => {
    return JSON.stringify(tasks, null, 2)
  },

  downloadJSON: (tasks: Task[], filename = "tasks-export.json") => {
    const json = exportData.toJSON(tasks)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  },

  toCSV: (tasks: Task[]): string => {
    const headers = [
      "ID",
      "Tiêu đề",
      "Mô tả",
      "Ngày",
      "Giờ",
      "Hoàn thành",
      "Danh mục",
      "Ưu tiên",
      "Tags",
    ]
    const rows = tasks.map((task) => [
      task.id,
      task.title,
      task.description || "",
      task.date,
      task.time || "",
      task.completed ? "Có" : "Không",
      task.category || "",
      task.priority || "",
      task.tags?.join(";") || "",
    ])

    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  },

  downloadCSV: (tasks: Task[], filename = "tasks-export.csv") => {
    const csv = exportData.toCSV(tasks)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  },
}

export const importData = {
  fromJSON: (jsonString: string): Task[] => {
    try {
      const data = JSON.parse(jsonString)
      if (Array.isArray(data)) {
        return data
      }
      throw new Error("Invalid JSON format")
    } catch (error) {
      console.error("Import error:", error)
      return []
    }
  },

  fromFile: (file: File): Promise<Task[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const tasks = importData.fromJSON(content)
          resolve(tasks)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  },
}
