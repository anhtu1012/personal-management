"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Gear,
  Bell,
  Download,
  Upload,
  Trash,
  Lightning,
} from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { useTasks } from "@/hooks/use-tasks"
import { GlassCard } from "@/components/ui/glass-card"
import { Navigation } from "@/components/ui/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { notifications } from "@/lib/notifications"
import { exportData, importData } from "@/lib/export-import"
import { storage } from "@/lib/storage"

export default function SettingsPage() {
  const router = useRouter()
  const { tasks } = useTasks()
  
  // Initialize state from Notification permission
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission === "granted"
    }
    return false
  })

  const handleToggleNotifications = async () => {
    if (notificationsEnabled) {
      // Cannot programmatically disable - show alert
      alert(
        "Để tắt thông báo, vui lòng vào cài đặt trình duyệt:\n\n" +
        "Chrome: Settings → Privacy → Site Settings → Notifications\n" +
        "Safari: Settings → Safari → Notifications"
      )
      return
    }

    // Request permission
    const granted = await notifications.requestPermission()
    setNotificationsEnabled(granted)
    
    if (granted) {
      notifications.show("✅ Thông báo đã bật", {
        body: "Bạn sẽ nhận được nhắc nhở về tasks",
      })
    } else {
      alert(
        "Không thể bật thông báo. Vui lòng kiểm tra cài đặt trình duyệt và cho phép thông báo cho trang web này."
      )
    }
  }

  const handleExportJSON = () => {
    exportData.downloadJSON(tasks)
  }

  const handleExportCSV = () => {
    exportData.downloadCSV(tasks)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const importedTasks = await importData.fromFile(file)
      if (importedTasks.length > 0) {
        storage.saveTasks(importedTasks)
        alert(`Đã import ${importedTasks.length} tasks thành công!`)
        window.location.reload()
      }
    } catch {
      alert("Lỗi khi import file. Vui lòng kiểm tra định dạng file.")
    }
  }

  const handleClearData = () => {
    if (
      confirm(
        "Bạn có chắc muốn xóa toàn bộ dữ liệu? Hành động này không thể hoàn tác!"
      )
    ) {
      storage.saveTasks([])
      notifications.clearAllReminders()
      alert("Đã xóa toàn bộ dữ liệu!")
      window.location.reload()
    }
  }

  return (
    <div className="liquid-page">
      <span className="liquid-orb liquid-orb-sky -top-16 -left-8 h-40 w-40 sm:h-52 sm:w-52" />
      <span className="liquid-orb liquid-orb-indigo top-30 -right-10 h-44 w-44 sm:h-56 sm:w-56" />

      <div className="liquid-container relative z-10 w-full max-w-full space-y-3 overflow-hidden sm:space-y-5">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          <button
            onClick={() => router.back()}
            className="liquid-panel rounded-xl p-2 transition-transform duration-200 active:scale-95 sm:p-2.5"
          >
            <ArrowLeft size={18} weight="bold" className="text-slate-700 dark:text-slate-300 sm:hidden" />
            <ArrowLeft size={20} weight="bold" className="hidden text-slate-700 dark:text-slate-300 sm:block" />
          </button>
          <div className="flex items-center gap-2">
            <div className="liquid-panel flex size-8 items-center justify-center rounded-xl sm:size-10 sm:rounded-2xl">
              <Gear size={18} weight="fill" className="text-slate-700 dark:text-slate-300 sm:hidden" />
              <Gear size={22} weight="fill" className="hidden text-slate-700 dark:text-slate-300 sm:block" />
            </div>
            <h1 className="liquid-title text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
              Cài đặt
            </h1>
          </div>
        </motion.header>

        <GlassCard variant="strong" className="p-4 sm:p-5" glow="none">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold dark:text-slate-100 sm:text-base">
            <Gear size={18} weight="bold" className="dark:text-slate-300" />
            Giao diện
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Chế độ hiển thị</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chọn giao diện sáng, tối hoặc tự động
              </p>
            </div>
            <ThemeToggle />
          </div>
        </GlassCard>

        <GlassCard variant="strong" className="p-4 sm:p-5" glow="none">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold dark:text-slate-100 sm:text-base">
            <Lightning size={18} weight="bold" className="dark:text-slate-300" />
            Mẫu task
          </h3>
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            Tạo và quản lý các mẫu task để tạo nhanh
          </p>
          <button
            onClick={() => router.push("/templates")}
            className="w-full rounded-xl border border-slate-300/60 bg-white/90 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white dark:border-slate-600/60 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Quản lý mẫu task
          </button>
        </GlassCard>

        <GlassCard variant="strong" className="p-4 sm:p-5" glow="none">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold dark:text-slate-100 sm:text-base">
            <Bell size={18} weight="fill" className="dark:text-slate-300" />
            Thông báo
          </h3>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Nhắc nhở tasks</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Nhận thông báo khi đến giờ làm task
              </p>
              {notificationsEnabled && (
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                  ✓ Đã bật - Để tắt, vào cài đặt trình duyệt
                </p>
              )}
              {!notificationsEnabled && (
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  ⚠ Chưa bật - Nhấn để kích hoạt
                </p>
              )}
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                notificationsEnabled ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <motion.span
                animate={{
                  x: notificationsEnabled ? 20 : 0,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md"
              />
            </button>
          </div>
          
          {!notificationsEnabled && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/50 dark:bg-amber-900/20">
              <p className="text-xs text-amber-800 dark:text-amber-300">
                💡 <strong>Lưu ý:</strong> Sau khi bật, nhớ điền giờ khi tạo task để nhận thông báo.
              </p>
            </div>
          )}

          <button
            onClick={() => router.push("/test-notification")}
            className="mt-3 w-full rounded-xl border border-blue-300/60 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-700/50 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40"
          >
            🧪 Test thông báo
          </button>
        </GlassCard>

        <GlassCard variant="strong" className="p-4 sm:p-5" glow="none">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold dark:text-slate-100 sm:text-base">
            <Download size={18} weight="bold" className="dark:text-slate-300" />
            Xuất dữ liệu
          </h3>
          <div className="space-y-2">
            <button
              onClick={handleExportJSON}
              className="w-full rounded-xl border border-slate-300/60 bg-white/90 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-white dark:border-slate-600/60 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Xuất file JSON
            </button>
            <button
              onClick={handleExportCSV}
              className="w-full rounded-xl border border-slate-300/60 bg-white/90 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-white dark:border-slate-600/60 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Xuất file CSV
            </button>
          </div>
        </GlassCard>

        <GlassCard variant="strong" className="p-4 sm:p-5" glow="none">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold dark:text-slate-100 sm:text-base">
            <Upload size={18} weight="bold" className="dark:text-slate-300" />
            Nhập dữ liệu
          </h3>
          <label className="block w-full cursor-pointer rounded-xl border border-slate-300/60 bg-white/90 px-4 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-white dark:border-slate-600/60 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-800">
            Chọn file JSON để import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </GlassCard>

        <GlassCard variant="strong" className="border-red-200 p-4 dark:border-red-800/50 sm:p-5" glow="none">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-400 sm:text-base">
            <Trash size={18} weight="bold" />
            Vùng nguy hiểm
          </h3>
          <button
            onClick={handleClearData}
            className="w-full rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/40"
          >
            Xóa toàn bộ dữ liệu
          </button>
        </GlassCard>

        <GlassCard className="p-4 text-center text-xs text-slate-500 dark:text-slate-400" glow="none">
          <p>Quản Lý Lịch Trình v0.0.1</p>
          <p className="mt-1">Made with 💙 using Next.js & TypeScript</p>
        </GlassCard>
      </div>

      <Navigation />
    </div>
  )
}
