"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lightning, Plus, Trash } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Navigation } from "@/components/ui/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTasks } from "@/hooks/use-tasks"
import { Task, Priority } from "@/types"
import { cn } from "@/lib/utils"

interface TaskTemplate {
  id: string
  name: string
  title: string
  description?: string
  category?: Task["category"]
  priority?: Priority
  estimatedTime?: string
}

const DEFAULT_TEMPLATES: TaskTemplate[] = [
  {
    id: "1",
    name: "Họp team",
    title: "Họp team hàng tuần",
    description: "Review tiến độ và lên kế hoạch tuần mới",
    category: "work",
    priority: "high",
    estimatedTime: "1h",
  },
  {
    id: "2",
    name: "Tập gym",
    title: "Tập gym buổi sáng",
    description: "Cardio 20 phút + Tạ 40 phút",
    category: "health",
    priority: "medium",
    estimatedTime: "1h",
  },
  {
    id: "3",
    name: "Đọc sách",
    title: "Đọc sách 30 phút",
    description: "Đọc sách phát triển bản thân",
    category: "personal",
    priority: "medium",
    estimatedTime: "30m",
  },
  {
    id: "4",
    name: "Review code",
    title: "Review pull requests",
    description: "Kiểm tra và review code của team",
    category: "work",
    priority: "high",
    estimatedTime: "45m",
  },
]

export default function TemplatesPage() {
  const router = useRouter()
  const { addTask } = useTasks()
  const [templates, setTemplates] = useState<TaskTemplate[]>(() => {
    if (typeof window === "undefined") return DEFAULT_TEMPLATES
    const saved = localStorage.getItem("task_templates")
    return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTemplate, setNewTemplate] = useState<Partial<TaskTemplate>>({
    category: "personal",
    priority: "medium",
  })

  const saveTemplates = (newTemplates: TaskTemplate[]) => {
    setTemplates(newTemplates)
    localStorage.setItem("task_templates", JSON.stringify(newTemplates))
  }

  const handleUseTemplate = (template: TaskTemplate) => {
    const today = new Date().toISOString().split("T")[0]
    addTask({
      title: template.title,
      description: template.description,
      date: today,
      category: template.category,
      priority: template.priority,
      completed: false,
      delayed: false,
    })
    router.push("/")
  }

  const handleDeleteTemplate = (id: string) => {
    if (confirm("Xóa template này?")) {
      saveTemplates(templates.filter((t) => t.id !== id))
    }
  }

  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.title) return

    const template: TaskTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      title: newTemplate.title,
      description: newTemplate.description,
      category: newTemplate.category,
      priority: newTemplate.priority,
      estimatedTime: newTemplate.estimatedTime,
    }

    saveTemplates([...templates, template])
    setNewTemplate({ category: "personal", priority: "medium" })
    setShowAddForm(false)
  }

  return (
    <div className="liquid-page">
      <span className="liquid-orb liquid-orb-indigo -top-16 -left-8 h-40 w-40 sm:h-52 sm:w-52" />
      <span className="liquid-orb liquid-orb-emerald top-30 -right-10 h-44 w-44 sm:h-56 sm:w-56" />

      <div className="liquid-container relative z-10 w-full max-w-2xl space-y-4">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="liquid-panel rounded-xl p-2 transition-transform duration-200 active:scale-95"
            >
              <ArrowLeft size={20} weight="bold" className="text-slate-700 dark:text-slate-300" />
            </button>
            <div className="flex items-center gap-2">
              <div className="liquid-panel flex size-10 items-center justify-center rounded-2xl">
                <Lightning size={22} weight="fill" className="text-slate-700 dark:text-slate-300" />
              </div>
              <h1 className="liquid-title text-2xl font-bold tracking-tight sm:text-3xl">
                Mẫu Task
              </h1>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="liquid-panel flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 transition-transform duration-200 active:scale-95 dark:text-slate-100"
          >
            <Plus size={18} weight="bold" />
            <span className="hidden sm:inline">Thêm</span>
          </button>
        </motion.header>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard variant="strong" className="p-4">
              <h3 className="mb-3 text-sm font-semibold dark:text-slate-100">Tạo mẫu mới</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="template-name" className="mb-1.5 block text-xs dark:text-slate-300">
                    Tên mẫu
                  </Label>
                  <Input
                    id="template-name"
                    value={newTemplate.name || ""}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, name: e.target.value })
                    }
                    placeholder="VD: Họp team"
                    className="h-9 rounded-xl dark:border-slate-600/60 dark:bg-slate-800/75 dark:text-slate-100"
                  />
                </div>
                <div>
                  <Label htmlFor="template-title" className="mb-1.5 block text-xs dark:text-slate-300">
                    Tiêu đề task
                  </Label>
                  <Input
                    id="template-title"
                    value={newTemplate.title || ""}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, title: e.target.value })
                    }
                    placeholder="VD: Họp team hàng tuần"
                    className="h-9 rounded-xl dark:border-slate-600/60 dark:bg-slate-800/75 dark:text-slate-100"
                  />
                </div>
                <div>
                  <Label htmlFor="template-desc" className="mb-1.5 block text-xs dark:text-slate-300">
                    Mô tả
                  </Label>
                  <Textarea
                    id="template-desc"
                    value={newTemplate.description || ""}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, description: e.target.value })
                    }
                    placeholder="Mô tả chi tiết..."
                    rows={2}
                    className="rounded-xl dark:border-slate-600/60 dark:bg-slate-800/75 dark:text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="rounded-xl border border-slate-300/60 bg-white/78 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-600/60 dark:bg-slate-800/78 dark:text-slate-200"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddTemplate}
                    className="rounded-xl border border-emerald-400/70 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-500/60 dark:bg-emerald-900/30 dark:text-emerald-300"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="group relative p-4 transition-all hover:shadow-lg">
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="absolute right-2 top-2 rounded-lg p-1.5 opacity-0 transition-opacity hover:bg-red-100 group-hover:opacity-100 dark:hover:bg-red-900/30"
                >
                  <Trash size={14} className="text-red-600 dark:text-red-400" />
                </button>

                <h3 className="mb-1 pr-8 text-sm font-bold text-slate-800 dark:text-slate-100">
                  {template.name}
                </h3>
                <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">{template.title}</p>

                {template.description && (
                  <p className="mb-3 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                    {template.description}
                  </p>
                )}

                <div className="mb-3 flex flex-wrap gap-1.5">
                  {template.category && (
                    <span
                      className={cn(
                        "rounded-lg px-2 py-1 text-[10px] font-medium",
                        template.category === "work" &&
                          "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
                        template.category === "personal" &&
                          "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
                        template.category === "health" &&
                          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                        template.category === "other" &&
                          "bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-300"
                      )}
                    >
                      {template.category === "work" && "Công việc"}
                      {template.category === "personal" && "Cá nhân"}
                      {template.category === "health" && "Sức khỏe"}
                      {template.category === "other" && "Khác"}
                    </span>
                  )}
                  {template.estimatedTime && (
                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-700 dark:bg-slate-700/30 dark:text-slate-300">
                      {template.estimatedTime}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleUseTemplate(template)}
                  className="w-full rounded-lg border border-slate-300/60 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-white dark:border-slate-600/60 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Sử dụng mẫu
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {templates.length === 0 && (
          <GlassCard className="p-8 text-center">
            <Lightning size={42} className="mx-auto text-slate-400 dark:text-slate-500" weight="duotone" />
            <p className="mt-3 text-base text-slate-700 dark:text-slate-300">Chưa có mẫu nào</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Nhấn nút &quot;Thêm&quot; để tạo mẫu task
            </p>
          </GlassCard>
        )}
      </div>

      <Navigation />
    </div>
  )
}
